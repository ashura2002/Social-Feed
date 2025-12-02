import { Injectable } from '@nestjs/common';
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
    private readonly postService: PostsService,
    private readonly userService: UsersService,
  ) {}

  async createReaction(
    postId: number,
    createDTO: CreateReactionDTO,
  ): Promise<any> {
    const post = await this.postService.getById(postId);
    return post;
  }
}
