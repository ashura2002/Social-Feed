import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreateCommentDTO } from './dto/comments.dto';
import { Comment } from './entity/comment.entity';

@Controller('comments')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Req() req,
    @Body() createDTO: CreateCommentDTO,
  ): Promise<Comment> {
    const { userId } = req.user;
    return await this.commentsService.create(userId, createDTO);
  }
}
