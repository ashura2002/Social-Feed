import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  phonenumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;
}
