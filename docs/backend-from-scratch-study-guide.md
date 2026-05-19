# Diwa HRIS Phase 1 Backend From Scratch

This guide teaches you how to build the Phase 1 backend yourself from a blank folder.

You do not need to already know backend development. We will build one idea at a time, explain why each part exists, then add code. By the end, you should understand how the NestJS application, Prisma database layer, authentication, RBAC, personnel data protection, pay structure, org structure, and approval workflows fit together.

Phase 1 covers:

- Organizational structure management
- Personnel information system
- Pay structure
- Role-based access control (RBAC)
- Approval workflows

Phase 2 attendance and payroll are intentionally out of scope.

---

## 0. The Big Picture

**Story Analogy:** Imagine you are building the main office of a school. Parents, teachers, and staff walk up to different counters, guards check whether they are allowed in, clerks process their paperwork, and a records room stores the official files. Your backend works the same way: requests enter through controllers, guards check access, services do the work, and Prisma files everything in PostgreSQL.

Before writing code, let us build a mental model.

Think of the backend as a school or company office:

- **NestJS** is the building layout. It decides which room handles which request.
- **Controllers** are reception desks. They receive HTTP requests.
- **Services** are the staff who do the real work.
- **Prisma** is the librarian who talks to the database safely.
- **PostgreSQL** is the filing cabinet where records live.
- **Guards** are security staff. They check whether a user is logged in and allowed to enter.
- **Decorators** are labels on doors. They tell guards what permissions are required.
- **Migrations** are construction blueprints for the database.
- **Seeds** are starter data for testing.

The request flow looks like this:

```mermaid
flowchart LR
  Browser["Frontend or API Client"] --> Controller["NestJS Controller"]
  Controller --> Guard["JWT Guard + Permissions Guard"]
  Guard --> Service["Domain Service"]
  Service --> Prisma["Prisma Client"]
  Prisma --> Database["PostgreSQL"]
  Database --> Prisma
  Prisma --> Service
  Service --> Controller
  Controller --> Browser
```

Recap:

- The frontend sends a request.
- NestJS routes it to a controller.
- Guards check identity and permissions.
- Services run business logic.
- Prisma reads/writes PostgreSQL.

---

## 1. Create The Project

**Story Analogy:** Before the school can serve anyone, you need a building. Creating the NestJS project is like laying down the foundation, walls, rooms, and hallways where all future departments will operate.

### What Is This?

We are creating a NestJS project. NestJS is a backend framework for Node.js. It gives us structure: modules, controllers, services, guards, and dependency injection.

### Why Do I Need It?

Without a framework, you would have to manually wire every route, database connection, validation rule, and error handler. NestJS gives us a clean structure for a real product.

### How Does It Connect?

Everything else in this guide will live inside this NestJS backend folder.

### Code

Run these commands from your project root:

```powershell
# Install the NestJS command-line tool globally.
# This gives you the `nest` command.
npm install -g @nestjs/cli

# Create a new backend project.
# Choose npm when the CLI asks for a package manager.
nest new backend

# Move into the backend folder.
cd backend
```

Install the dependencies we need:

```powershell
# Runtime dependencies used by the running backend.
npm install `
  @nestjs/common `
  @nestjs/core `
  @nestjs/platform-express `
  @nestjs/config `
  @nestjs/jwt `
  @nestjs/passport `
  @nestjs/swagger `
  @nestjs/terminus `
  @prisma/client `
  bcryptjs `
  class-transformer `
  class-validator `
  passport `
  passport-jwt `
  reflect-metadata `
  rxjs

# Development dependencies used for building, testing, linting, and Prisma CLI.
npm install --save-dev `
  @nestjs/cli `
  @nestjs/testing `
  @types/bcryptjs `
  @types/express `
  @types/jest `
  @types/node `
  @types/passport-jwt `
  @types/supertest `
  eslint `
  jest `
  prettier `
  prisma `
  supertest `
  ts-jest `
  ts-loader `
  ts-node `
  tsconfig-paths `
  typescript
```

Update `backend/package.json` scripts:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\"",
    "test": "jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json --runInBand",
    "test:integration": "jest --config ./test/jest-e2e.json --runInBand",
    "prisma:generate": "prisma generate",
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "migrate:status": "prisma migrate status",
    "schema:check": "prisma validate && prisma format --check",
    "prisma:studio": "prisma studio",
    "db:seed": "npm run db:seed:dummy",
    "db:seed:dummy": "ts-node --project tsconfig.json prisma/seed.ts",
    "db:seed:fixtures": "ts-node --project tsconfig.json prisma/seed-fixtures.ts"
  }
}
```

Recap:

- You created a NestJS backend.
- You installed the libraries for API routing, validation, JWT auth, Prisma, Swagger, health checks, and testing.
- You standardized the backend on npm.

---

## 2. Add Environment Configuration

**Story Analogy:** A school has private instruction sheets: where the records room is, who has the master key, which entrances are open, and whether visitors can see the directory. Environment configuration is that private instruction sheet for your backend.

### What Is This?

Environment configuration is how the backend reads values like database URL, server port, JWT secret, and allowed frontend URLs.

These values change between local development and production, so they should not be hardcoded.

### Why Do I Need It?

Your local database password is different from production. Your production JWT secret must be strong. Your frontend URL might be different in staging. Configuration keeps those differences outside the code.

### How Does It Connect?

NestJS loads configuration once, then modules like AuthModule and app bootstrap read those values.

### Code

Create `.env.example`:

```env
# The port where NestJS will listen locally.
PORT=3000

# PostgreSQL connection string.
DATABASE_URL="postgresql://postgres:password@localhost:5432/diwa_hris?schema=public"

# Local-only fallback is allowed in development, but production must set this.
JWT_SECRET="replace-this-with-a-long-random-secret"

# Comma-separated frontend origins allowed to call the API.
CORS_ORIGINS="http://localhost:5173"
```

Create `src/config/configuration.ts`:

```ts
export interface EnvironmentConfiguration {
  readonly nodeEnv: string;
  readonly port: number;
  readonly corsOrigins: readonly string[];
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly swaggerEnabled: boolean;
}

export const DEFAULT_PORT = 3000;
export const RUNTIME_ENV_CONFIG_KEY = 'nodeEnv' as const;
export const PORT_CONFIG_KEY = 'port' as const;
export const CORS_ORIGINS_CONFIG_KEY = 'corsOrigins' as const;
export const JWT_SECRET_CONFIG_KEY = 'jwtSecret' as const;
export const JWT_EXPIRES_IN_CONFIG_KEY = 'jwtExpiresIn' as const;
export const SWAGGER_ENABLED_CONFIG_KEY = 'swaggerEnabled' as const;

function resolveNodeEnv(): string {
  // NODE_ENV is usually development, test, or production.
  return process.env.NODE_ENV?.trim() || 'development';
}

function resolvePort(): number {
  // Environment variables are strings, so we convert PORT to a number.
  const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);

  // If PORT is missing or invalid, use 3000.
  return Number.isNaN(parsedPort) || parsedPort <= 0
    ? DEFAULT_PORT
    : parsedPort;
}

