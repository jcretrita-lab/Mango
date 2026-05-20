import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client';
import type { Request } from 'express';
import {
  buildAuthenticatedRequestUser,
  type AuthenticatedRequestUser,
  type AuthTokenPayload,
  type UserAccessRecord,
} from '../auth/auth.types';
import { IS_PUBLIC_KEY } from '../constants/app.constants';
import { PHASE1_STATUS } from '../constants/domain-status.constants';
import {
  PERMISSIONS_KEY,
  type PermissionCode,
} from '../constants/permissions.constants';
import { PrismaService } from '../../core/prisma/prisma.service';

type RequestWithAuth = Request & {
  user?: AuthTokenPayload | AuthenticatedRequestUser;
};

// Checks whether request.user still contains the raw JWT payload from JwtAuthGuard.
function isTokenPayload(
  user: AuthTokenPayload | AuthenticatedRequestUser | undefined,
): user is AuthTokenPayload {
  return Boolean(
    user &&
    Number.isInteger((user as AuthTokenPayload).backendUserId) &&
    Number.isInteger((user as AuthTokenPayload).sid),
  );
}

// Returns true when the actor has at least one permission required by the route.
function hasPermission(
  user: AuthenticatedRequestUser,
  requiredPermissions: readonly PermissionCode[],
): boolean {
  if (requiredPermissions.length === 0) {
    return true;
  }

  const permissions = new Set(user.permissions);
  return requiredPermissions.some((permission) => permissions.has(permission));
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  // Main guard entry point: skips public routes, loads route permissions, resolves the DB user/session, and allows or denies the request.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<
      readonly PermissionCode[] | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (requiredPermissions === undefined) {
      throw new ForbiddenException(
        'This route has no permission policy configured.',
      );
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    if (!isTokenPayload(request.user)) {
      throw new UnauthorizedException('No authenticated session provided.');
    }

    const actor = await this.resolveActor(request.user);
    request.user = actor;

    if (hasPermission(actor, requiredPermissions)) {
      return true;
    }

    await this.writeAuditEvent(actor, request, 'AUTH_PERMISSION_DENIED', {
      requiredPermissions: [...requiredPermissions],
    });

    throw new ForbiddenException('You do not have access to this resource.');
  }

  private async resolveActor(
    payload: AuthTokenPayload,
  ): Promise<AuthenticatedRequestUser> {
    // Verifies that the JWT session still exists, is active, is not revoked, and has not expired.
    const now = new Date();
    const session = await this.prisma.userSession.findFirst({
      where: {
        id: payload.sid,
        userId: payload.backendUserId,
        status: PHASE1_STATUS.ACTIVE,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session is no longer active.');
    }

    // Reloads the user, active roles, and active permissions from the database so revoked access takes effect immediately.
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.backendUserId,
        email: payload.email,
        status: PHASE1_STATUS.ACTIVE,
        isActive: true,
      },
      include: {
        roleAssignments: {
          where: {
            isActive: true,
            role: { status: PHASE1_STATUS.ACTIVE },
          },
          include: {
            role: {
              include: {
                rolePermissionAssignments: {
                  where: {
                    isActive: true,
                    permission: { status: PHASE1_STATUS.ACTIVE },
                  },
                  include: {
                    permission: {
                      select: {
                        code: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Authenticated user is no longer active.',
      );
    }

    return buildAuthenticatedRequestUser(user as UserAccessRecord, session.id);
  }

  // Records permission failures so security-related denials are visible in the audit trail.
  private async writeAuditEvent(
    actor: AuthenticatedRequestUser,
    request: Request,
    eventType: string,
    metadataJson?: Prisma.InputJsonObject,
  ): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        actorUserId: actor.backendUserId,
        eventType,
        route: request.originalUrl ?? request.url,
        ipAddress: request.ip,
        userAgent: request.header('user-agent'),
        metadataJson,
      },
    });
  }
}
