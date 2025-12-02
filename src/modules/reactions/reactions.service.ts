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
  ): Promise<any> {
    const { postId } = createDTO;
    await this.checkExisting(userId);
    const post = await this.postService.getById(postId);
    const users = await this.userService.findById(userId);
    const reaction = this.reactRepository.create({
      reaction: createDTO.reactions,
      post: { id: post.id },
      user: users,
    });
    return await this.reactRepository.save(reaction);
  }

  async getReactions(postId: number): Promise<any> {
    const reactions = await this.reactRepository
      .createQueryBuilder('react')
      .leftJoin('react.user', 'user')
      .leftJoin('react.post', 'post')
      .select(['react.id', 'react.reaction', 'user.id', 'user.email'])
      .where('post.id =:postId', { postId })
      .getMany();
    return reactions;
  }

  async checkExisting(userId: number): Promise<any> {
    const existingReact = await this.reactRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existingReact)
      throw new BadRequestException('You Already React on this Post');
  }
}
