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
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JWTAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/Guards/roles-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { VerifyCode } from './dto/verify-code.dto';
import { CreateVerificationDTO } from './dto/create-verified-user.dto';
import type { AuthRequest } from 'src/common/types/auth-request.type';
import { JwtResponsePayload } from './types/JwtResponsePayload.types';

@Controller('authentication')
@ApiBearerAuth('access-token')
@Throttle({
  register: { limit: 3, ttl: 60 },
  login: { limit: 5, ttl: 20 },
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() verifiedDTO: CreateVerificationDTO,
  ): Promise<{ message: string }> {
    await this.authenticationService.create(verifiedDTO);
    return {
      message: 'OTP sent to your email. Verify to complete registration.',
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() verifyCodeDTO: VerifyCode,
  ): Promise<{ message: string }> {
    const { code } = verifyCodeDTO;
    await this.authenticationService.verifyCode(code);
    return { message: 'Account Created Successfully' };
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
  async logout(@Req() req: AuthRequest): Promise<{ message: string }> {
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
  async googleAuthRedirect(@Req() req: AuthRequest) {
    const jwt = await this.authenticationService.googleLogin(
      req.user as JwtResponsePayload,
    );
    return { message: 'Login Successfully', accessToken: jwt };
  }
}
