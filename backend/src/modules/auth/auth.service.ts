import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../../generated/prisma/client';
import { compare } from 'bcryptjs';
import {
  buildAuthenticatedUser,
  type AuthenticatedRequestUser,
  type AuthenticatedUser,
  type UserAccessRecord,
} from '../../common/auth/auth.types';
import { PHASE1_STATUS } from '../../common/constants/domain-status.constants';
import {
  JWT_EXPIRES_IN_CONFIG_KEY,
  type EnvironmentConfiguration,
} from '../../config/configuration';
import { PrismaService } from '../../core/prisma/prisma.service';

interface LoginRequestContext {
  readonly userAgent?: string;
  readonly ipAddress?: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  token: string;
}

type CredentialRecord = {
  id: number;
  passwordHash: string;
  failedLoginCount: number;
  lockedUntil?: Date | null;
};

type UserWithCredentialAccess = UserAccessRecord & {
  isActive: boolean;
  status: string;
  credential?: CredentialRecord | null;
};

const LOGIN_LOCK_THRESHOLD = 5;
const LOGIN_LOCK_MINUTES = 15;
const DEFAULT_SESSION_EXPIRES_IN_MS = 8 * 60 * 60 * 1000;

// Converts JWT_EXPIRES_IN values like "15m", "8h", or "7d" into milliseconds.
function parseExpiresIn(value: string | undefined): number {
  const match = value?.trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    return DEFAULT_SESSION_EXPIRES_IN_MS;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return DEFAULT_SESSION_EXPIRES_IN_MS;
  }
}

// Checks whether too many failed login attempts temporarily locked this credential.
function isCredentialLocked(credential: CredentialRecord): boolean {
  return Boolean(credential.lockedUntil && credential.lockedUntil > new Date());
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvironmentConfiguration>,
  ) {}

  async login(
    email: string | undefined,
    password: string | undefined,
    context: LoginRequestContext = {},
  ): Promise<LoginResult> {
    // Normalize input so email matching is case-insensitive and empty values fail safely.
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    const rawPassword = password ?? '';

    if (!normalizedEmail || !rawPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Load the user with credential, active roles, and active permissions in one query.
    const user = (await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        credential: true,
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
    })) as UserWithCredentialAccess | null;

    if (
      !user ||
      !user.credential ||
      !user.isActive ||
      user.status !== PHASE1_STATUS.ACTIVE
    ) {
      // Use the same public error message so attackers cannot learn which emails exist.
      await this.writeAuditEvent(null, 'AUTH_LOGIN_FAILED', context, {
        email: normalizedEmail,
        reason: 'inactive_or_missing_user',
      });
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (isCredentialLocked(user.credential)) {
      // Locked credentials are denied until lockedUntil has passed.
      await this.writeAuditEvent(user.id, 'AUTH_LOGIN_LOCKED', context);
      throw new UnauthorizedException('Account is temporarily locked.');
    }

    const isPasswordValid = await compare(
      rawPassword,
      user.credential.passwordHash,
    );

    if (!isPasswordValid) {
      // Bad passwords increment the failed counter and may temporarily lock the account.
      await this.recordFailedLogin(user.credential, context);
      throw new UnauthorizedException('Invalid credentials.');
    }

    const authenticatedUser = buildAuthenticatedUser(user);

    if (
      authenticatedUser.roles.length === 0 ||
      authenticatedUser.permissions.length === 0
    ) {
      // A real user still cannot login unless at least one active role grants permissions.
      await this.writeAuditEvent(user.id, 'AUTH_LOGIN_FAILED', context, {
        reason: 'missing_active_rbac_assignment',
      });
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Successful login clears previous failed-attempt state.
    await this.prisma.userCredential.update({
      where: { userId: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        updatedBy: user.id,
      },
    });

    // Create a database session so JWTs can be revoked before their natural expiry.
    const expiresAt = new Date(
      Date.now() +
        parseExpiresIn(
          this.configService.get(JWT_EXPIRES_IN_CONFIG_KEY) ?? undefined,
        ),
    );
    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        status: PHASE1_STATUS.ACTIVE,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        lastSeenAt: new Date(),
        expiresAt,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });
    // Sign only the minimal data needed to re-check the user and session later.
    const token = this.jwtService.sign({
      sub: authenticatedUser.id,
      backendUserId: authenticatedUser.backendUserId,
      sid: session.id,
      email: authenticatedUser.email,
    });

    await this.writeAuditEvent(user.id, 'AUTH_LOGIN_SUCCEEDED', context, {
      sessionId: session.id,
    });

    return { user: authenticatedUser, token };
  }

  async logout(actor: AuthenticatedRequestUser | undefined): Promise<{
    ok: true;
  }> {
    if (!actor) {
      throw new UnauthorizedException('No authenticated session provided.');
    }

    // Logout revokes the current database session so the same token stops working.
    await this.prisma.userSession.update({
      where: { id: actor.sessionId },
      data: {
        status: PHASE1_STATUS.REVOKED,
        revokedAt: new Date(),
        updatedBy: actor.backendUserId,
      },
    });
    await this.prisma.auditEvent.create({
      data: {
        actorUserId: actor.backendUserId,
        eventType: 'AUTH_LOGOUT',
        metadataJson: { sessionId: actor.sessionId },
      },
    });

    return { ok: true };
  }

  private async recordFailedLogin(
    credential: CredentialRecord,
    context: LoginRequestContext,
  ): Promise<void> {
    // Start a fresh failure window after a previous temporary lock has expired.
    const previousLockExpired = Boolean(
      credential.lockedUntil && credential.lockedUntil <= new Date(),
    );
    const failedLoginCount = previousLockExpired
      ? 1
      : credential.failedLoginCount + 1;
    const lockedUntil =
      failedLoginCount >= LOGIN_LOCK_THRESHOLD
        ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000)
        : null;

    await this.prisma.userCredential.update({
      where: { id: credential.id },
      data: {
        failedLoginCount,
        lockedUntil,
      },
    });
    await this.writeAuditEvent(
      null,
      lockedUntil ? 'AUTH_LOGIN_LOCKED' : 'AUTH_LOGIN_FAILED',
      context,
      {
        credentialId: credential.id,
      },
    );
  }

  private async writeAuditEvent(
    actorUserId: number | null,
    eventType: string,
    context: LoginRequestContext,
    metadataJson?: Prisma.InputJsonObject,
  ): Promise<void> {
    // Writes security-relevant auth events for later investigation.
    await this.prisma.auditEvent.create({
      data: {
        actorUserId,
        eventType,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadataJson,
      },
    });
  }
}
