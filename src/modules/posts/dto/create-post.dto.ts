import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisibilityOptions } from 'src/common/Enums/visibility.enums';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  mediaUrls: string[];

  @IsNotEmpty()
  @IsEnum(VisibilityOptions)
  visibility: VisibilityOptions;
}
