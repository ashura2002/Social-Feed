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
import { UpdateUserDTO } from './dto/update-user.dto';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/Enums/roles.enums';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  async getCurrentUser(@Req() req): Promise<User> {
    const { userId } = req.user;
    return await this.userService.getCurrentUser(userId);
  }

  @Get('name')
  @HttpCode(HttpStatus.OK)
  async searchUserByName(@Query('firstname') name: string): Promise<User[]> {
    return await this.userService.searchUserByName(name);
  }

  @Get(':userId/details')
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return await this.userService.findById(userId);
  }

  @Patch(':userId')
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateDTO: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(userId, updateDTO);
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
}
