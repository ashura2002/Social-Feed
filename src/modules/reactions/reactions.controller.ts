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
import { ReactionsService } from './reactions.service';
import { CreateReactionDTO } from './dto/create-reaction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { Reaction } from './entity/reaction.entity';
import { UpdateReactionDTO } from './dto/update-reaction.dto';

@Controller('reactions')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async cretePost(
    @Body() createDTO: CreateReactionDTO,
    @Req() req,
  ): Promise<Reaction> {
    const { userId } = req.user;
    return await this.reactionsService.createReaction(createDTO, userId);
  }

  @Patch(':reactionId')
  async updateReaction(
    @Param('reactionId', ParseIntPipe) reactionId: number,
    @Req() req,
    @Body() updateDTO: UpdateReactionDTO,
  ): Promise<Reaction> {
    const { userId } = req.user;
    return await this.reactionsService.updateReaction(
      reactionId,
      userId,
      updateDTO,
    );
  }

  @Delete(':reactionId')
  async deleteReaction(
    @Param('reactionId', ParseIntPipe) reactionId: number,
    @Req() req,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.reactionsService.deleteReaction(reactionId, userId);
    return {
      message: 'Deleted Successfully',
    };
  }
}
