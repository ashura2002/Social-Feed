import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from 'src/common/Enums/roles.enums';

export class CreateUserDTO {
  @ApiProperty({ example: 'Example' })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiProperty({ enum: Roles, example: Roles.User })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
