import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { RequestOptionsDTO } from './dto/friend-request-options.dto';

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

  @Get('requester')
  @HttpCode(HttpStatus.OK)
  async getAllMyFriendRequest(@Req() req): Promise<Friend[]> {
    const { userId } = req.user;
    return await this.friendsService.getAllMyFriendRequest(userId);
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

  @Patch('decision/:requestId')
  @HttpCode(HttpStatus.CREATED)
  async friendRequestDecision(
    @Body() requestOptionsDTO: RequestOptionsDTO,
    @Req() req,
    @Param('requestId') requestId: number,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.friendsService.friendRequestDecision(
      requestOptionsDTO,
      userId,
      requestId,
    );
    return {
      message: `Friend request is successfully ${requestOptionsDTO.status}.`,
    };
  }

  @Delete(':friendRequestID')
  @HttpCode(HttpStatus.OK)
  async deleteRequest(
    @Param('friendRequestID', ParseIntPipe) friendRequestID: number,
    @Req() req,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.friendsService.deleteRequest(friendRequestID, userId);
    return { message: 'Deleted Successfully' };
  }
}
