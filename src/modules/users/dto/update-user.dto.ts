import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from 'src/common/Enums/roles.enums';

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
