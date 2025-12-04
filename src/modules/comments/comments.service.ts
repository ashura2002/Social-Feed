import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/comments.dto';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
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

    // check if the current user is the owner of the post
    // to avoid creating notification if owner comment own postF
    if (user.id !== posts.user.id) {
      await this.notificationService.create(posts.user?.id, {
        message: `${user.email} is commented on your post`,
      });
    }

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

  async updateComment(
    commentId: number,
    userId: number,
    updateDTO: UpdateCommentDTO,
  ): Promise<Comment> {
    const comment = await this.findOneComment(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user?.id !== userId)
      throw new BadRequestException('You can only modify your own comment');

    Object.assign(comment, updateDTO);
    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.findOneComment(commentId);

    if (!comment) throw new NotFoundException('comment not found');
    if (comment.user?.id !== userId)
      throw new BadRequestException('You can only delete your own comment');
    await this.commentRepository.remove(comment);
  }

  async findOneComment(commentId: number): Promise<Comment | null> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.id =:commentId', { commentId })
      .getOne();

    return comment;
  }
}
