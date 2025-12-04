import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { Notification } from './entity/notification.entity';

@Controller('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @Req() req,
    @Body() createDTO: CreateNotificationDTO,
  ): Promise<Notification> {
    const { userId } = req.user;
    return await this.notificationsService.create(userId, createDTO);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getOwnNotification(@Req() req): Promise<Notification[]> {
    const { userId } = req.user;
    return await this.notificationsService.getOwnNotification(userId);
  }
}