function resolveCorsOrigins(): readonly string[] {
  // CORS_ORIGINS controls which browser apps may call this API.
  const value = process.env.CORS_ORIGINS;

  if (!value?.trim()) {
    return ['http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function assertDatabaseUrl(nodeEnv: string): void {
  // Tests can mock Prisma, but real environments need a database.
  if (nodeEnv === 'test') {
    return;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL must be set.');
  }
}

function resolveJwtSecret(nodeEnv: string): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (secret) {
    // Production secrets should be long enough to resist guessing.
    if (nodeEnv === 'production' && secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production.');
    }

    return secret;
  }

  // A fallback is acceptable only for local development and tests.
  if (nodeEnv !== 'development' && nodeEnv !== 'test') {
    throw new Error('JWT_SECRET must be set in production.');
  }

  return 'diwa-hris-phase1-dev-secret-change-before-prod';
}

function resolveSwaggerEnabled(nodeEnv: string): boolean {
  // Swagger is useful locally but should be disabled or protected in production.
  const explicit = process.env.SWAGGER_ENABLED?.trim();

  if (explicit) {
    return explicit.toLowerCase() === 'true';
  }

  return nodeEnv === 'development' || nodeEnv === 'test';
}

const configuration = (): EnvironmentConfiguration => {
  const nodeEnv = resolveNodeEnv();
  assertDatabaseUrl(nodeEnv);

  return {
    nodeEnv,
    port: resolvePort(),
    corsOrigins: resolveCorsOrigins(),
    jwtSecret: resolveJwtSecret(nodeEnv),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '8h',
    swaggerEnabled: resolveSwaggerEnabled(nodeEnv),
  };
};

export default configuration;
```

Recap:

- Configuration reads environment variables.
- It gives the app safe defaults for local development.
- It refuses unsafe production settings.

---

## 3. Initialize Prisma

**Story Analogy:** Prisma is the school records clerk. Instead of letting every employee dig through filing cabinets directly, everyone asks the clerk to read or update official records safely.

### What Is This?

Prisma is an ORM. ORM means "Object Relational Mapper." In simple terms, Prisma lets TypeScript code talk to database tables using objects and methods.

Instead of writing raw SQL everywhere, you write:

```ts
await prisma.employee.findMany();
```

### Why Do I Need It?

This backend has many related tables: users, employees, roles, permissions, org units, pay profiles, approval requests, and more. Prisma helps define and query those relations safely.

### How Does It Connect?

NestJS services will use `PrismaService`, which wraps Prisma Client.

### Code

Initialize Prisma:

```powershell
npx prisma init
```

Update `prisma.config.ts`:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // This tells Prisma where the schema lives.
  schema: './prisma/schema.prisma',

  migrations: {
    // Prisma can run this command after migrations if you ask it to seed.
    seed: 'npm run db:seed:dummy',
  },
});
```

Recap:

- Prisma is now part of the project.
- The schema will define the database.
- Migrations will turn that schema into real PostgreSQL tables.

---

## 4. Design The Database In Domains

**Story Analogy:** Now you design the filing cabinets. One cabinet holds employees, one holds departments, one holds roles and permissions, one holds pay structures, and one holds approval paperwork. Good cabinet design makes the office easy to run later.

### What Is This?

Database schema design is the act of deciding:

- What tables exist
- What columns each table has
- How tables relate to each other
- What must be unique
- What should be indexed for fast lookup

### Why Do I Need It?

Phase 1 is not a single feature. It is a connected HR system. If we design the database poorly, every API becomes harder later.

### How Does It Connect?

Every NestJS service will query these Prisma models.

### Code: Prisma Header

Start `prisma/schema.prisma` like this:

```prisma
generator client {
  // Generates the TypeScript Prisma Client.
  provider = "prisma-client-js"
}

datasource db {
  // We use PostgreSQL because it is reliable for relational business data.
  provider = "postgresql"

  // DATABASE_URL comes from .env.
  url = env("DATABASE_URL")
}
```

### Code: Auth And RBAC Models

These models answer: "Who are you?" and "What are you allowed to do?"

```prisma
model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  firstName       String
  lastName        String
  displayName     String
  employeeId      Int?      @unique
  employee        Employee? @relation(fields: [employeeId], references: [id], onDelete: SetNull)
  status          String    @default("ACTIVE")
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  createdBy       Int       @default(1)
  updatedAt       DateTime  @updatedAt
  updatedBy       Int       @default(1)

  credential      UserCredential?
  sessions        UserSession[]
  roleAssignments UserRoleAssignment[]
  auditEvents     AuditEvent[] @relation("AuditActor")

  @@index([status, isActive])
  @@index([employeeId])
}

model UserCredential {
  id                 Int       @id @default(autoincrement())
  userId             Int       @unique
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  passwordHash       String
  passwordUpdatedAt  DateTime  @default(now())
  mustChangePassword Boolean   @default(false)
  failedLoginCount   Int       @default(0)
  lockedUntil        DateTime?
  createdAt          DateTime  @default(now())
  createdBy          Int       @default(1)
  updatedAt          DateTime  @updatedAt
  updatedBy          Int       @default(1)

  @@index([lockedUntil])
}

model Role {
  id                        Int                        @id @default(autoincrement())
  code                      String                     @unique
  name                      String
  description               String?
  status                    String                     @default("ACTIVE")
  userRoleAssignments       UserRoleAssignment[]
  rolePermissionAssignments RolePermissionAssignment[]
}

model Permission {
  id                        Int                        @id @default(autoincrement())
  code                      String                     @unique
  name                      String
  description               String?
  status                    String                     @default("ACTIVE")
  rolePermissionAssignments RolePermissionAssignment[]
}

model UserRoleAssignment {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId     Int
  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  isActive   Boolean  @default(true)
  isPrimary  Boolean  @default(false)
  assignedAt DateTime @default(now())
  createdAt  DateTime @default(now())
  createdBy  Int      @default(1)
  updatedAt  DateTime @updatedAt
  updatedBy  Int      @default(1)

  @@unique([userId, roleId])
  @@index([userId, isActive])
}

model RolePermissionAssignment {
  id           Int        @id @default(autoincrement())
  roleId       Int
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId Int
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  createdBy    Int        @default(1)
  updatedAt    DateTime   @updatedAt
  updatedBy    Int        @default(1)

  @@index([roleId, permissionId])
  @@index([roleId, isActive])
}
```

Important idea:

- A user can have many roles.
- A role can have many permissions.
- Guards will use permissions to allow or block routes.

### Code: Personnel Models

Personnel models store employee information.

```prisma
model Employee {
  id                          Int                @id @default(autoincrement())
  employeeNumber              String             @unique
  firstName                   String
  lastName                    String
  displayName                 String
  orgUnitJson                 Json?
  roleTitle                   String?
  email                       String             @unique
  phone                       String?
  status                      String
  jobType                     String
  avatarUrl                   String?
  primaryPositionAssignmentId Int?
  createdAt                   DateTime           @default(now())
  createdBy                   Int                @default(1)
  updatedAt                   DateTime           @updatedAt
  updatedBy                   Int                @default(1)

  user              User?
  profile           EmployeeProfile?
  employments       Employment[]
  educationRecords  EducationRecord[]
  familyMembers     FamilyMember[]
  emergencyContacts EmergencyContact[]
  fieldValues       EmployeeFieldValue[]

  @@index([status, jobType])
}

model EmployeeProfile {
  id                 Int      @id @default(autoincrement())
  employeeId         Int      @unique
  employee           Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  birthDate          DateTime?
  gender             String?
  civilStatus        String?
  residentialAddress String?
  sssNo              String?
  tinNo              String?
  philhealthNo       String?
  pagibigNo          String?
  bankName           String?
  bankAccountNo      String?
  createdAt          DateTime @default(now())
  createdBy          Int      @default(1)
  updatedAt          DateTime @updatedAt
  updatedBy          Int      @default(1)
}

model Employment {
  id         Int      @id @default(autoincrement())
  employeeId Int
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  status     String
  jobType    String
  startDate  DateTime
  endDate    DateTime?
  remarks    String?
  createdAt  DateTime @default(now())
  createdBy  Int      @default(1)
  updatedAt  DateTime @updatedAt
  updatedBy  Int      @default(1)

  @@index([employeeId, startDate, endDate])
}
```

Security note:

`EmployeeProfile` contains sensitive fields. Later, our API will mask fields like `sssNo`, `tinNo`, and `bankAccountNo` unless the user has sensitive-read permission.

### Code: Org Structure Models

Org structure answers: "Where does this position belong?"

```prisma
model HierarchyLevel {
  id        Int      @id @default(autoincrement())
  levelNo   Int
  label     String
  orgUnits  OrgUnit[]
}

model OrgUnit {
  id               Int             @id @default(autoincrement())
  parentOrgUnitId  Int?
  parentOrgUnit    OrgUnit?        @relation("OrgUnitParent", fields: [parentOrgUnitId], references: [id])
  childOrgUnits    OrgUnit[]       @relation("OrgUnitParent")
  hierarchyLevelId Int
  hierarchyLevel   HierarchyLevel  @relation(fields: [hierarchyLevelId], references: [id])
  code             String          @unique
  name             String
  isActive         Boolean         @default(true)
  positions        Position[]
}

model Position {
  id                   Int                  @id @default(autoincrement())
  orgUnitId            Int
  orgUnit              OrgUnit              @relation(fields: [orgUnitId], references: [id])
  title                String
  employmentStatus     String
  defaultBasePay       Decimal              @db.Decimal(15, 2)
  plannedHeadcount     Int                  @default(1)
  fte                  Decimal              @db.Decimal(5, 2)
  assignments          PositionAssignment[]
}

model PositionAssignment {
  id             Int       @id @default(autoincrement())
  positionId     Int
  position       Position  @relation(fields: [positionId], references: [id])
  employeeId     Int?
  employee       Employee? @relation(fields: [employeeId], references: [id])
  startDate      DateTime
  endDate        DateTime?
  assignmentType String
  fte            Decimal   @db.Decimal(5, 2)

  @@index([employeeId, startDate, endDate])
  @@index([positionId, startDate, endDate])
}
```

Important idea:

The org tree is recursive. `OrgUnit` points back to `OrgUnit` through `parentOrgUnitId`. That is how you represent divisions, departments, teams, and subteams.

### Code: Pay Structure Models

Pay structure answers: "What pay framework applies to this employee or position?"

```prisma
model SalaryGrade {
  id        Int      @id @default(autoincrement())
  code      String   @unique
  name      String
  rateType  String
  minSalary Decimal? @db.Decimal(15, 2)
  maxSalary Decimal? @db.Decimal(15, 2)
  currency  String   @default("PHP")
  status    String   @default("ACTIVE")
  steps     SalaryGradeStep[]
}

model SalaryGradeStep {
  id            Int         @id @default(autoincrement())
  salaryGradeId Int
  salaryGrade   SalaryGrade @relation(fields: [salaryGradeId], references: [id], onDelete: Cascade)
  stepNumber    Int
  name          String
  amount        Decimal     @db.Decimal(15, 2)
}

model EarningTemplateFamily {
  id                    Int                  @id @default(autoincrement())
  code                  String               @unique
  name                  String
  templateKind          String
  payBasisApplicability String
  status                String               @default("ACTIVE")
  revisions             EarningTemplateRevision[]
  payProfiles           EmployeePayProfile[]
}

model EarningTemplateRevision {
  id                     Int                   @id @default(autoincrement())
  earningTemplateFamilyId Int
  family                 EarningTemplateFamily @relation(fields: [earningTemplateFamilyId], references: [id], onDelete: Cascade)
  versionNo              String
  effectiveStartDate     DateTime
  effectiveEndDate       DateTime?
  isCurrent              Boolean               @default(true)

  @@index([earningTemplateFamilyId, isCurrent, effectiveStartDate])
}

model EmployeePayProfile {
  id                      Int                   @id @default(autoincrement())
  employeeId              Int
  employee                Employee              @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  earningTemplateFamilyId Int
  family                  EarningTemplateFamily @relation(fields: [earningTemplateFamilyId], references: [id])
  payBasis                String
  effectiveStartDate      DateTime
  effectiveEndDate        DateTime?
  status                  String                @default("ACTIVE")

  @@index([employeeId, status, effectiveStartDate])
}
```

Important idea:

Pay structure is not payroll. Payroll calculates actual pay. Phase 1 only prepares the structure payroll will later use.

### Code: Approval Workflow Models

Approval workflow answers: "Who must approve this request, and what state is it in?"

```prisma
model ApprovalSetup {
  id         Int                @id @default(autoincrement())
  code       String             @unique
  name       String
  moduleKey  String
  actionType String
  status     String             @default("ACTIVE")
  sequences  ApproverSequence[]
  requests   ApprovalRequest[]
}

model ApproverSequence {
  id               Int           @id @default(autoincrement())
  approvalSetupId  Int
  approvalSetup    ApprovalSetup @relation(fields: [approvalSetupId], references: [id], onDelete: Cascade)
  stepNo           Int
  name             String
  approverUserId   Int?
  approverRoleId   Int?
  requiredApprovals Int          @default(1)
  workflowSteps    ApprovalWorkflow[]

  @@unique([approvalSetupId, stepNo])
}

model ApprovalRequest {
  id                Int                @id @default(autoincrement())
  approvalSetupId   Int
  approvalSetup     ApprovalSetup      @relation(fields: [approvalSetupId], references: [id])
  requestedByUserId Int?
  requestedBy       User?              @relation(fields: [requestedByUserId], references: [id])
  employeeId        Int?
  employee          Employee?          @relation(fields: [employeeId], references: [id])
  referenceType     String?
  referenceId       Int?
  status            String
  currentStepNo     Int                @default(1)
  payloadJson       Json?
  submittedAt       DateTime?
  resolvedAt        DateTime?
  workflows         ApprovalWorkflow[]

  @@index([employeeId, status])
  @@index([requestedByUserId, status])
  @@index([status, currentStepNo])
}

model ApprovalWorkflow {
  id                 Int             @id @default(autoincrement())
  approvalRequestId  Int
  approvalRequest    ApprovalRequest @relation(fields: [approvalRequestId], references: [id], onDelete: Cascade)
  approverSequenceId Int
  approverSequence   ApproverSequence @relation(fields: [approverSequenceId], references: [id])
  approverUserId     Int?
  approverUser       User?           @relation(fields: [approverUserId], references: [id])
  status             String
  actedAt            DateTime?
  comments           String?

  @@index([approvalRequestId, status])
  @@index([approverUserId, status])
}
```

Recap:

- Auth/RBAC controls access.
- Personnel stores employee records.
- Org structure stores company hierarchy and positions.
- Pay structure stores salary/pay templates.
- Approvals store business workflow state.
- Prisma relations connect these domains.

---

## 5. Create Migrations

**Story Analogy:** A migration is the construction blueprint for the records room. It tells PostgreSQL exactly which cabinets, folders, labels, and locks to create so every environment has the same structure.

### What Is This?

A migration is a database change file. It turns your Prisma schema into SQL that PostgreSQL can apply.

### Why Do I Need It?

Production systems must be reproducible. You should be able to create a fresh database and run migrations to build the same structure.

### How Does It Connect?

Prisma schema is the design. Migrations are the construction steps.

### Code

Create your first migration:

```powershell
npm run migrate:dev -- --name baseline
```

For deployment, use:

```powershell
npm run migrate:deploy
```

Add a custom SQL migration for partial unique RBAC indexes:

```sql
-- Prisma cannot model PostgreSQL partial unique indexes directly.
-- This prevents duplicate global role-permission assignments.
CREATE UNIQUE INDEX "role_permission_global_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId")
WHERE "isActive" = true;
```

Recap:

- Prisma schema describes the target database.
- Migrations safely apply schema changes.
- Custom SQL is allowed when Prisma cannot express a PostgreSQL feature.

---

## 6. Add PrismaService

**Story Analogy:** Prisma Client is the records clerk, and `PrismaService` is the official front desk where the rest of the school asks for records. Instead of each department hiring its own clerk, everyone uses the same trusted desk.

### What Is This?

`PrismaService` is a NestJS service that owns the database connection.

### Why Do I Need It?

Without this service, every module would create its own Prisma client. That wastes connections and makes shutdown messy.

### How Does It Connect?

All domain services inject `PrismaService` when they need database access.

### Code

Create `src/core/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    // Open the database connection when Nest starts.
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    // Close the database connection when Nest shuts down.
    await this.$disconnect();
  }
}
```

Create `src/core/prisma/prisma.module.ts`:

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Recap:

- `PrismaService` is the database gateway.
- `PrismaModule` exports it to the whole app.
- Services can now query PostgreSQL through Prisma.

---

## 7. Add App Bootstrap

**Story Analogy:** App bootstrap is opening the school each morning. You unlock the right gates, put up signs, assign the complaint desk, turn on visitor rules, and publish the directory if visitors are allowed to see it.

### What Is This?

Bootstrap code is the startup code for the NestJS app. It configures CORS, validation, error handling, Swagger, and the API prefix.

### Why Do I Need It?

Every request should follow the same rules. Validation should run everywhere. Errors should look consistent. Swagger should document routes locally.

### How Does It Connect?

`main.ts` starts the app and calls `configureApp()`.

### Code

Create `src/common/constants/app.constants.ts`:

```ts
export const API_PREFIX = 'api';
export const API_DOCS_PATH = 'api/docs';
export const API_TITLE = 'Diwa HRIS API';
export const API_DESCRIPTION = 'Diwa HRIS Phase 1 backend API';
export const API_VERSION = '1.0';
export const IS_PUBLIC_KEY = 'isPublic';
```

### Code: Global Exception Filter

A filter is like the complaint desk in the school office. If something goes wrong in any department, the complaint desk turns the problem into a consistent written report.

Create `src/common/filters/api-exception.filter.ts`:

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpErrorResponseBody {
  error?: string;
  message?: string | string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function normalizeHttpResponseBody(value: unknown): HttpErrorResponseBody {
  if (typeof value === 'string') {
    return { message: value };
  }

  if (!isRecord(value)) {
    return { message: 'Unexpected error' };
  }

  const { error, message } = value;

  return {
    error: typeof error === 'string' ? error : undefined,
    message:
      typeof message === 'string' || Array.isArray(message)
        ? message
        : 'Unexpected error',
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', statusCode: 500 };
    const normalizedBody = normalizeHttpResponseBody(responseBody);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: normalizedBody.error,
      message: normalizedBody.message,
    };

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(`${request.method} ${request.url} ${status}`, stack);
    } else {
      this.logger.warn(`${request.method} ${request.url} ${status}`);
    }

    response.status(status).json(errorResponse);
  }
}
```

What this gives you:

- every error response has the same shape
- validation errors, forbidden errors, and not-found errors are easier to read
- unexpected server errors are logged with stack traces

### Code: Logging Interceptor

An interceptor is like a hallway monitor with a stopwatch. It watches a request go into a controller, waits for the response, then logs how long it took.

Create `src/common/interceptors/logging.interceptor.ts`:

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const delay = Date.now() - now;

        this.logger.log(`${method} ${url} ${statusCode} - ${delay}ms`);
      }),
    );
  }
}
```

