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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/Enums/roles.enums';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VerifyPasswordChangeDTO } from './dto/update-password.dto';
import type { AuthRequest } from 'src/common/types/auth-request.type';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.OK)
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('current')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: AuthRequest): Promise<User> {
    const { userId } = req.user;
    return await this.userService.getCurrentUser(userId);
  }

  @Get('name')
  @HttpCode(HttpStatus.OK)
  async searchUserByName(@Query('firstname') name: string): Promise<User[]> {
    return await this.userService.searchUserByName(
      `${name.slice(0, 1).toUpperCase()}${name.slice(1).toLowerCase()}`,
    );
  }

  @Get(':userId/details')
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return await this.userService.findById(userId);
  }

  @Delete(':userId')
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    await this.userService.removeUser(userId);
    return { message: 'Deleted Successfully' };
  }

  @Get('request-change-password')
  async requestPasswordChange(
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.userService.requestPasswordChange(userId);
    return {
      message: 'Verification code sent to your email successfully.',
    };
  }

  @Patch('verify-change-password')
  async verifyChangePassword(
    @Req() req: AuthRequest,
    @Body() dto: VerifyPasswordChangeDTO,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.userService.verifyPasswordChange(userId, dto);
    return {
      message: 'Password successfully changed.',
    };
  }
}
