import { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request, { type Response } from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.bootstrap';
import { API_PREFIX } from '../src/common/constants/app.constants';
import { PrismaService } from '../src/core/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import {
  PHASE1_DEMO_ACCOUNT_MAP,
  PHASE1_DEMO_PASSWORD,
} from '../prisma/phase1-demo-accounts';

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

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;
  const prismaMock = {
    $queryRaw: jest.fn().mockResolvedValue([{ healthy: 1 }]),
    employee: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId,
          displayName: PHASE1_DEMO_ACCOUNT_MAP.employee.displayName,
        },
      ]),
      count: jest.fn().mockResolvedValue(1),
    },
    approvalRequest: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 1001,
          employeeId: PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId,
          status: 'PENDING',
          referenceType: 'PAF',
        },
      ]),
      count: jest.fn().mockResolvedValue(1),
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

  it('blocks generic CRUD writes for non-Superadmin users', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.employee.email,
        password: PHASE1_DEMO_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .post(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ firstName: 'Blocked' })
      .expect(403);
  });

  it('blocks generic CRUD writes even for Superadmin unless a resource opts in', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.superadmin.email,
        password: PHASE1_DEMO_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .post(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ firstName: 'Blocked' })
      .expect(405);
  });

  it('scopes Employee reads to their own employee record', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.employee.email,
        password: PHASE1_DEMO_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    const response = await request(httpServer)
      .get(`/${API_PREFIX}/personnel/employees`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      data: [
        {
          id: PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId,
          displayName: PHASE1_DEMO_ACCOUNT_MAP.employee.displayName,
        },
      ],
      total: 1,
    });
    expect(prismaMock.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId },
      }),
    );
  });

  it('keeps allow-listed filters in generated read queries', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.superadmin.email,
        password: PHASE1_DEMO_PASSWORD,
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

  it('scopes Employee approval request reads to their own employee record', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.employee.email,
        password: PHASE1_DEMO_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/approvals/approval-requests`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200);

    expect(prismaMock.approvalRequest.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { employeeId: PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId },
      }),
    );
  });

  it('blocks Employee reads from unscoped generated resources', async () => {
    const httpServer = app.getHttpServer() as App;
    const loginResponse = await request(httpServer)
      .post(`/${API_PREFIX}/auth/login`)
      .send({
        email: PHASE1_DEMO_ACCOUNT_MAP.employee.email,
        password: PHASE1_DEMO_PASSWORD,
      })
      .expect(201);
    const body = loginResponse.body as { token: string };

    await request(httpServer)
      .get(`/${API_PREFIX}/rbac/users`)
      .set('Authorization', `Bearer ${body.token}`)
      .expect(403);
  });
});