What this gives you:

- every successful request is logged
- slow routes are easier to notice
- local debugging becomes easier

Create `src/app.bootstrap.ts`:

```ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_DESCRIPTION, API_DOCS_PATH, API_PREFIX, API_TITLE, API_VERSION } from './common/constants/app.constants';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { CORS_ORIGINS_CONFIG_KEY, DEFAULT_PORT, PORT_CONFIG_KEY, SWAGGER_ENABLED_CONFIG_KEY, type EnvironmentConfiguration } from './config/configuration';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService<EnvironmentConfiguration>);

  app.enableShutdownHooks();

  app.enableCors({
    origin: configService.get(CORS_ORIGINS_CONFIG_KEY),
    credentials: true,
  });

  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalFilters(new ApiExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties from DTOs.
      forbidNonWhitelisted: true, // Reject unknown properties instead of silently ignoring them.
      transform: true, // Convert strings like route ids into numbers when possible.
    }),
  );

  if (configService.get<boolean>(SWAGGER_ENABLED_CONFIG_KEY) === true) {
    SwaggerModule.setup(
      API_DOCS_PATH,
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle(API_TITLE)
          .setDescription(API_DESCRIPTION)
          .setVersion(API_VERSION)
          .addBearerAuth()
          .build(),
      ),
    );
  }
}

export function getAppPort(
  configService: ConfigService<EnvironmentConfiguration>,
): number {
  return configService.get(PORT_CONFIG_KEY, DEFAULT_PORT);
}
```

Create `src/main.ts`:

```ts
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { configureApp, getAppPort } from './app.bootstrap';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureApp(app);
  await app.listen(getAppPort(configService));
}

void bootstrap().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
```

