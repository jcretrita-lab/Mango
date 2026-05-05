import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, type UserRole } from '../constants/app.constants';

export const Roles = (...roles: readonly UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
