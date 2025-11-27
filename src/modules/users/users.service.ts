import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { username, email } = createUserDTO;
    const existingEmail = await this.findByEmail(email);
    const existingUsername = await this.findByUsername(username);

    if (
      username === existingUsername?.username ||
      email === existingEmail?.email
    )
      throw new ConflictException('Username or Email was already taken!');

    const user = this.userRepository.create(createUserDTO);
    return await this.userRepository.save(user);
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }

  private async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }
}

// ipacheck sa chatgpt -> findByUsername and findByEmail
