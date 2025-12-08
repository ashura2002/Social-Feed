import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddFriendDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  userId: number;
}
