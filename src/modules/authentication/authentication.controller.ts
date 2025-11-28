import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtResponsePayload } from './types/JwtResponsePayload.types';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() createDTO: CreateUserDTO): Promise<any> {
    return this.authenticationService.create(createDTO);
  }

  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
  ): Promise<{ message: string; accessToken: JwtResponsePayload }> {
    const accessToken = await this.authenticationService.login(loginDTO);
    return { message: 'Login Successfully', accessToken };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Redirects user to Google OAuth login
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const jwt = await this.authenticationService.googleLogin(req.user);
    return { message: 'Login Successfully', accessToken: jwt };
  }
}
