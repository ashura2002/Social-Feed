import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ReactionType } from 'src/common/Enums/reactions.enums';

export class CreateReactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  postId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReactionType)
  reactions: ReactionType;
}
