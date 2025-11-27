import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':userId/details')
  async findUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return await this.userService.findById(userId);
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateDTO: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(userId, updateDTO);
  }
}
