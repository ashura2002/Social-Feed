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
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreatePostDTO } from './dto/create-post.dto';
import { ResponsePost } from './dto/response.dto';

@Controller('posts')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Req() req, @Body() createDTO: CreatePostDTO): Promise<any> {
    const { userId } = req.user;
    return await this.postsService.create(userId, createDTO);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req,
  ): Promise<any> {
    const { userId } = req.user;
    return await this.postsService.delete(postId, userId);
  }

  @Get('own')
  @HttpCode(HttpStatus.OK)
  async getAllOwnPost(@Req() req): Promise<any> {
    const { userId } = req.user;
    return await this.postsService.getAll(userId);
  }

  @Get('own/:postId')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<ResponsePost> {
    return await this.postsService.getById(postId);
  }
}
