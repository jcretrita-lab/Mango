import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokenPayload } from '../auth/auth.types';
import { IS_PUBLIC_KEY } from '../constants/app.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * Connects JWT verification with Nest metadata lookup so @Public routes bypass auth and protected routes get request.user.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Allows @Public routes or verifies Bearer JWTs and attaches identity/session claims to request.user.
   */
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: unknown;
    }>();

    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      const payload = this.jwtService.verify<AuthTokenPayload>(token);
      if (
        !Number.isInteger(payload.backendUserId) ||
        !Number.isInteger(payload.sid)
      ) {
        throw new Error('JWT is missing required session claims.');
      }
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  /**
   * Extracts the raw JWT from the Authorization header format expected by all protected API routes.
   */
  private extractTokenFromHeader(
    authorization: string | undefined,
  ): string | null {
    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    return authorization.slice(7);
  }
}
