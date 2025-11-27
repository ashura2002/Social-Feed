import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from 'src/common/Enums/roles.enums';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
