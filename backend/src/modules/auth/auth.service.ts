import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PHASE1_DEMO_ACCOUNTS,
  PHASE1_DEMO_PASSWORD,
  type PhaseOneDemoAccount,
} from '../../../prisma/phase1-demo-accounts';
import type { UserRole } from '../../common/constants/app.constants';

export interface AuthenticatedUser {
  id: string;
  backendUserId: number;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Superadmin: ['all_access'],
  Approver: ['approval_queue', 'employee_directory', 'pay_structure_review'],
  Employee: ['my_profile', 'my_pay_profile', 'my_paf'],
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getDemoAccounts() {
    return PHASE1_DEMO_ACCOUNTS.map((account) => ({
      role: account.role,
      displayName: account.displayName,
      email: account.email,
      description: account.description,
    }));
  }

  login(
    email: string | undefined,
    password: string | undefined,
  ): { user: AuthenticatedUser; token: string } {
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    const normalizedPassword = password?.trim() ?? '';

    const matchedAccount = PHASE1_DEMO_ACCOUNTS.find(
      (account) => account.email.toLowerCase() === normalizedEmail,
    );

    if (!matchedAccount || normalizedPassword !== PHASE1_DEMO_PASSWORD) {
      throw new UnauthorizedException('Invalid demo credentials.');
    }

    const user = this.toAuthenticatedUser(matchedAccount);

    const token = this.jwtService.sign({
      sub: user.id,
      backendUserId: user.backendUserId,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      permissions: user.permissions,
    });

    return { user, token };
  }

  private toAuthenticatedUser(account: PhaseOneDemoAccount): AuthenticatedUser {
    return {
      id: `seed-user-${account.userId}`,
      backendUserId: account.userId,
      name: account.displayName,
      email: account.email,
      role: account.role,
      employeeId:
        account.employeeId !== undefined
          ? String(account.employeeId)
          : undefined,
      permissions: ROLE_PERMISSIONS[account.role],
    };
  }
}
