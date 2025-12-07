import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCode {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
}
