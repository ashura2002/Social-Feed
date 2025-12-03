import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
