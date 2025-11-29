import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/user.entity';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtResponsePayload } from './types/JwtResponsePayload.types';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from 'src/common/Enums/user-status.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { username, email } = createUserDTO;
    const existingEmail = await this.userService.findByEmail(email);
    const existingUsername = await this.userService.findByUsername(username);

    if (
      username === existingUsername?.username ||
      email === existingEmail?.email
    )
      throw new ConflictException('Username or Email was already taken!');

    const user = this.userRepository.create(createUserDTO);
    return await this.userRepository.save(user);
  }

  async login(loginDTO: LoginDTO): Promise<string> {
    const { username, password } = loginDTO;
    const user = await this.userService.findByUsername(username);
    if (username !== user?.username)
      throw new BadRequestException('User not found');

    const isHashPassword = await bcrypt.compare(password, user.password);
    if (!isHashPassword) throw new BadRequestException('Invalid Credentials');

    // turn to active if the user is successfully login
    user.status = UserStatus.Active;
    await this.userRepository.save(user);

    const payload: JwtResponsePayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    user.status = UserStatus.InActive;
    await this.userRepository.save(user);
  }

  async googleLogin(googleUser: any) {
    const { email } = googleUser;
    // check if user is existing
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(
        'Your email account is not registered. Contact admin.',
      );
    }
    // if exist create token
    const payload: JwtResponsePayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
