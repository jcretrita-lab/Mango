export const PHASE1_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  REVOKED: 'REVOKED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT',
} as const;

export const PHASE1_HR_STATUS_VALUES = {
  employee: ['Active', 'Inactive', 'Suspended'],
  employment: ['Active', 'Probationary', 'Suspended', 'Separated'],
  approval: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'DRAFT'],
  session: ['ACTIVE', 'REVOKED', 'EXPIRED'],
} as const;
