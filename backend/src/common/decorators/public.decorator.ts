import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/app.constants';

/**
 * Marks a controller or route as public so auth and permission guards skip authentication checks.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
