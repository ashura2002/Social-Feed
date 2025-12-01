import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/comments.dto';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createDTO: CreateCommentDTO): Promise<Comment> {
    const { post } = createDTO;
    const user = await this.userService.findById(userId);
    const posts = await this.postService.findSinglePostService(post);

    if (!posts) throw new BadRequestException(`Comment is not available`);

    const comment = this.commentRepository.create({
      ...createDTO,
      user: user,
      post: posts,
    });

    return await this.commentRepository.save(comment);
  }

  async getComment(postId: number): Promise<any> {
    const comments = await this.commentRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'user')
      .select(['comments', 'user.id', 'user.email'])
      .where('comments.post =:postId', { postId })
      .getMany();
    return comments;
  }
}
