import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY, type UserRole } from '../constants/app.constants';

export interface AuthTokenPayload {
  sub: string;
  backendUserId?: number;
  email: string;
  role: UserRole;
  employeeId?: string;
  permissions?: string[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

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
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractTokenFromHeader(
    authorization: string | undefined,
  ): string | null {
    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    return authorization.slice(7);
  }
}
