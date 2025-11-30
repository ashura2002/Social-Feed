import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { ProfileService } from '../profile/profile.service';
import { ResponsePost } from './dto/response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  async create(userId: number, createDTO: CreatePostDTO): Promise<any> {
    const user = await this.userService.findById(userId);
    const post = this.postRepository.create({
      ...createDTO,
      user,
    });
    return await this.postRepository.save(post);
  }

  async delete(postId: number, userId: number): Promise<any> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found, Already deleted');

    if (post?.user.id !== userId)
      throw new BadRequestException('You can only delete your own post');
    return await this.postRepository.remove(post);
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

    const response: ResponsePost = {
      ...post,
      mediaUrls: post?.mediaUrls || null,
      user: `${profile?.firstname || 'No Profile'} ${profile?.lastname || 'Added Yet'}`,
    };

    return response;
  }

  async getAll(userId: number): Promise<any> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.user =:userId', { userId })
      .getMany();
    return post;
  }
}
// todo -> fix response shape
//      -> get all post on user
//      -> update post
//      -> view comment on single post
//      -> add crud endpoints on comments
