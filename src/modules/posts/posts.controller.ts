import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreatePostDTO } from './dto/create-post.dto';
import { ResponsePost } from './dto/response.dto';
import { Posts } from './entity/post.entity';
import { UpdatePostDTO } from './dto/update-post.dto';

@Controller('posts')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Req() req,
    @Body() createDTO: CreatePostDTO,
  ): Promise<Posts> {
    const { userId } = req.user;
    return await this.postsService.create(userId, createDTO);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.postsService.delete(postId, userId);
    return { message: 'Post Deleted Successfully' };
  }

  @Get('own')
  @HttpCode(HttpStatus.OK)
  async getAllOwnPost(@Req() req): Promise<any> {
    const { userId } = req.user;
    return await this.postsService.getAll(userId);
  }

  @Put('own/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req,
    @Body() updateDTO: UpdatePostDTO,
  ): Promise<Posts> {
    const { userId } = req.user;
    return await this.postsService.update(postId, userId, updateDTO);
  }

  @Get('own/:postId')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<ResponsePost> {
    return await this.postsService.getById(postId);
  }
}
