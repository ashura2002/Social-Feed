import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from 'src/common/Enums/roles.enums';

export class UpdateUserDTO {
  @ApiProperty({
    example: 'example',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiProperty({ enum: Roles })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
