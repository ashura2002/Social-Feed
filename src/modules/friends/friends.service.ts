import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entity/friend.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AddFriendDTO } from './dto/add-friend.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { FriendStatus } from 'src/common/Enums/friend-status-enum';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}
  async getAllMyFriend(userId: number) {}

  async addFriend() {}
}
