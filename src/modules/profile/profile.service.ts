import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { ProfileResponseDTO } from './dto/response.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UsersService,
  ) {}

  async createProfile(
    userId: number,
    createProfileDTO: CreateProfileDTO,
    avatar?: Express.Multer.File,
  ): Promise<Profile> {
    const user = await this.userService.findById(userId);
    const existed = await this.checkExistingProfile(userId);
    if (existed)
      throw new ConflictException(
        'Profile is already exiting if you want to modify try to update',
      );

    const profile = this.profileRepository.create({
      ...createProfileDTO,
      avatar: avatar?.filename,
      user,
    });
    return await this.profileRepository.save(profile);
  }

  async getOwnProfile(userId: number): Promise<ProfileResponseDTO> {
    const user = await this.userService.findById(userId);
    const profileEntity = await this.checkExistingProfile(userId);

    if (!profileEntity) {
      throw new NotFoundException('You have not created your profile yet.');
    }

    return {
      id: profileEntity.id,
      firstname: profileEntity.firstname,
      lastname: profileEntity.lastname,
      age: profileEntity.age,
      avatar: profileEntity.avatar,
      phonenumber: profileEntity.phonenumber,
      address: profileEntity.address,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDTO,
    avatar?: Express.Multer.File,
  ): Promise<Profile> {
    const profile = await this.checkExistingProfile(userId);
    if (!profile)
      throw new NotFoundException('You have not created your profile yet.');

    Object.assign(profile, dto);
    if (avatar) profile.avatar = avatar.filename;

    return await this.profileRepository.save(profile);
  }

  async deleteProfile(userId: number): Promise<void> {
    const profile = await this.checkExistingProfile(userId);
    if (!profile)
      throw new NotFoundException('Profile already deleted, Not found');

    await this.profileRepository.remove(profile);
  }

  async checkExistingProfile(userId: number): Promise<Profile | null> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    return profile;
  }
}
// to do ->
// posts module
// comment
// notifications with websocket
