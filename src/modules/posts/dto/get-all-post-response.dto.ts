import { ApiProperty } from '@nestjs/swagger';

export class GetAllPostResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  mediaUrls: string[] | null;

  @ApiProperty()
  comments: number;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  dislikes: number;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
