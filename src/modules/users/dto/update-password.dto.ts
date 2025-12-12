import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class VerifyPasswordChangeDTO {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @MinLength(3)
  password: string;
}
