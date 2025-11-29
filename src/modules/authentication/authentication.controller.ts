import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/Enums/roles.enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('authentication')
@ApiBearerAuth('access-token')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(JWTAuthGuard, RoleAuthGuard)
  @Role(Roles.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createDTO: CreateUserDTO): Promise<any> {
    return this.authenticationService.create(createDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDTO: LoginDTO) {
    const accessToken = await this.authenticationService.login(loginDTO);
    return { message: 'Login Successfully', accessToken };
  }

  @UseGuards(JWTAuthGuard, RoleAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.CREATED)
  async logout(@Req() req): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.authenticationService.logout(userId);
    return { message: 'Logout Successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  googleAuth() {
    // Redirects user to Google OAuth login
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleAuthRedirect(@Req() req) {
    const jwt = await this.authenticationService.googleLogin(req.user);
    return { message: 'Login Successfully', accessToken: jwt };
  }
}
