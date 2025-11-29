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
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Profile } from './entity/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileResponseDTO } from './dto/response.dto';

@Controller('profile')
@UseGuards(JWTAuthGuard, RoleAuthGuard)
@ApiBearerAuth('access-token')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createProfile(
    @Req() req,
    @Body() createProfileDTO: CreateProfileDTO,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Profile> {
    const { userId } = req.user;
    return await this.profileService.createProfile(
      userId,
      createProfileDTO,
      avatar,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOwnProfile(@Req() req): Promise<ProfileResponseDTO> {
    const { userId } = req.user;
    return await this.profileService.getOwnProfile(userId);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDTO,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Profile> {
    const { userId } = req.user;
    return this.profileService.updateProfile(userId, dto, avatar);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Req() req): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.profileService.deleteProfile(userId);
    return { message: 'Profile deleted Successfully' };
  }
}