Recap:

- The backend now has one startup path.
- Validation and error formatting are global.
- Swagger is available locally but can be disabled in production.

---

## 8. Add Auth Types And Permission Constants

**Story Analogy:** Every person in the school needs an ID card. Auth types describe what is printed on that ID card, and permission constants describe which rooms that card can open.

### What Is This?

Auth types define the shape of the logged-in user inside the backend.

Permission constants define all allowed permission codes.

### Why Do I Need It?

Strings like `"PERSONNEL_READ"` are easy to mistype. Constants make permissions safer and easier to reuse.

### How Does It Connect?

AuthService builds a user object. Guards read the user object. Controllers use permission constants.

### Code

Create `src/common/constants/permissions.constants.ts`:

```ts
export const PERMISSION_CODES = {
  ORG_READ: 'ORG_READ',
  ORG_MANAGE: 'ORG_MANAGE',
  PERSONNEL_READ: 'PERSONNEL_READ',
  PERSONNEL_SELF_READ: 'PERSONNEL_SELF_READ',
  PERSONNEL_SENSITIVE_READ: 'PERSONNEL_SENSITIVE_READ',
  PERSONNEL_MANAGE: 'PERSONNEL_MANAGE',
  PAY_STRUCTURE_READ: 'PAY_STRUCTURE_READ',
  PAY_STRUCTURE_SELF_READ: 'PAY_STRUCTURE_SELF_READ',
  PAY_STRUCTURE_MANAGE: 'PAY_STRUCTURE_MANAGE',
  APPROVALS_READ: 'APPROVALS_READ',
  APPROVALS_SELF_READ: 'APPROVALS_SELF_READ',
  APPROVALS_APPROVE: 'APPROVALS_APPROVE',
  APPROVALS_MANAGE: 'APPROVALS_MANAGE',
  RBAC_READ: 'RBAC_READ',
  RBAC_MANAGE: 'RBAC_MANAGE',
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

export const PERMISSIONS_KEY = 'permissions';
```

Create `src/common/auth/auth.types.ts`:

```ts
export interface AuthenticatedUser {
  id: string;
  backendUserId: number;
  name: string;
  email: string;
  role: string;
  roles: string[];
  employeeId?: string;
  permissions: string[];
}

export interface AuthenticatedRequestUser extends AuthenticatedUser {
  sessionId: number;
}

export interface AuthTokenPayload {
  sub: string;
  backendUserId: number;
  sid: number;
  email: string;
}
```

Recap:

- Permissions are centralized.
- Authenticated users have a predictable shape.
- Later guards and controllers can share these types.

---

## 9. Add Decorators

**Story Analogy:** Decorators are signs placed on doors. A sign might say "only HR staff may enter" or "public entrance." Guards read those signs before letting anyone through.

### What Is This?

A decorator is a label you attach to a class or method.

For example:

```ts
@Public()
@Post('login')
```

means "this login route does not require a token."

### Why Do I Need It?

Decorators let controllers declare security rules clearly.

### How Does It Connect?

Guards read decorator metadata to decide whether a request is allowed.

### Code

Create `src/common/decorators/public.decorator.ts`:

```ts
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/app.constants';

// Marks a route as public so auth guards skip it.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Create `src/common/decorators/permissions.decorator.ts`:

```ts
import { SetMetadata } from '@nestjs/common';
import {
  PERMISSIONS_KEY,
  type PermissionCode,
} from '../constants/permissions.constants';

// Attaches required permissions to a route.
// A user may proceed if they have any one of these permissions.
export const RequirePermissions = (...permissions: readonly PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

Recap:

- `@Public()` marks open routes.
- `@RequirePermissions()` marks protected routes.
- Guards will enforce these labels.

---

## 10. Add Authentication

**Story Analogy:** Authentication is the security desk checking whether a visitor's ID is real. If the ID is valid, the desk gives the visitor a pass for this visit.

### What Is This?

Authentication answers: "Who are you?"

This backend uses:

- Email/password login
- bcrypt password hashes
- JWT access tokens
- Database-backed sessions

### Why Do I Need It?

Personnel data is sensitive. We must know who is making every protected request.

### How Does It Connect?

AuthService checks credentials, creates a session, signs a JWT, and returns the logged-in user.

### Code

Create `src/modules/auth/auth.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN_CONFIG_KEY, JWT_SECRET_CONFIG_KEY, type EnvironmentConfiguration } from '../../config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentConfiguration>) => ({
        secret: configService.getOrThrow(JWT_SECRET_CONFIG_KEY),
        signOptions: {
          expiresIn: configService.getOrThrow(JWT_EXPIRES_IN_CONFIG_KEY),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

Create `src/modules/auth/auth.controller.ts`:

```ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { Request } from 'express';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto, @Req() request: Request) {
    return this.authService.login(body.email, body.password, {
      userAgent: request.header('user-agent'),
      ipAddress: request.ip,
    });
  }

  @RequirePermissions()
  @Post('logout')
  logout(@Req() request: Request & { user?: { sessionId: number; backendUserId: number } }) {
    return this.authService.logout(request.user);
  }
}
```

Create the main ideas in `AuthService`:

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(email: string | undefined, password: string | undefined, context: { userAgent?: string; ipAddress?: string }) {
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    const rawPassword = password ?? '';

    if (!normalizedEmail || !rawPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        credential: true,
        roleAssignments: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                rolePermissionAssignments: {
                  where: { isActive: true },
                  include: { permission: { select: { code: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.credential || !user.isActive || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await compare(rawPassword, user.credential.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        status: 'ACTIVE',
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        lastSeenAt: new Date(),
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    const token = this.jwtService.sign({
      sub: `user-${user.id}`,
      backendUserId: user.id,
      sid: session.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: `user-${user.id}`,
        backendUserId: user.id,
        name: user.displayName,
        email: user.email,
        roles: user.roleAssignments.map((assignment) => assignment.role.name),
        permissions: user.roleAssignments.flatMap((assignment) =>
          assignment.role.rolePermissionAssignments.map(
            (rolePermission) => rolePermission.permission.code,
          ),
        ),
      },
    };
  }
}
```

Recap:

- Login checks a real password hash.
- A database session is created.
- JWT contains the user id and session id.
- Permissions come from database roles.

---

## 11. Add Guards

**Story Analogy:** Guards stand at every hallway. One guard checks whether the visitor pass is real, and another checks whether the visitor is allowed into that specific room.

### What Is This?

A guard is code that runs before a controller method.

There are two guards:

- `JwtAuthGuard`: verifies the token.
- `PermissionsGuard`: verifies route permissions.

### Why Do I Need It?

Every protected route should be secure by default.

### How Does It Connect?

AppModule will register both guards globally.

### Code

