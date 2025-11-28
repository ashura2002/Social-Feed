import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

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
    const loginUser = context.switchToHttp().getRequest().user;
    if (!loginUser || !loginUser.role) return false;
    return requiredRole.includes(loginUser.role);
  }
}
