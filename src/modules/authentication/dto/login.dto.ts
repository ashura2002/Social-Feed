import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'example' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;
}