Create `src/common/guards/jwt-auth.guard.ts`:

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../constants/app.constants';

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

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      request.user = this.jwtService.verify(authorization.slice(7));
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
```

Create `src/common/guards/permissions.guard.ts`:

```ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, type PermissionCode } from '../constants/permissions.constants';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      readonly PermissionCode[] | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (requiredPermissions === undefined) {
      throw new ForbiddenException('This route has no permission policy configured.');
    }

    const request = context.switchToHttp().getRequest();
    const tokenPayload = request.user;

    if (!tokenPayload?.backendUserId || !tokenPayload?.sid) {
      throw new UnauthorizedException('No authenticated session provided.');
    }

    const session = await this.prisma.userSession.findFirst({
      where: {
        id: tokenPayload.sid,
        userId: tokenPayload.backendUserId,
        status: 'ACTIVE',
        revokedAt: null,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session is no longer active.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: tokenPayload.backendUserId,
        isActive: true,
        status: 'ACTIVE',
      },
      include: {
        roleAssignments: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                rolePermissionAssignments: {
                  where: { isActive: true },
                  include: { permission: { select: { code: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user is no longer active.');
    }

    const permissions = new Set(
      user.roleAssignments.flatMap((assignment) =>
        assignment.role.rolePermissionAssignments.map(
          (rolePermission) => rolePermission.permission.code,
        ),
      ),
    );

    if (
      requiredPermissions.length === 0 ||
      requiredPermissions.some((permission) => permissions.has(permission))
    ) {
      request.user = {
        backendUserId: user.id,
        sessionId: session.id,
        email: user.email,
        name: user.displayName,
        employeeId: user.employeeId ? String(user.employeeId) : undefined,
        permissions: [...permissions],
      };

      return true;
    }

    throw new ForbiddenException('You do not have access to this resource.');
  }
}
```

Recap:

- JWT guard verifies identity.
- Permissions guard verifies authorization.
- Protected routes fail closed if no permission policy is configured.

---

## 12. Wire The App Module

**Story Analogy:** `AppModule` is the school directory. It lists every department, assigns the building-wide guards, and makes sure all offices are connected to the same building.

### What Is This?

The app module is the root module. It imports all feature modules and registers global providers.

### Why Do I Need It?

NestJS needs one place where the application is assembled.

### How Does It Connect?

All modules we build later will be imported here.

### Code

Create `src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './core/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { OrgStructureModule } from './modules/org-structure/org-structure.module';
import { PersonnelModule } from './modules/personnel/personnel.module';
import { PayStructureModule } from './modules/pay-structure/pay-structure.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    RbacModule,
    OrgStructureModule,
    PersonnelModule,
    PayStructureModule,
    ApprovalsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
```

Recap:

- AppModule imports core and feature modules.
- Guards are global.
- Every route is protected unless marked `@Public()`.

---

## 13. Build Shared API Read Helpers

**Story Analogy:** Many departments need the same front-desk routine: list records, search by name, show page 2, hide sensitive fields, and only show employees their own file. Shared read helpers are the standard front-desk checklist that every department can reuse.

### What Is This?

Shared API read helpers are small reusable utilities for the boring parts of read-only endpoints.

They handle:

- pagination
- search
- allow-listed filters
- employee self-service scoping
- response projection
- sensitive-field masking

Important: this is **not** a CRUD factory. It does not generate controllers. It only gives traditional controllers and services a shared way to read data safely.

### Why Do I Need It?

Phase 1 has many resources. If every service manually implemented pagination, filtering, masking, and employee scoping, the code would become repetitive and easy to get wrong.

The traditional approach keeps controllers and services explicit, but still shares small reusable behavior.

### How Does It Connect?

Each feature module has explicit controllers and services. Those services can call `ReadResourceService` when they need a safe paginated read.

The flow looks like this:

```mermaid
flowchart LR
  Controller["Traditional Controller"] --> DomainReadService["Domain Read Service"]
  DomainReadService --> SharedReadService["ReadResourceService"]
  SharedReadService --> Projection["projectApiRecord"]
  SharedReadService --> Prisma["PrismaService"]
```

### Code: Types

Create `src/common/api/read-resource.types.ts`:

```ts
import type { PrismaClient } from '@prisma/client';
import type { PermissionCode } from '../constants/permissions.constants';

type ReadDelegateMethodName = 'findMany' | 'findFirst' | 'count';

type HasReadDelegateMethods<T> = ReadDelegateMethodName extends keyof T
  ? T
  : never;

export type ReadModelName = Extract<
  {
    [Key in keyof PrismaClient]: HasReadDelegateMethods<
      PrismaClient[Key]
    > extends never
      ? never
      : Key;
  }[keyof PrismaClient],
  string
>;

export interface ReadFilterFieldDefinition {
  readonly query: string;
  readonly field: string;
  readonly jsonPath?: readonly string[];
}

export type ReadFilterField = string | ReadFilterFieldDefinition;

export interface ReadResourceDefinition<
  ModelName extends ReadModelName = ReadModelName,
> {
  readonly model: ModelName;
  readonly label: string;
  readonly searchFields?: readonly string[];
  readonly filterFields?: readonly ReadFilterField[];
  readonly readPermission?: PermissionCode;
  readonly selfReadPermission?: PermissionCode;
  readonly employeeReadScope?: {
    readonly field: string;
  };
}

export interface ReadAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, string>;
}

export type ApiQuery = Record<string, string | string[] | undefined>;
```

The important idea:

- `ReadModelName` means "a Prisma model that can be read."
- `ReadResourceDefinition` describes how one resource should be read.
- `employeeReadScope` tells the service how to restrict employee self-service users.

### Code: Projection

Projection means choosing what fields are returned to the API client.

We need this because raw Prisma records can contain sensitive fields.

Create `src/common/api/response-projection.ts`:

```ts
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import { PERMISSION_CODES } from '../constants/permissions.constants';
import type { ReadModelName } from './read-resource.types';

const ALWAYS_OMIT_FIELDS = new Set([
  'passwordHash',
  'tokenHash',
  'metadataJson',
  'ipAddress',
  'userAgent',
]);

const SENSITIVE_PERSONNEL_FIELDS = new Set([
  'birthDate',
  'residentialAddress',
  'sssNo',
  'tinNo',
  'philhealthNo',
  'pagibigNo',
  'bankAccountNo',
]);

const SENSITIVE_MODELS = new Set<ReadModelName>([
  'employeeProfile',
  'familyMember',
  'emergencyContact',
  'referenceContact',
  'employeeFieldValue',
  'employeeFieldValueHistory',
  'employeeProfileHistory',
]);

export function projectApiRecord(
  model: ReadModelName,
  record: unknown,
  actor: AuthenticatedRequestUser | undefined,
): unknown {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return record;
  }

  const canReadSensitive = Boolean(
    actor?.permissions.includes(PERMISSION_CODES.PERSONNEL_SENSITIVE_READ),
  );

  return Object.fromEntries(
    Object.entries(record as Record<string, unknown>)
      .map(([key, value]) => {
        if (ALWAYS_OMIT_FIELDS.has(key)) {
          return [key, undefined];
        }

        if (
          SENSITIVE_MODELS.has(model) &&
          SENSITIVE_PERSONNEL_FIELDS.has(key) &&
          !canReadSensitive
        ) {
          return [key, null];
        }

        return [key, value];
      })
      .filter((entry) => entry[1] !== undefined),
  );
}
```

The important idea:

- Some fields are always omitted.
- Sensitive personnel fields are masked unless the actor has `PERSONNEL_SENSITIVE_READ`.
- Controllers should return projected DTO-like records, not raw Prisma rows.

### Code: Read Service

Create `src/common/api/read-resource.service.ts`:

```ts
import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import { PrismaService } from '../../core/prisma/prisma.service';
import { projectApiRecord } from './response-projection';
import type { ApiQuery, ReadAllOptions, ReadResourceDefinition } from './read-resource.types';

const DEFAULT_PAGE_LIMIT = 200;
const MAX_PAGE_LIMIT = 500;
const RESERVED_QUERY_PARAMS = new Set(['page', 'limit', 'search']);

export function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function buildReadOptions(query: ApiQuery): ReadAllOptions {
  const page = firstQueryValue(query.page);
  const limit = firstQueryValue(query.limit);

  return {
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    search: firstQueryValue(query.search),
    filters: Object.fromEntries(
      Object.entries(query)
        .filter(([key]) => !RESERVED_QUERY_PARAMS.has(key))
        .map(([key, value]) => [key, firstQueryValue(value)?.trim()])
        .filter((entry): entry is [string, string] => Boolean(entry[1])),
    ),
  };
}

@Injectable()
export class ReadResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    resource: ReadResourceDefinition,
    options: ReadAllOptions = {},
    actor?: AuthenticatedRequestUser,
  ) {
    const page = options.page ? Math.max(1, Math.trunc(options.page)) : 1;
    const limit = options.limit
      ? Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.trunc(options.limit)))
      : DEFAULT_PAGE_LIMIT;

    const where = this.buildEmployeeScopeWhere(resource, actor);
    const delegate = this.prisma[resource.model] as any;

    const [data, total] = await Promise.all([
      delegate.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      delegate.count({ where }),
    ]);

    return {
      data: data.map((record: unknown) =>
        projectApiRecord(resource.model, record, actor),
      ),
      total,
      page,
      limit,
    };
  }

  async findOne(
    resource: ReadResourceDefinition,
    id: number,
    actor?: AuthenticatedRequestUser,
  ) {
    const delegate = this.prisma[resource.model] as any;
    const scopeWhere = this.buildEmployeeScopeWhere(resource, actor);
    const where = scopeWhere ? { AND: [{ id }, scopeWhere] } : { id };

    const record = await delegate.findFirst({
      where,
    });

    if (!record) {
      throw new NotFoundException(`${resource.label} ${id} was not found.`);
    }

    return projectApiRecord(resource.model, record, actor);
  }

  rejectGenericMutation(resourceLabel: string): never {
    throw new MethodNotAllowedException(
      `${resourceLabel} must be changed through a domain-specific workflow.`,
    );
  }

  private buildEmployeeScopeWhere(
    resource: ReadResourceDefinition,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const selfPermission = resource.selfReadPermission;

    if (!actor || !selfPermission || !actor.permissions.includes(selfPermission)) {
      return undefined;
    }

    if (resource.readPermission && actor.permissions.includes(resource.readPermission)) {
      return undefined;
    }

    if (!resource.employeeReadScope) {
      throw new ForbiddenException(
        `${resource.label} is not available to employee self-service.`,
      );
    }

    const employeeId = Number.parseInt(actor.employeeId ?? '', 10);

    if (!Number.isInteger(employeeId)) {
      throw new ForbiddenException('This session is not linked to an employee record.');
    }

    return { [resource.employeeReadScope.field]: employeeId };
  }
}
```

This snippet is intentionally shortened for learning. In the actual codebase, `ReadResourceService` also supports:

- search with `?search=`
- allow-listed filters such as `?status=Active`
- JSON-path filters such as department inside `orgUnitJson`
- consistent `skip` and `take` pagination

### Code: Payload Normalizer

Payload normalization is like a clerk cleaning up a form before filing it. If a date arrives as text, the clerk converts it into a real date object. If a form has nested sections, the clerk checks those sections too.

Create `src/common/payload/normalize-payload.ts`:

```ts
const ISO_DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

export type PayloadRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is PayloadRecord {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function normalizePayloadValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizePayloadValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        normalizePayloadValue(entry),
      ]),
    );
  }

  if (typeof value === 'string' && ISO_DATE_STRING_PATTERN.test(value)) {
    return new Date(value);
  }

  return value;
}

