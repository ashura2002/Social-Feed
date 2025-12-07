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
import { UserVerification } from './entity/user-verification.entity';
import { EmailService } from '../Email/email.service';
import { Roles } from 'src/common/Enums/roles.enums';
import { CreateVerificationDTO } from './dto/create-verified-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserVerification)
    private readonly verificationRepository: Repository<UserVerification>,
    private readonly emailService: EmailService,
  ) {}

  async create(verifiedDTO: CreateVerificationDTO): Promise<void> {
    const { username, email } = verifiedDTO;
    const existingEmail = await this.userService.findByEmail(email);
    const existingUsername = await this.userService.findByUsername(username);

    if (existingEmail || existingUsername)
      throw new ConflictException('Username or Email already taken.');

    // Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the verification
    const verified = this.verificationRepository.create({
      ...verifiedDTO,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.verificationRepository.save(verified);

    // Send email
    await this.emailService.sendVerificationCode(email, code);
  }

  async verifyCode(code: string): Promise<void> {
    const verification = await this.verificationRepository.findOne({
      where: { code },
    });
    if (!verification) {
      throw new BadRequestException('Invalid verification code.');
    }
    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('Verification code expired.');
    }
    // Create user
    const verifiedUser = this.userRepository.create({
      username: verification.username,
      email: verification.email,
      password: verification.password,
      role: verification.role,
    });
    await this.userRepository.save(verifiedUser);

    // Delete verification row
    await this.verificationRepository.remove(verification);
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
