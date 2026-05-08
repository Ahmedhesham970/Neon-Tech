// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from './role.enum'; // or wherever your enum is

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
