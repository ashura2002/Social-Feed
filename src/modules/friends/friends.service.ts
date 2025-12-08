import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllPendingFriendRequest(userId: number): Promise<Friend[]> {
    const pendingRequest = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .leftJoinAndSelect('friend.requester', 'requester')
      .where('receiver.id =:userId', { userId })
      .andWhere('friend.status =:status', { status: FriendStatus.PENDING })
      .getMany();

    return pendingRequest;
  }

  async getAllMyFriend(userId: number): Promise<Friend[]> {
    return await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.requester', 'requester')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .where('friend.status = :status', { status: FriendStatus.ACCEPTED })
      .andWhere('(requester.id = :userId OR receiver.id = :userId)', { userId })
      .getMany();
  }

  async addFriend(userId: number, addFriendDTO: AddFriendDTO): Promise<Friend> {
    const requester = await this.userService.findById(userId);
    const receiver = await this.userService.findById(addFriendDTO.userId);

    const existingFriend = await this.friendRepository.findOne({
      where: { requester: { id: userId }, receiver: { id: receiver.id } },
    });

    if (existingFriend)
      throw new BadRequestException('You already send a friend request');

    if (requester.id === addFriendDTO.userId)
      throw new BadRequestException(`Invalid Action, You can't add your own`);

    const friendRequest = this.friendRepository.create({
      requester: requester,
      receiver: receiver,
      status: FriendStatus.PENDING,
    });

    // notify the user that been received the friend request
    await this.notificationService.create(receiver.id, {
      message: `${requester.email} is sending you a friend request.`,
    });

    return await this.friendRepository.save(friendRequest);
  }

  async findOneFriendRequest(
    friendRequestID: number,
    userId: number,
  ): Promise<Friend> {
    const friendRequest = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .leftJoinAndSelect('friend.requester', 'requester')
      .where('friend.id =:friendRequestID', { friendRequestID })
      .andWhere('receiver.id =:userId', { userId })
      .getOne();

    if (!friendRequest) throw new NotFoundException();

    return friendRequest;
  }
}
