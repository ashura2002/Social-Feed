import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateNotificationDTO } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UsersService,
  ) {}

  async create(
    userId: number,
    createDTO: CreateNotificationDTO,
  ): Promise<Notification> {
    const user = await this.userService.findById(userId);
    const notification = this.notificationRepository.create({
      user: user,
      message: createDTO.message,
    });
    return await this.notificationRepository.save(notification);
  }

  async getOwnNotification(userId: number): Promise<Notification[]> {
    const notification = await this.notificationRepository.find({
      where: { user: { id: userId } },
    });
    return notification;
  }

  async updateNotification(
    notificationId: number,
    userId: number,
  ): Promise<Notification> {
    const notification = await this.findOne(notificationId);

    if (!notification) throw new NotFoundException('Notification not found');

    if (notification?.user?.id !== userId)
      throw new BadRequestException(
        'You can only mark as read your own notification',
      );
    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }

  async deleteNotification(
    notificationId: number,
    userId: number,
  ): Promise<void> {
    const notification = await this.findOne(notificationId);

    if (!notification)
      throw new NotFoundException('Notification not found, Already deleted');
    if (notification.user.id !== userId)
      throw new BadRequestException(
        'You can only delete your own notifications',
      );
    await this.notificationRepository.remove(notification);
  }

  async findOne(notificationId: number): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    return notification;
  }
}
