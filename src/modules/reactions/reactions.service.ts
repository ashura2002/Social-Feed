import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { CreateReactionDTO } from './dto/create-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entity/reaction.entity';
import { Repository } from 'typeorm';
import { UpdateReactionDTO } from './dto/update-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactRepository: Repository<Reaction>,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  async createReaction(
    createDTO: CreateReactionDTO,
    userId: number,
  ): Promise<Reaction> {
    const { postId } = createDTO;
    await this.checkExisting(userId, postId);
    const post = await this.postService.getById(postId);
    const users = await this.userService.findById(userId);
    const reaction = this.reactRepository.create({
      reaction: createDTO.reaction,
      post: { id: post.id },
      user: users,
    });
    return await this.reactRepository.save(reaction);
  }

  async getReactions(postId: number): Promise<Reaction[]> {
    const reactions = await this.reactRepository
      .createQueryBuilder('react')
      .leftJoin('react.user', 'user')
      .leftJoin('react.post', 'post')
      .select(['react.id', 'react.reaction', 'user.id', 'user.email'])
      .where('post.id =:postId', { postId })
      .getMany();
    return reactions;
  }

  async checkExisting(
    userId: number,
    postId: number,
  ): Promise<Reaction | null> {
    const existingReact = await this.reactRepository
      .createQueryBuilder('react')
      .where('react.user =:userId', { userId })
      .andWhere('react.post =:postId', { postId })
      .getOne();

    if (existingReact)
      throw new BadRequestException(
        `You can't react multiple times on a single post`,
      );
    return existingReact;
  }

  async updateReaction(
    reactionId: number,
    userId: number,
    updateDTO: UpdateReactionDTO,
  ): Promise<Reaction> {
    const reaction = await this.findOneReaction(reactionId);
    if (!reaction) throw new NotFoundException('Reaction not found');
    if (reaction?.user?.id !== userId)
      throw new BadRequestException('You can only modify your own reactions');

    Object.assign(reaction, updateDTO);
    return await this.reactRepository.save(reaction);
  }

  async deleteReaction(reactionId: number, userId: number): Promise<void> {
    const reaction = await this.findOneReaction(reactionId);

    if (!reaction) throw new NotFoundException('Reaction not found');
    if (reaction?.user?.id !== userId)
      throw new BadRequestException('You can only modify your own reactions');

    await this.reactRepository.remove(reaction);
  }

  async findOneReaction(reactionId: number): Promise<Reaction | null> {
    const reaction = await this.reactRepository
      .createQueryBuilder('react')
      .leftJoinAndSelect('react.post', 'post')
      .leftJoinAndSelect('react.user', 'user')
      .where('react.id =:reactionId', { reactionId })
      .getOne();

    return reaction;
  }
}

// To do
// push progress -m "Feat: added delete and update reactions controller -> service"
// implement websocket for realtime update on notifications
