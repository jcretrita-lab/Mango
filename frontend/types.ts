export type UserRole = "Superadmin" | "Approver" | "Employee";

export interface User {
  id: string;
  backendUserId?: number;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  employeeId?: string;
  permissions: string[];
  encryptedSignature?: string;
}

