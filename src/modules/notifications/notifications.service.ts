import { Injectable } from '@nestjs/common';
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
}
// TO DO ->
// add notification to reactions modules