export function normalizeRecordPayload<T extends object>(
  payload: T,
): PayloadRecord {
  return normalizePayloadValue(payload) as PayloadRecord;
}
```

Use this when seed scripts or controlled write helpers need to turn incoming plain objects into Prisma-ready data.

In this backend, normal API writes mostly use DTOs and explicit service logic. The payload normalizer is still useful for seed scripts and structured helper code where many records are inserted consistently.

Recap:

- Shared read helpers create reusable paginated read behavior.
- It caps results by default.
- It masks sensitive fields.
- It supports employee self-service scoping.
- It blocks generic writes through explicit fallback methods.
- Payload normalization prepares structured data before Prisma writes.

---

## 14. Build Feature Modules With Traditional Controllers

**Story Analogy:** Each department gets its own counter with a clear label. HR has an HR counter, payroll configuration has a pay counter, approvals has an approvals counter. Traditional controllers make every counter visible and easy to find.

### What Is This?

A feature module groups related routes and services.

For example:

- `PersonnelModule`
- `PayStructureModule`
- `ApprovalsModule`
- `RbacModule`
- `OrgStructureModule`

### Why Do I Need It?

Modules keep code organized by business domain.

### How Does It Connect?

Each module registers explicit controllers and services directly. Nothing generates controllers for you.

This makes the backend easier to read:

```text
personnel-read.controller.ts  -> receives personnel read HTTP requests
personnel-read.service.ts     -> defines personnel read resources
employees.controller.ts       -> receives employee-specific write requests
employees.service.ts          -> performs employee-specific business logic
personnel.module.ts           -> wires those classes together
```

### Code: Personnel Read Service

Create `src/modules/personnel/personnel-read.service.ts`:

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import type {
  ReadAllOptions,
  ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';

export type PersonnelResourceKey =
  | 'employees'
  | 'employeeProfiles'
  | 'employeeFieldValues';

const resources = {
  employees: {
    model: 'employee',
    label: 'Employee',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: PERMISSION_CODES.PERSONNEL_SELF_READ,
    employeeReadScope: { field: 'id' },
    searchFields: ['firstName', 'lastName', 'displayName', 'email', 'employeeNumber'],
    filterFields: [
      'status',
      'jobType',
      { query: 'department', field: 'orgUnitJson', jsonPath: ['department'] },
    ],
  },
  employeeProfiles: {
    model: 'employeeProfile',
    label: 'Employee profile',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: PERMISSION_CODES.PERSONNEL_SELF_READ,
    employeeReadScope: { field: 'employeeId' },
  },
  employeeFieldValues: {
    model: 'employeeFieldValue',
    label: 'Employee field value',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: PERMISSION_CODES.PERSONNEL_SELF_READ,
    employeeReadScope: { field: 'employeeId' },
  },
} as const satisfies Record<PersonnelResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, PersonnelResourceKey>> = {
  employees: 'employees',
  'employee-profiles': 'employeeProfiles',
  'employee-field-values': 'employeeFieldValues',
};

@Injectable()
export class PersonnelReadService {
  constructor(private readonly readService: ReadResourceService) {}

  findAll(
    resourceKey: PersonnelResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: PersonnelResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(`Personnel resource ${resourcePath} was not found.`);
    }

    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }
}
```

This is still traditional. The service owns personnel-specific resource definitions. The shared read helper only performs the common read behavior.

In the full project, add the rest of the personnel resources too:

- employments
- education records
- exam records
- employment history records
- reference contacts
- family members
- emergency contacts
- PIS tabs, fields, options, policies
- onboarding/offboarding records
- LOA records
- PAF records
- profile histories

### Code: Personnel Read Controller

Create `src/modules/personnel/personnel-read.controller.ts`:

```ts
import { Controller, Get, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { buildReadOptions } from '../../common/api/read-resource.service';
import type { ApiQuery } from '../../common/api/read-resource.types';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PersonnelReadService } from './personnel-read.service';

type PersonnelRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('personnel')
export class PersonnelReadController {
  constructor(private readonly personnelReadService: PersonnelReadService) {}

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employees')
  findEmployees(@Req() request: PersonnelRequest, @Query() query: ApiQuery) {
    return this.personnelReadService.findAll(
      'employees',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employees/:id')
  findEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.personnelReadService.findOne('employees', id, request.user);
  }
}
```

For every additional resource, add two explicit routes:

```text
GET /api/personnel/resource-name
GET /api/personnel/resource-name/:id
```

That is the traditional approach: every route is visible in a controller file.

### Code: Personnel Module

Create `src/modules/personnel/personnel.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { PersonnelReadController } from './personnel-read.controller';
import { PersonnelReadService } from './personnel-read.service';

@Module({
  controllers: [EmployeesController, PersonnelReadController],
  providers: [EmployeesService, PersonnelReadService, ReadResourceService],
})
export class PersonnelModule {}
```

Repeat the same traditional pattern for:

- `OrgStructureModule`
- `PayStructureModule`
- `ApprovalsModule`
- `RbacModule`

Each domain gets:

```text
domain-read.controller.ts
domain-read.service.ts
domain.module.ts
```

Domains that have business writes also get a separate business controller/service:

```text
employees.controller.ts
employees.service.ts
approval-requests.controller.ts
approval-requests.service.ts
employee-pay-profiles.controller.ts
employee-pay-profiles.service.ts
rbac.controller.ts
rbac.service.ts
```

### Complete Phase 1 Module File Map

When your traditional structure is complete, your Phase 1 modules should look like this:

```text
src/modules/org-structure/
  org-structure.controller.ts
  org-structure.service.ts
  org-structure.module.ts

src/modules/personnel/
  personnel-read.controller.ts
  personnel-read.service.ts
  employees.controller.ts
  employees.service.ts
  personnel.module.ts

src/modules/pay-structure/
  pay-structure-read.controller.ts
  pay-structure-read.service.ts
  employee-pay-profiles.controller.ts
  employee-pay-profiles.service.ts
  pay-structure.module.ts

src/modules/approvals/
  approvals-read.controller.ts
  approvals-read.service.ts
  approval-requests.controller.ts
  approval-requests.service.ts
  approvals.module.ts

src/modules/rbac/
  rbac-read.controller.ts
  rbac-read.service.ts
  rbac.controller.ts
  rbac.service.ts
  rbac.module.ts
```

The rule is simple:

- `*-read.controller.ts` handles explicit `GET` routes.
- `*-read.service.ts` defines which Prisma resources can be read.
- Business controllers handle actions that change data.
- Modules wire controllers and services together.
- `ReadResourceService` is shared, but it does not create routes.

Recap:

- Modules group business areas.
- Controllers are explicit and easy to trace.
- Shared read helpers avoid repeating pagination and masking logic.
- Domain controllers handle real write workflows.
- There is no CRUD factory.

---

## 15. Add Domain Write Controllers

**Story Analogy:** Some paperwork is too important for a generic drop box. Changing pay, updating personnel records, approving requests, and assigning roles must go to a trained clerk who follows a specific checklist.

### What Is This?

Domain write controllers are specific endpoints for real business actions.

Examples:

- Update an employee profile
- Update an employee field value
- Change an employee pay profile
- Submit an approval request
- Approve or reject a request
- Assign a role

### Why Do I Need It?

HR writes are not simple table edits. They need validation, audit logs, permissions, and workflow rules.

### How Does It Connect?

Traditional read controllers give safe reads. Domain controllers give safe writes.

### Code: Personnel Write Endpoint

First create the DTO in `src/modules/personnel/dto/update-employee-profile.dto.ts`:

```ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeProfileDto {
  @IsOptional()
  @IsString()
  civilStatus?: string;

  @IsOptional()
  @IsString()
  residentialAddress?: string;

  @IsOptional()
  @IsString()
  bankName?: string;
}
```

Then create the controller in `src/modules/personnel/employees.controller.ts`:

```ts
import { Body, Controller, Param, ParseIntPipe, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeesService } from './employees.service';

@Controller('personnel/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch(':id/profile')
  updateProfile(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: UpdateEmployeeProfileDto,
    @Req() request: Request & { user?: AuthenticatedRequestUser },
  ) {
    return this.employeesService.updateProfile(employeeId, body, request.user);
  }
}
```

### Code: Approval Action Endpoints

First create the DTO in `src/modules/approvals/dto/approval-action.dto.ts`:

```ts
import { IsOptional, IsString } from 'class-validator';

export class ApprovalActionDto {
  @IsOptional()
  @IsString()
  comments?: string;
}
```

Then create the controller in `src/modules/approvals/approval-requests.controller.ts`:

```ts
import { Body, Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { ApprovalRequestsService } from './approval-requests.service';

@Controller('approvals/approval-requests')
export class ApprovalRequestsController {
  constructor(private readonly approvalRequestsService: ApprovalRequestsService) {}

  @RequirePermissions(PERMISSION_CODES.APPROVALS_APPROVE)
  @Post(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovalActionDto,
    @Req() request: Request & { user?: AuthenticatedRequestUser },
  ) {
    return this.approvalRequestsService.approveRequest(
      id,
      body.comments,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_APPROVE)
  @Post(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovalActionDto,
    @Req() request: Request & { user?: AuthenticatedRequestUser },
  ) {
    return this.approvalRequestsService.rejectRequest(
      id,
      body.comments,
      request.user,
    );
  }
}
```

Recap:

- Request DTOs live in `dto/` folders.
- Controllers import DTOs and stay focused on HTTP routing.
- DTOs validate input before services run.
- Permissions protect actions.
- Services contain business rules.

---

## 16. Write Workflow Logic In Services

