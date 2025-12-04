import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ReactionType } from 'src/common/Enums/reactions.enums';

export class CreateReactionDTO {
  @ApiProperty({ description: 'Post Id' })
  @IsNotEmpty()
  @IsInt()
  postId: number;

  @ApiProperty({ enum: ReactionType })
  @IsNotEmpty()
  @IsEnum(ReactionType)
  reaction: ReactionType;
}
