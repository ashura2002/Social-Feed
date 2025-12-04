import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  @Delete(':notificationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req,
  ): Promise<void> {
    const { userId } = req.user;
    return await this.notificationsService.deleteNotification(
      notificationId,
      userId,
    );
  }

  @Put(':notificationId')
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req,
  ): Promise<Notification> {
    const { userId } = req.user;
    return await this.notificationsService.updateNotification(
      notificationId,
      userId,
    );
  }
}