**Story Analogy:** Approval workflows are like routing a form through signatures. A form starts as a draft, gets submitted, waits on an assigned approver, and then becomes approved, rejected, or cancelled. The service is the clerk who enforces that route.

### What Is This?

Workflow logic is code that controls state transitions.

For approvals, examples are:

- Draft to pending
- Pending to approved
- Pending to rejected
- Pending to cancelled

### Why Do I Need It?

You must prevent double approval, unauthorized approval, and edits after resolution.

### How Does It Connect?

ApprovalRequestsController receives the request. ApprovalRequestsService enforces the workflow.

### Code

```ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';

@Injectable()
export class ApprovalRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async approveRequest(
    id: number,
    comments: string | undefined,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    if (!actor) {
      throw new ForbiddenException('No authenticated user.');
    }

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.findUnique({
        where: { id },
        include: {
          workflows: {
            where: { status: 'PENDING' },
            orderBy: { id: 'asc' },
          },
        },
      });

      if (!request) {
        throw new NotFoundException(`Approval request ${id} was not found.`);
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Only pending requests can be approved.');
      }

      const workflow = request.workflows[0];

      if (!workflow) {
        throw new BadRequestException('No pending workflow step exists.');
      }

      if (workflow.approverUserId !== actor.backendUserId) {
        throw new ForbiddenException('This request is not assigned to you.');
      }

      await tx.approvalWorkflow.update({
        where: { id: workflow.id },
        data: {
          status: 'APPROVED',
          actedAt: new Date(),
          comments,
          updatedBy: actor.backendUserId,
        },
      });

      const updatedRequest = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          resolvedAt: new Date(),
          updatedBy: actor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: actor.backendUserId,
          eventType: 'APPROVAL_REQUEST_APPROVED',
          entityType: 'ApprovalRequest',
          entityId: String(id),
        },
      });

      return updatedRequest;
    });
  }
}
```

Important idea:

`$transaction` means "all of this succeeds together, or all of it rolls back." That protects workflow state.

Recap:

- Workflow services enforce status rules.
- Transactions protect multi-step updates.
- Audit events record important actions.

---

## 17. Add Seeds

**Story Analogy:** Seeds are practice files placed in the school before opening day. Dummy seeds let you rehearse with fake students and staff, while fixture seeds add only the official labels and forms the real school needs.

### What Is This?

Seed data is starter data.

This project has two seed paths:

- Dummy seed: realistic local/API test data
- Fixture seed: production-safe reference records only

### Why Do I Need It?

You need dummy data to test the APIs before real data exists. But production should not depend on dummy employees.

### How Does It Connect?

Seeds populate the same database schema used by the real app. Removing dummy data later should not require service changes.

### Code: Dummy Seed Guard

In `prisma/seed.ts`:

```ts
async function resetDatabase(): Promise<void> {
  // This protects production from accidentally deleting real data.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Refusing to run destructive dummy seed when NODE_ENV=production.',
    );
  }

  // Delete records in dependency-safe order.
  for (const model of deleteOrder) {
    const delegate = prisma[model] as unknown as { deleteMany: () => Promise<unknown> };
    await delegate.deleteMany();
  }
}
```

### Code: Fixture Seed

In `prisma/seed-fixtures.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import { seedData } from './dummy-data';

const prisma = new PrismaClient();

async function seedFixtures(): Promise<void> {
  // Upsert means: create it if missing, otherwise update it.
  for (const role of seedData.roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
      update: {
        name: role.name,
        description: role.description,
        status: 'ACTIVE',
      },
    });
  }

  for (const permission of seedData.permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      create: {
        code: permission.code,
        name: permission.name,
        description: permission.description,
      },
      update: {
        name: permission.name,
        description: permission.description,
        status: 'ACTIVE',
      },
    });
  }
}
```

Run:

```powershell
# Full local dummy data for API testing.
npm run db:seed:dummy

# Production-safe reference fixtures.
npm run db:seed:fixtures
```

Recap:

- Dummy data is for local testing.
- Fixtures are for production-like reference data.
- Business logic does not depend on dummy employees.

---

## 18. Add Health Checks

**Story Analogy:** A health check is the morning inspection. It asks, "Are the lights on? Is the records room reachable? Can the office serve visitors today?"

### What Is This?

A health check is an endpoint that tells you whether the backend and database are alive.

### Why Do I Need It?

Deployment platforms and developers need a quick way to know if the API is working.

### How Does It Connect?

HealthController calls PrismaHealthIndicator, which checks PostgreSQL.

### Code

Create `src/core/health/prisma-health.indicator.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // SELECT 1 is a tiny query used to verify database connectivity.
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Prisma check failed',
        this.getStatus(key, false, {
          message: error instanceof Error ? error.message : 'Database failed',
        }),
      );
    }
  }
}
```

Create `src/core/health/health.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prisma.isHealthy('database')]);
  }
}
```

Recap:

- Health endpoint is public.
- It checks database connectivity.
- It helps local and deployed monitoring.

---

## 19. Add Tests

**Story Analogy:** Tests are rehearsal drills. You pretend to be an employee, an approver, and an outsider to make sure every door, form, and guard behaves correctly before real people depend on the system.

### What Is This?

Tests are automated checks that prove important behavior still works.

### Why Do I Need It?

When you change auth, RBAC, or personnel privacy, you need confidence that you did not break security.

### How Does It Connect?

Tests create a Nest testing app and mock Prisma so they can test API behavior quickly.

### Code

Example e2e test shape:

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';

