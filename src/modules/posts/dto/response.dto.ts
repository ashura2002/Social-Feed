import { ApiProperty } from '@nestjs/swagger';

export class ResponsePost {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  mediaUrls: string[] | null;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  comments: string[];

  @ApiProperty()
  dislikes: number;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  user: string;
}
