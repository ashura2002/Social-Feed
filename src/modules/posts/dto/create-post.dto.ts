import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisibilityOptions } from 'src/common/Enums/visibility.enums';

export class CreatePostDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  mediaUrls: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VisibilityOptions)
  visibility: VisibilityOptions;
}
