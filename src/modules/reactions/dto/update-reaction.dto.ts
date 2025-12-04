import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from 'src/common/Enums/reactions.enums';

export class UpdateReactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReactionType)
  reaction: ReactionType;
}
