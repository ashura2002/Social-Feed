import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/common/Enums/roles.enums';
import { EmailService } from '../Email/email.service';
import { PasswordReset } from './entity/change-password.entity';
import { VerifyPasswordChangeDTO } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly emailService: EmailService,
  ) {}

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();
    return user;
  }

  async searchUserByName(name: string): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.firstname =:name', { name })
      .getMany();
    return users;
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

  async findOneRoleUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: Roles.User },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async requestPasswordChange(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    //save to the table
    const verificationCode = this.passwordResetRepository.create({
      userId: user.id,
      code: code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });
    await this.passwordResetRepository.save(verificationCode);

    // send code to users email
    await this.emailService.sendVerificationCode(user.email, code);
  }

  async verifyPasswordChange(
    userId: number,
    dto: VerifyPasswordChangeDTO,
  ): Promise<void> {
    const { code, password } = dto;
    const userRecord = await this.passwordResetRepository.findOne({
      where: { userId, code: code },
    });
    // check if has a code
    if (!userRecord) {
      throw new BadRequestException('Invalid code');
    }
    // check if the code is not expire
    if (userRecord.expiresAt < new Date()) {
      throw new BadRequestException('Code expired');
    }

    // hash the password again
    const hash = bcrypt.hashSync(password, 10);

    // update the password
    await this.userRepository.update({ id: userId }, { password: hash });

    // delete the code on table
    await this.passwordResetRepository.remove(userRecord);
  }
}
