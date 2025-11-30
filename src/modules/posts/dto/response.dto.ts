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
  dislikes: number;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  user: string;
}
