import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    const user = await this.userRepository.find();
    return user;
  }

  async update(userId: number, updateDTO: UpdateUserDTO): Promise<User> {
    const { password } = updateDTO;
    const user = await this.findById(userId);
    if (password) {
      updateDTO.password = bcrypt.hashSync(password, 10);
    }
    Object.assign(user, updateDTO);
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user!;
  }

  async removeUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    await this.userRepository.remove(user);
  }
}
