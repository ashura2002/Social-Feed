import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { UserStatus } from '../Enums/user-status.enum';
import { AuthRequest } from '../types/auth-request.type';
import { JwtResponsePayload } from 'src/modules/authentication/types/JwtResponsePayload.types';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const accessToken = this.attachToHeaders(request);
    if (!accessToken) throw new UnauthorizedException();

    try {
      // verify token
      const payload = await this.jwtService.verifyAsync<JwtResponsePayload>(
        accessToken,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (!payload || typeof payload.userId !== 'number')
        throw new UnauthorizedException();

      // get user from db
      const user = await this.userService.findById(payload.userId);

      // block the inActive user
      if (user.status === UserStatus.InActive)
        throw new ForbiddenException('User is logout, Login again');

      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private attachToHeaders<T extends Request>(request: T): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [bearer, token] = authHeader.split(' ');
    return bearer === 'Bearer' ? token : null;
  }
}
