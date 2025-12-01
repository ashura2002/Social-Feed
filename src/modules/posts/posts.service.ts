import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { ProfileService } from '../profile/profile.service';
import { ResponsePost } from './dto/response.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    private readonly userService: UsersService,
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
  ) {}

  async create(userId: number, createDTO: CreatePostDTO): Promise<Posts> {
    const user = await this.userService.findById(userId);
    const post = this.postRepository.create({
      ...createDTO,
      user,
    });
    return await this.postRepository.save(post);
  }

  async delete(postId: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found, Already deleted');

    if (post?.user.id !== userId)
      throw new BadRequestException('You can only delete your own post');
    await this.postRepository.remove(post);
  }

  async getById(postId: number): Promise<ResponsePost> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('user.profile', 'profile')
      .select(['post', 'user', 'profile'])
      .where('post.id =:postId', { postId })
      .getOne();

    if (!post) throw new NotFoundException('Post not found');
    const profile = await this.profileService.checkExistingProfile(
      post.user?.id,
    );
    const postWithComments = await this.commentService.getComment(post.id);

    const response: ResponsePost = {
      ...post,
      mediaUrls: post?.mediaUrls || null,
      comments: postWithComments,
      user: `${profile?.firstname || 'No Profile'} ${profile?.lastname || 'Added Yet'}`,
    };

    return response;
  }

  // TODO -> fix response added comment length for get all post

  async getAll(userId: number): Promise<any> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.user =:userId', { userId })
      .getMany();

    const mappedPost = post.map(async (p) => {
      const comments = await this.commentService.getComment(p.id);
      const responseShape = {
        ...post,
        comments: comments.length,
      };
    });

    return post;
  }

  async update(
    postId: number,
    userId: number,
    updateDTO: UpdatePostDTO,
  ): Promise<Posts> {
    const user = await this.userService.findById(userId);
    const post = await this.findSinglePostService(postId);
    if (!post) throw new NotFoundException('Post not found');

    Object.assign(post, updateDTO);
    return await this.postRepository.save(post);
  }

  async findSinglePostService(postId: number): Promise<Posts | null> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    return post;
  }
}
