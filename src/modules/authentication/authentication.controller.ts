import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtResponsePayload } from './types/JwtResponsePayload.types';

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
}
