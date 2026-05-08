// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // if no roles → allow
    if (!requiredRoles) return true;

    const request: any = context.switchToHttp().getRequest();
    const user: any = request.user;

    // 🔥 important safety check
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
