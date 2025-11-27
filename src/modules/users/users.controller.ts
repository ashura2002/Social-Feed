import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createDTO: CreateUserDTO): Promise<User> {
    return await this.userService.create(createDTO);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':userId/details')
  async findUserById(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.findById(userId);
  }
}
