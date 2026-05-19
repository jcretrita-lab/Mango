import { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import request, { type Response } from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.bootstrap';
import { API_PREFIX } from '../src/common/constants/app.constants';
import { PHASE1_STATUS } from '../src/common/constants/domain-status.constants';
import { PERMISSION_CODES } from '../src/common/constants/permissions.constants';
import { PrismaService } from '../src/core/prisma/prisma.service';
import {
  BOOTSTRAP_ACCOUNT_MAP,
  BOOTSTRAP_PASSWORD,
} from '../prisma/bootstrap-accounts';

interface EmployeeFindManyArgs {
  skip?: number;
  take?: number;
  where?: {
    AND?: [
      {
        OR?: Array<Record<string, unknown>>;
      },
      Record<string, unknown>,
    ];
  };
}

type RoleName = 'Superadmin' | 'Approver' | 'Employee';

interface TestCredential {
  id: number;
  passwordHash: string;
  failedLoginCount: number;
  lockedUntil?: Date | null;
}

interface TestUser {
  id: number;
  email: string;
  displayName: string;
  employeeId?: number | null;
  status: string;
  isActive: boolean;
  credential?: TestCredential | null;
  roleAssignments: Array<{
    isPrimary: boolean;
    role: {
      code: string;
      name: RoleName;
      status: string;
      rolePermissionAssignments: Array<{
        permission: {
          code: string;
          status: string;
        };
      }>;
    };
  }>;
}

const passwordHash = hashSync(BOOTSTRAP_PASSWORD, 10);

const rolePermissions: Record<RoleName, readonly string[]> = {
  Superadmin: Object.values(PERMISSION_CODES),
  Approver: [
    PERMISSION_CODES.ORG_READ,
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PAY_STRUCTURE_READ,
    PERMISSION_CODES.APPROVALS_READ,
    PERMISSION_CODES.APPROVALS_APPROVE,
  ],
  Employee: [
    PERMISSION_CODES.PERSONNEL_SELF_READ,
    PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
    PERMISSION_CODES.APPROVALS_SELF_READ,
  ],
};

const roleCodes: Record<RoleName, string> = {
  Superadmin: 'SUPERADMIN',
  Approver: 'APPROVER',
  Employee: 'EMPLOYEE',
};

function buildTestUser(options: {
  id: number;
  email: string;
  displayName: string;
  role: RoleName;
  employeeId?: number | null;
  status?: string;
  isActive?: boolean;
  lockedUntil?: Date | null;
}): TestUser {
  return {
    id: options.id,
    email: options.email.toLowerCase(),
    displayName: options.displayName,
    employeeId: options.employeeId ?? null,
    status: options.status ?? PHASE1_STATUS.ACTIVE,
    isActive: options.isActive ?? true,
    credential: {
      id: options.id,
      passwordHash,
      failedLoginCount: 0,
      lockedUntil: options.lockedUntil ?? null,
    },
    roleAssignments: [
      {
        isPrimary: true,
        role: {
          code: roleCodes[options.role],
          name: options.role,
          status: PHASE1_STATUS.ACTIVE,
          rolePermissionAssignments: rolePermissions[options.role].map(
            (code) => ({
              permission: { code, status: PHASE1_STATUS.ACTIVE },
            }),
          ),
        },
      },
    ],
  };
}

describe('Phase 1 backend hardening (e2e)', () => {
  let app: INestApplication;
  let usersByEmail: Map<string, TestUser>;
  let usersById: Map<number, TestUser>;
  let activeSessions: Map<
    number,
    { id: number; userId: number; status: string; revokedAt?: Date | null }
  >;
  let nextSessionId: number;

  const prismaMock = {
    $transaction: jest.fn(),
    $queryRaw: jest.fn().mockResolvedValue([{ healthy: 1 }]),
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    userCredential: {
      update: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    auditEvent: {
      create: jest.fn(),
    },
    role: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    employeeProfile: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    approvalRequest: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    nextSessionId = 7000;
    activeSessions = new Map();

    const superadmin = buildTestUser({
      id: BOOTSTRAP_ACCOUNT_MAP.superadmin.userId,
      email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
      displayName: BOOTSTRAP_ACCOUNT_MAP.superadmin.displayName,
      role: 'Superadmin',
    });
    const approver = buildTestUser({
      id: BOOTSTRAP_ACCOUNT_MAP.approver.userId,
      email: BOOTSTRAP_ACCOUNT_MAP.approver.email,
      displayName: BOOTSTRAP_ACCOUNT_MAP.approver.displayName,
      role: 'Approver',
      employeeId: BOOTSTRAP_ACCOUNT_MAP.approver.employeeId,
    });
    const employee = buildTestUser({
      id: BOOTSTRAP_ACCOUNT_MAP.employee.userId,
      email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
      displayName: BOOTSTRAP_ACCOUNT_MAP.employee.displayName,
      role: 'Employee',
      employeeId: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
    });
    const inactive = buildTestUser({
      id: 90,
      email: 'inactive.user@diwalearning.local',
      displayName: 'Inactive User',
      role: 'Employee',
      employeeId: 90,
      status: PHASE1_STATUS.INACTIVE,
      isActive: false,
    });
    const locked = buildTestUser({
      id: 91,
      email: 'locked.user@diwalearning.local',
      displayName: 'Locked User',
      role: 'Employee',
      employeeId: 91,
      lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
    });

    usersByEmail = new Map(
      [superadmin, approver, employee, inactive, locked].map((user) => [
        user.email,
        user,
      ]),
    );
    usersById = new Map(
      [superadmin, approver, employee, inactive, locked].map((user) => [
        user.id,
        user,
      ]),
    );

    prismaMock.user.findUnique.mockImplementation(
      ({ where }: { where: { email: string } }) =>
        usersByEmail.get(where.email.toLowerCase()) ?? null,
    );
    prismaMock.user.findFirst.mockImplementation(
      ({
        where,
      }: {
        where: {
          id?: number;
          email?: string;
          status?: string;
          isActive?: boolean;
        };
      }) => {
        const user = where.id ? usersById.get(where.id) : undefined;

        if (
          !user ||
          (where.email && user.email !== where.email.toLowerCase()) ||
          (where.status && user.status !== where.status) ||
          (where.isActive !== undefined && user.isActive !== where.isActive)
        ) {
          return null;
        }

        return user;
      },
    );
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: superadmin.id,
        email: superadmin.email,
        displayName: superadmin.displayName,
      },
      {
        id: approver.id,
        email: approver.email,
        displayName: approver.displayName,
      },
      {
        id: employee.id,
        email: employee.email,
        displayName: employee.displayName,
      },
    ]);
    prismaMock.user.count.mockResolvedValue(3);
    prismaMock.user.update.mockImplementation(
      ({ where, data }: { where: { id: number }; data: Partial<TestUser> }) => {
        const user = usersById.get(where.id);

        if (user) {
          Object.assign(user, data);
        }

        return user ?? null;
      },
    );
    prismaMock.userCredential.update.mockImplementation(
      ({
        where,
        data,
      }: {
        where: { id?: number; userId?: number };
        data: Partial<TestCredential>;
      }) => {
        const user = [...usersById.values()].find(
          (candidate) =>
            candidate.credential &&
            (candidate.credential.id === where.id ||
              candidate.id === where.userId),
        );

        if (!user?.credential) {
          return null;
        }

        Object.assign(user.credential, data);
        return user.credential;
      },
    );
    prismaMock.userSession.create.mockImplementation(
      ({ data }: { data: { userId: number; status: string } }) => {
        const session = {
          id: nextSessionId++,
          userId: data.userId,
          status: data.status,
          revokedAt: null,
        };
        activeSessions.set(session.id, session);
        return session;
      },
    );
    prismaMock.userSession.findFirst.mockImplementation(
      ({
        where,
      }: {
        where: { id: number; userId: number; status: string; revokedAt: null };
      }) => {
        const session = activeSessions.get(where.id);

        if (
          !session ||
          session.userId !== where.userId ||
          session.status !== where.status ||
          session.revokedAt !== null
        ) {
          return null;
        }

        return session;
      },
    );
    prismaMock.userSession.update.mockImplementation(
      ({
        where,
        data,
      }: {
        where: { id: number };
        data: { status: string; revokedAt?: Date };
      }) => {
        const session = activeSessions.get(where.id);

        if (session) {
          session.status = data.status;
          session.revokedAt = data.revokedAt ?? null;
        }

        return session ?? null;
      },
    );
    prismaMock.auditEvent.create.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) => ({
        id: 1,
        ...data,
      }),
    );
    prismaMock.$transaction.mockImplementation(
      (callback: (tx: typeof prismaMock) => unknown) => callback(prismaMock),
    );
    prismaMock.role.create.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) => ({
        id: 301,
        ...data,
      }),
    );
    prismaMock.role.findUnique.mockResolvedValue({
      id: 301,
      code: 'HR_MANAGER',
      name: 'HR Manager',
    });
    prismaMock.role.update.mockImplementation(
      ({
        where,
        data,
      }: {
        where: { id: number };
        data: Record<string, unknown>;
      }) => ({
        id: where.id,
        ...data,
      }),
    );
    prismaMock.role.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.employee.findMany.mockResolvedValue([
      {
        id: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
        displayName: BOOTSTRAP_ACCOUNT_MAP.employee.displayName,
      },
    ]);
    prismaMock.employee.findFirst.mockResolvedValue(null);
    prismaMock.employee.count.mockResolvedValue(1);
    prismaMock.employeeProfile.findMany.mockResolvedValue([
      {
        id: 2001,
        employeeId: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
        birthDate: '1990-01-01T00:00:00.000Z',
        civilStatus: 'Single',
        residentialAddress: '123 Test Street',
        sssNo: '33-1234567-8',
        tinNo: '123-456-789-000',
        philhealthNo: '12-123456789-1',
        pagibigNo: '8100-12345678',
        bankName: 'BPI',
        bankAccountNo: '011123456789',
      },
    ]);
    prismaMock.employeeProfile.findFirst.mockResolvedValue({
      id: 2001,
      employeeId: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
      birthDate: '1990-01-01T00:00:00.000Z',
      civilStatus: 'Single',
      residentialAddress: '123 Test Street',
      sssNo: '33-1234567-8',
      tinNo: '123-456-789-000',
      philhealthNo: '12-123456789-1',
      pagibigNo: '8100-12345678',
      bankName: 'BPI',
      bankAccountNo: '011123456789',
    });
    prismaMock.employeeProfile.count.mockResolvedValue(1);
    prismaMock.approvalRequest.findMany.mockResolvedValue([
      {
        id: 1001,
        employeeId: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
        status: 'PENDING',
        referenceType: 'PAF',
      },
    ]);
    prismaMock.approvalRequest.count.mockResolvedValue(1);
  });

  afterAll(async () => {
    await app.close();
  });

  it(`GET /${API_PREFIX}/health`, async () => {
    const httpServer = app.getHttpServer() as App;

    await request(httpServer)
      .get(`/${API_PREFIX}/health`)
      .expect(200)
      .expect((response: Response) => {
        const body = response.body as {
          status: string;
          info: {
            database?: {
              status: string;
            };
          };
        };

        expect(body).toMatchObject({
          status: 'ok',
          info: {
            database: {
              status: 'up',
            },
          },
        });
      });
  });

  it('logs in with a DB credential hash and returns DB-derived permissions', async () => {
    const httpServer = app.getHttpServer() as App;

    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);

    expect(loginResponse.body).toMatchObject({
      user: {
        role: 'Employee',
        roles: ['Employee'],
        permissions: [
          PERMISSION_CODES.APPROVALS_SELF_READ,
          PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
          PERMISSION_CODES.PERSONNEL_SELF_READ,
        ],
      },
    });
    const loginBody = loginResponse.body as { token: string };
    expect(loginBody.token).toEqual(expect.any(String));
    expect(prismaMock.userCredential.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: BOOTSTRAP_ACCOUNT_MAP.employee.userId },
      }),
    );
  });

  it('rejects bad passwords, inactive users, and locked credentials', async () => {
    const httpServer = app.getHttpServer() as App;

    await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: 'WrongPhase1!',
      })
      .expect(401);
    await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: 'inactive.user@diwalearning.local',
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(401);
    await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: 'locked.user@diwalearning.local',
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(401);
  });

  it('invalidates the active DB session on logout', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .post(`/${API_PREFIX}/auth/logout`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(201);
    await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(401);
  });

  it('blocks generic CRUD writes when a user lacks the required write permission', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .post(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ firstName: 'Blocked' })
      .expect(403);
  });

  it('keeps generic CRUD writes disabled even when the write permission exists', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .post(`/${API_PREFIX}/personnel/pis-tabs`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ code: 'blocked', name: 'Blocked' })
      .expect(405);
  });

  it('scopes Employee collection reads to their own employee record', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    const response = await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    const createdRole = response.body as Record<string, unknown>;

    expect(createdRole).toMatchObject({
      data: [
        {
          id: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId,
          displayName: BOOTSTRAP_ACCOUNT_MAP.employee.displayName,
        },
      ],
      total: 1,
    });
    expect(prismaMock.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId },
      }),
    );
  });

  it('does not let Employee self-service read another employee by id', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees/1`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(404);

    expect(prismaMock.employee.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ id: 1 }, { id: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId }],
        },
      }),
    );
  });

  it('keeps allow-listed filters in generated read queries for global readers', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees`)
      .query({
        page: '2',
        limit: '25',
        search: 'demo',
        status: 'ACTIVE',
        jobType: 'REGULAR',
        unsupportedField: 'ignored',
      })
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    const [findManyArgs] = prismaMock.employee.findMany.mock.lastCall as [
      EmployeeFindManyArgs,
    ];

    expect(findManyArgs.skip).toBe(25);
    expect(findManyArgs.take).toBe(25);
    expect(findManyArgs.where?.AND?.[0].OR).toContainEqual({
      firstName: { contains: 'demo', mode: 'insensitive' },
    });
    expect(findManyArgs.where?.AND?.[1]).toEqual({
      status: 'ACTIVE',
      jobType: 'REGULAR',
    });
  });

  it('applies a default pagination cap even without a page query param', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    expect(prismaMock.employee.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 200,
      }),
    );
  });

  it('masks sensitive personnel fields unless the actor has sensitive personnel permission', async () => {
    const httpServer = app.getHttpServer() as App;
    const approverLogin = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.approver.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const approverBody = approverLogin.body as { token: string };

    const approverResponse = await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employee-profiles`)
      .set('Authorization', `Bearer ${approverBody.token}`)
      .expect(200);
    const approverProfileBody = approverResponse.body as {
      data: Array<Record<string, unknown>>;
    };

    expect(approverProfileBody.data[0]).toMatchObject({
      birthDate: null,
      residentialAddress: null,
      sssNo: null,
      tinNo: null,
      philhealthNo: null,
      pagibigNo: null,
      bankAccountNo: null,
    });

    const superadminLogin = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const superadminBody = superadminLogin.body as { token: string };

    const superadminResponse = await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employee-profiles`)
      .set('Authorization', `Bearer ${superadminBody.token}`)
      .expect(200);
    const superadminProfileBody = superadminResponse.body as {
      data: Array<Record<string, unknown>>;
    };

    expect(superadminProfileBody.data[0]).toMatchObject({
      birthDate: '1990-01-01T00:00:00.000Z',
      residentialAddress: '123 Test Street',
      sssNo: '33-1234567-8',
      tinNo: '123-456-789-000',
      philhealthNo: '12-123456789-1',
      pagibigNo: '8100-12345678',
      bankAccountNo: '011123456789',
    });
  });

  it('lets global permission holders read unscoped RBAC collections', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/rbac/users`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);
  });

  it('creates RBAC roles through an explicit domain endpoint with actor stamping', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.superadmin.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    const response = await request(httpServer)
      .post(`/${API_PREFIX}/rbac/roles`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        code: 'HR_MANAGER',
        name: 'HR Manager',
        description: 'Can manage personnel records',
      })
      .expect(201);

    const createdRole = response.body as Record<string, unknown>;

    expect(createdRole).toMatchObject({
      id: 301,
      code: 'HR_MANAGER',
      name: 'HR Manager',
      createdBy: BOOTSTRAP_ACCOUNT_MAP.superadmin.userId,
      updatedBy: BOOTSTRAP_ACCOUNT_MAP.superadmin.userId,
    });
    const expectedRoleData = expect.objectContaining({
      code: 'HR_MANAGER',
      name: 'HR Manager',
      createdBy: BOOTSTRAP_ACCOUNT_MAP.superadmin.userId,
      updatedBy: BOOTSTRAP_ACCOUNT_MAP.superadmin.userId,
    }) as unknown;

    expect(prismaMock.role.create).toHaveBeenCalledWith({
      data: expectedRoleData,
    });
  });

  it('scopes Employee approval request reads to their own employee record', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/approvals/approval-requests`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    expect(prismaMock.approvalRequest.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { employeeId: BOOTSTRAP_ACCOUNT_MAP.employee.employeeId },
      }),
    );
  });

  it('blocks Employee reads from unscoped generated resources', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: BOOTSTRAP_ACCOUNT_MAP.employee.email,
        password: BOOTSTRAP_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/rbac/users`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(403);
    const auditCalls = prismaMock.auditEvent.create.mock.calls as Array<
      [{ data: { eventType?: string } }]
    >;
    expect(
      auditCalls.some(
        ([call]) => call.data.eventType === 'AUTH_PERMISSION_DENIED',
      ),
    ).toBe(true);
  });
});
