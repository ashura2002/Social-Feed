import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { AddFriendDTO } from './dto/add-friend.dto';
import { Friend } from './entity/friend.entity';

@Controller('friends')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMyFriends(@Req() req): Promise<Friend[]> {
    const { userId } = req.user;
    return await this.friendsService.getAllMyFriend(userId);
  }

  @Get('friend-request')
  @HttpCode(HttpStatus.OK)
  async getAllPendingFriendRequest(@Req() req): Promise<Friend[]> {
    const { userId } = req.user;
    return await this.friendsService.getAllPendingFriendRequest(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Req() req,
    @Body() addFriendDTO: AddFriendDTO,
  ): Promise<Friend> {
    const { userId } = req.user;
    return await this.friendsService.addFriend(userId, addFriendDTO);
  }

  @Get(':friendRequestID')
  @HttpCode(HttpStatus.OK)
  async findOneFriendRequest(
    @Param('friendRequestID', ParseIntPipe) friendRequestID: number,
    @Req() req,
  ): Promise<Friend> {
    const { userId } = req.user;
    return await this.friendsService.findOneFriendRequest(
      friendRequestID,
      userId,
    );
  }
}