describe('Phase 1 backend', () => {
  let app: INestApplication;

  const prismaMock = {
    user: { findUnique: jest.fn(), findFirst: jest.fn() },
    userSession: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    auditEvent: { create: jest.fn() },
    employee: { findMany: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('requires auth for protected routes', async () => {
    await request(app.getHttpServer()).get('/api/personnel/employees').expect(401);
  });
});
```

Run:

```powershell
npm run build
npm run lint
npm run test
npm run test:integration
npm run schema:check
```

Recap:

- Tests protect your learning and your product.
- Security behavior should be tested first.
- Every important workflow should have a test.

---

## 20. Final Build Order Checklist

**Story Analogy:** This checklist is the construction schedule. If you build the office in this order, the walls, wiring, guards, counters, and records room come together without confusion.

Use this order when rebuilding from a blank project:

1. Create NestJS project with npm.
2. Add dependencies.
3. Add `.env.example`.
4. Add typed configuration.
5. Initialize Prisma.
6. Design Prisma schema by domain.
7. Create migrations.
8. Add PrismaService and PrismaModule.
9. Add app bootstrap, validation, filters, interceptors, and Swagger.
10. Add auth types and permission constants.
11. Add decorators.
12. Add AuthModule, AuthController, AuthService.
13. Add JwtAuthGuard and PermissionsGuard.
14. Wire AppModule.
15. Add shared API read helpers.
16. Add payload normalization helpers.
17. Add traditional domain modules, read controllers, and read services.
18. Add DTO folders and request DTOs.
19. Add domain write controllers/services.
20. Add seed scripts.
21. Add health checks.
22. Add tests.
23. Run verification commands.

---

## 21. What You Built

**Story Analogy:** At the end, you have a working school office: departments with counters, guards at the doors, clerks who follow rules, filing cabinets with structure, logs of important actions, and practice records for testing.

You built a production-oriented Phase 1 backend with:

- NestJS modules, controllers, services, guards, decorators, filters, and interceptors
- Prisma schema, migrations, relations, indexes, and seed scripts
- Database-backed authentication
- Session-aware JWT validation
- RBAC-protected routes
- Sensitive personnel field masking
- Consistent API error formatting through a global exception filter
- HTTP request logging through a global interceptor
- Payload normalization helpers for seed and structured write data
- Dummy data for API testing
- Production-safe fixtures for real deployments
- Traditional read routes for many Phase 1 resources
- Domain-specific write routes for sensitive business actions
- Approval workflow state transitions
- Health checks
- Automated tests

The most important lesson:

Do not think of the backend as random files. Think of it as layers:

```mermaid
flowchart TB
  API["Controllers: receive HTTP requests"]
  Security["Guards + Decorators: enforce auth and permissions"]
  Logic["Services: business rules and workflows"]
  Data["Prisma: database queries and transactions"]
  DB["PostgreSQL: durable records"]

  API --> Security
  Security --> Logic
  Logic --> Data
  Data --> DB
```

When you understand these layers, you can rebuild the backend piece by piece instead of feeling overwhelmed by the whole system at once.

---

## 22. Add Production-Ready Phase 1 Write APIs

**Story Analogy:** The school office has grown. At first, visitors could only look up records at the counters. Now trained clerks can safely change official records: create departments, assign positions, update pay templates, configure approval routes, and manage security badges. The important rule is that every counter still has a named purpose. No one is allowed to walk into the records room and change random files.

### What Is This?

This step adds explicit write endpoints for the current traditional-controller backend. These are not generic CRUD endpoints. Each endpoint has a business meaning, a permission requirement, an allow-list of writable fields, actor stamping, and audit logging.

### Why Do I Need It?

Real HRIS data is sensitive. A generic `POST /anything` or `PATCH /anything/:id` is too risky because it lets the API shape follow the database too closely. Production APIs should describe business actions, not raw table access.

### How Does It Connect?

Earlier, you built read controllers and a few domain writes. This step expands that pattern across Phase 1 while keeping the same NestJS layers:

- Controller receives the request.
- Guard checks permission.
- Service validates fields and writes through Prisma.
- Prisma transaction saves the data.
- Audit log records who changed what.

### New Explicit Write Routes

Org structure:

```http
POST  /api/org-structure/hierarchy-levels
PATCH /api/org-structure/hierarchy-levels/:id
POST  /api/org-structure/sites
PATCH /api/org-structure/sites/:id
POST  /api/org-structure/org-units
PATCH /api/org-structure/org-units/:id
POST  /api/org-structure/org-units/:id/move
POST  /api/org-structure/ranks
PATCH /api/org-structure/ranks/:id
POST  /api/org-structure/rank-levels
PATCH /api/org-structure/rank-levels/:id
POST  /api/org-structure/position-templates
PATCH /api/org-structure/position-templates/:id
POST  /api/org-structure/position-profiles
PATCH /api/org-structure/position-profiles/:id
POST  /api/org-structure/positions
PATCH /api/org-structure/positions/:id
POST  /api/org-structure/position-assignments
PATCH /api/org-structure/position-assignments/:id
POST  /api/org-structure/position-assignments/:id/end
```

Personnel:

```http
POST  /api/personnel/employees
PATCH /api/personnel/employees/:id
PATCH /api/personnel/employees/:id/profile
PATCH /api/personnel/employees/:id/field-values/:fieldId
POST  /api/personnel/employees/:id/employments
PATCH /api/personnel/employees/employments/:recordId
POST  /api/personnel/employees/:id/education-records
PATCH /api/personnel/employees/education-records/:recordId
POST  /api/personnel/employees/:id/exam-records
PATCH /api/personnel/employees/exam-records/:recordId
POST  /api/personnel/employees/:id/family-members
PATCH /api/personnel/employees/family-members/:recordId
POST  /api/personnel/employees/:id/emergency-contacts
PATCH /api/personnel/employees/emergency-contacts/:recordId
POST  /api/personnel/employees/:id/reference-contacts
PATCH /api/personnel/employees/reference-contacts/:recordId
POST  /api/personnel/employees/pis-fields
PATCH /api/personnel/employees/pis-fields/:fieldId
```

Pay structure:

```http
POST  /api/pay-structure/salary-grades
PATCH /api/pay-structure/salary-grades/:id
POST  /api/pay-structure/salary-grade-steps
PATCH /api/pay-structure/salary-grade-steps/:id
POST  /api/pay-structure/formulas
PATCH /api/pay-structure/formulas/:id
POST  /api/pay-structure/formula-versions
POST  /api/pay-structure/earning-components
PATCH /api/pay-structure/earning-components/:id
POST  /api/pay-structure/earning-template-families
POST  /api/pay-structure/earning-template-revisions
POST  /api/pay-structure/earning-template-revision-lines
POST  /api/pay-structure/employee-pay-profiles
PATCH /api/pay-structure/employee-pay-profiles/:id
```

Approvals:

```http
POST  /api/approvals/approval-setups
PATCH /api/approvals/approval-setups/:id
POST  /api/approvals/approver-sequences
PATCH /api/approvals/approver-sequences/:id
POST  /api/approvals/approval-delegations
PATCH /api/approvals/approval-delegations/:id
POST  /api/approvals/workflow-assignments
PATCH /api/approvals/workflow-assignments/:id
POST  /api/approvals/approval-workflow-notes
POST  /api/approvals/approval-requests
POST  /api/approvals/approval-requests/:id/submit
POST  /api/approvals/approval-requests/:id/approve
POST  /api/approvals/approval-requests/:id/reject
POST  /api/approvals/approval-requests/:id/cancel
```

RBAC:

```http
POST   /api/rbac/roles
PATCH  /api/rbac/roles/:id
POST   /api/rbac/permissions
PATCH  /api/rbac/permissions/:id
POST   /api/rbac/system-modules
PATCH  /api/rbac/system-modules/:id
POST   /api/rbac/users/:userId/roles
DELETE /api/rbac/users/:userId/roles/:roleId
POST   /api/rbac/roles/:roleId/permissions
DELETE /api/rbac/roles/:roleId/permissions/:permissionId
POST   /api/rbac/user-sessions/:id/revoke
```

### Code Pattern

The controller method should be small. It only receives the request and calls the service:

```ts
@RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
@Post('roles')
createRole(@Body() body: Record<string, unknown>, @Req() request: RbacRequest) {
  return this.rbacService.createRole(body, request.user);
}
```

The service owns the important rules:

```ts
createRole(data: WritePayload, actor: AuthenticatedRequestUser | undefined) {
  return this.createRecord('role', 'Role', data, actor, {
    eventType: 'RBAC_ROLE_CREATED',
    allowedFields: ['code', 'name', 'description', 'status'],
    requiredFields: ['code', 'name'],
  });
}
```

Notice the important parts:

- `allowedFields` prevents mass assignment.
- `requiredFields` prevents incomplete records.
- `actor` provides `createdBy` and `updatedBy`.
- `eventType` creates an audit trail.

Recap:

- Keep generic writes blocked.
- Add named write endpoints for real business actions.
- Always whitelist writable fields.
- Always stamp and audit mutations.

---

## 23. Harden Prisma Integrity

**Story Analogy:** A records room needs filing rules. A teacher cannot have two current contracts, a salary grade step cannot be duplicated, and an approval request cannot be both pending and already resolved. Database constraints are the filing cabinet locks that protect the records even if a clerk makes a mistake.

### What Is This?

This step adds Prisma-level uniqueness/index rules and SQL migration checks for rules Prisma cannot fully express.

### Why Do I Need It?

Service validation is useful, but production systems also need database integrity. If two API requests happen at the same time, the database must still reject impossible data.

### How Does It Connect?

The service catches common mistakes early. The database constraints are the final safety net.

### Add Prisma Constraints

Examples of useful Prisma constraints:

```prisma
model RankLevel {
  id        Int  @id @default(autoincrement())
  rankId    Int
  code      String
  sortOrder Int

  @@unique([rankId, code])
  @@unique([rankId, sortOrder])
}

model SalaryGradeStep {
  id            Int @id @default(autoincrement())
  salaryGradeId Int
  stepNumber    Int

  @@unique([salaryGradeId, stepNumber])
}
```

### Add SQL Constraints For Rules Prisma Cannot Model

Use a custom migration for rules like partial unique indexes and date ordering:

```sql
ALTER TABLE "EmployeePayProfile"
  ADD CONSTRAINT "employee_pay_profile_date_order_chk"
  CHECK ("effectiveEndDate" IS NULL OR "effectiveEndDate" >= "effectiveStartDate");

CREATE UNIQUE INDEX "employee_pay_profile_current_active_uq"
ON "EmployeePayProfile" ("employeeId")
WHERE "status" = 'ACTIVE' AND "effectiveEndDate" IS NULL;
```

Recap:

- Prisma schema handles common relations, indexes, and uniqueness.
- Custom SQL handles PostgreSQL partial indexes and check constraints.
- Service validation and database constraints work together.

---

## 24. Current-Version Upgrade Guide

**Story Analogy:** You already have a working office. This is not a rebuild from an old factory layout. This is a renovation of the current office: add more counters, strengthen locks, update the rulebook, and run an inspection before opening again.

Use this guide if your code already has the current traditional controller/service version and you want to apply the production-readiness improvements.

### Files To Add

Add:

```text
backend/src/common/api/domain-write.helpers.ts
backend/src/modules/approvals/approval-admin.controller.ts
backend/src/modules/approvals/approval-admin.service.ts
backend/prisma/migrations/202605180001_phase1_integrity_hardening/migration.sql
```

### Files To Update

Update:

```text
backend/src/common/api/read-resource.service.ts
backend/src/modules/org-structure/org-structure.controller.ts
backend/src/modules/org-structure/org-structure.service.ts
backend/src/modules/personnel/employees.controller.ts
backend/src/modules/personnel/employees.service.ts
backend/src/modules/pay-structure/pay-structure-read.controller.ts
backend/src/modules/pay-structure/employee-pay-profiles.service.ts
backend/src/modules/approvals/approvals.module.ts
backend/src/modules/rbac/rbac.controller.ts
backend/src/modules/rbac/rbac.service.ts
backend/prisma/schema.prisma
backend/test/app.e2e-spec.ts
```

### What To Change

1. Add the shared domain write helper for actor checks, allow-listed payload picking, date validation, existence checks, and audit creation.
2. Add explicit write methods to each domain service.
3. Add matching controller routes before the generic fallback write routes.
4. Keep generic write fallback methods so unknown writes still return `405`.
5. Add sensitive-read audit logging in the shared read service.
6. Add Prisma uniqueness/index rules.
7. Add SQL migration checks for effective dates, approval statuses, approver source validation, and partial current-record uniqueness.
8. Update tests so existing generic-write tests target a resource that still has no explicit write endpoint.
9. Add a test proving an explicit write route applies actor stamping.

### Commands To Run

```powershell
cd backend
npm run build
npm run lint
npm run schema:check
npm run test
npm run test:integration
```

When applying the migration locally:

```powershell
npm run migrate:dev -- --name phase1_integrity_hardening
```

When deploying to another database:

```powershell
npm run migrate:deploy
```

Recap:

- This upgrade starts from the current traditional-controller backend.
- It does not include a CRUD-factory migration.
- The goal is safer business writes, stronger database rules, better auditability, and clearer Phase 1 extension points.
