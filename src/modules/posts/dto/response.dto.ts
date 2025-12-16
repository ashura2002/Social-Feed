import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from 'src/modules/reactions/entity/reaction.entity';

export class ResponsePost {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  mediaUrls: string[] | null;

  @ApiProperty()
  comments: string[];

  @ApiProperty()
  reactions: Reaction[];

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  user: string;

  @ApiProperty()
  userId?: number;
}
