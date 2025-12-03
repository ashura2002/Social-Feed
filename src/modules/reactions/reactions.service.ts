import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { CreateReactionDTO } from './dto/create-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entity/reaction.entity';
import { Repository } from 'typeorm';

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
      reaction: createDTO.reactions,
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
}

// TO DO ->
// push progress
// update, delete comment
// update , delete reaction
