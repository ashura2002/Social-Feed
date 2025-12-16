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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreatePostDTO } from './dto/create-post.dto';
import { ResponsePost } from './dto/response.dto';
import { Posts } from './entity/post.entity';
import { UpdatePostDTO } from './dto/update-post.dto';
import { GetAllPostResponse } from './dto/get-all-post-response.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import type { AuthRequest } from 'src/common/types/auth-request.type';

@Controller('posts')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // for multiple file uploads fieldname, max number of files, multerconfig/path
  @UseInterceptors(FilesInterceptor('mediaUrls', 5, multerConfig))
  async createPost(
    @Req() req: AuthRequest,
    @Body() createDTO: CreatePostDTO,
    @UploadedFiles() files: Express.Multer.File[], // array for multiple file uploads
  ): Promise<Posts> {
    const { userId } = req.user;
    const fileUploaded = files.map((file) => file.path);
    const post = await this.postsService.create(userId, {
      ...createDTO,
      mediaUrls: fileUploaded,
    });
    return post;
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.postsService.delete(postId, userId);
    return { message: 'Post Deleted Successfully' };
  }

  @Get('own')
  @HttpCode(HttpStatus.OK)
  async getAllOwnPost(@Req() req: AuthRequest): Promise<GetAllPostResponse[]> {
    const { userId } = req.user;
    return await this.postsService.getAll(userId);
  }

  @Put('own/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthRequest,
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
