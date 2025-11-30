import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';

@Controller('posts')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost():Promise<any>{
    
  }

}
