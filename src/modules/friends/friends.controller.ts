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
import { FriendsService } from './friends.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { AddFriendDTO } from './dto/add-friend.dto';

@Controller('friends')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMyFriends(@Req() req): Promise<any> {
    const { userId } = req.user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Req() req,
    @Body() addFriendDTO: AddFriendDTO,
  ): Promise<any> {
    const { userId } = req.user;
  }
}
