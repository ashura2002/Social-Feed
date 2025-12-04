import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDTO {
  @ApiProperty({
    description: 'Notification message',
    example: 'Your post received a like!',
  })
  @IsNotEmpty()
  message: string;
}
