import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDTO } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async cretePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createDTO: CreateReactionDTO,
  ): Promise<any> {
    return await this.reactionsService.createReaction(postId, createDTO);
  }
}
