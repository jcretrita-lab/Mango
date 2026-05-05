export type UserRole = 'Superadmin' | 'Approver' | 'Employee';

export interface User {
  id: string;
  backendUserId?: number;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  permissions: string[];
  encryptedSignature?: string;
}

export interface DemoAccount {
  role: UserRole;
  displayName: string;
  email: string;
  description: string;
}
