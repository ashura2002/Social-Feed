import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreateCommentDTO } from './dto/comments.dto';
import { Comment } from './entity/comment.entity';
import { Request } from 'express';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@Controller('comments')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Req() req,
    @Body() createDTO: CreateCommentDTO,
  ): Promise<Comment> {
    const { userId } = req.user;
    return await this.commentsService.create(userId, createDTO);
  }

  @Patch(':commentId')
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
    @Body() updateDTO: UpdateCommentDTO,
  ): Promise<Comment> {
    const { userId } = req.user;
    return await this.commentsService.updateComment(
      commentId,
      userId,
      updateDTO,
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.commentsService.deleteComment(commentId, userId);
    return {
      message: 'Deleted Successfully',
    };
  }
}
