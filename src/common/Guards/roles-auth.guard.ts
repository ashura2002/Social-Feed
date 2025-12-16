import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from '../types/auth-request.type';
import { JwtResponsePayload } from 'src/modules/authentication/types/JwtResponsePayload.types';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //for route that dont need roles to access
    if (!requiredRole) return true;

    //check the role of the login user
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const loginUser: JwtResponsePayload | undefined = request.user;

    if (!loginUser || !loginUser.role) return false;
    return requiredRole.includes(loginUser.role);
  }
}
