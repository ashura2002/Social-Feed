import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';
import { UserStatus } from '../Enums/user-status.enum';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.attachToHeaders(request);
    if (!accessToken) throw new UnauthorizedException();

    try {
      // verify token
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      // get user from db
      const user = await this.userService.findById(payload.userId);

      // block the inActive user
      if (user.status === UserStatus.InActive)
        throw new ForbiddenException('User is logout, Login again');

      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private attachToHeaders(request: Request): string | null {
    const [bearer, accessToken] =
      request.headers.authorization?.split(' ') ?? [];
    return bearer === 'Bearer' ? accessToken : null;
  }
}
