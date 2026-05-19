import { SetMetadata } from '@nestjs/common';
import {
  PERMISSIONS_KEY,
  type PermissionCode,
} from '../constants/permissions.constants';

/**
 * Attaches one-or-more permission options to a route. A user may proceed when any listed permission is active.
 * Passing no permissions means the route requires a valid authenticated session only.
 */
export const RequirePermissions = (...permissions: readonly PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
