# Diwa HRIS Project Rebuild and Study Guide

This guide explains how this project works and how to rebuild it from scratch. It is written for a beginner who wants to study React, TypeScript, NestJS, Prisma, APIs, PostgreSQL, and the architecture choices used in this codebase.

The goal is not only to tell you which commands to run. The goal is to explain why each part exists, how data moves through the system, and how the frontend, backend, database, authentication, authorization, and tooling connect to each other.

## 1. What This Project Is

Diwa HRIS is a Phase 1 Human Resource Information System. It contains:

- A backend API built with NestJS.
- A PostgreSQL database accessed through Prisma.
- A frontend shell built with React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Framer Motion, and lucide-react.
- Seeded HR data for personnel, organization structure, pay structure, approvals, and RBAC.
- Authentication using JWT tokens.
- Role-based access control for Superadmin, Approver, and Employee users.
- Employee-scoped self-service reads so employees only see their own data.
- Generic read endpoints for Phase 1 resources, with generic writes blocked by default until domain-specific workflows exist.

At a high level:

```text
Browser
  -> React frontend
  -> fetch /api/...
  -> NestJS backend
  -> Guards check JWT and roles
  -> Services call Prisma
  -> PostgreSQL
```

The frontend never talks directly to PostgreSQL. The backend owns data access and security.

## 2. Repository Layout

Current top-level layout:

```text
Diwa HRIS/
  backend/
    prisma/
      schema.prisma
      migrations/
      seed.ts
      dummy-data.ts
      phase1-demo-accounts.ts
    src/
      app.module.ts
      main.ts
      app.bootstrap.ts
      common/
      core/
      modules/
    test/
    package.json
    prisma.config.ts
    tsconfig.json
  frontend/
    App.tsx
    index.tsx
    components/
    config/
    context/
    features/
    hooks/
    pages/
    package.json
    vite.config.ts
    tsconfig.json
  docs/
    local-postgres-pgadmin-guide.md
    phase1-api-inventory.md
    phase1-api-smoke-checklist.md
    project-rebuild-and-study-guide.md
```

Important principle:

- `backend/src/modules` contains business/API modules.
- `backend/src/common` contains shared guards, decorators, CRUD helpers, payload helpers, constants, filters, and interceptors.
- `backend/src/core` contains infrastructure-level backend modules, such as Prisma and health checks.
- `frontend/features` contains route-level business screens.
- `frontend/components` contains reusable layout and UI components.
- `frontend/hooks` contains reusable data-fetching and browser hooks.
- `frontend/context` contains app-wide state such as auth, breadcrumbs, and notifications.

## 3. Technology Stack

### Backend

- **NestJS**: Node.js framework for building structured APIs.
- **TypeScript**: JavaScript with static types.
- **Prisma**: Type-safe database ORM and migration tool.
- **PostgreSQL**: Relational database.
- **JWT**: Token format used for login sessions.
- **Jest + Supertest**: Test tools for backend unit and e2e API tests.
- **ESLint + Prettier**: Code quality and formatting tools.

### Frontend

- **React**: UI library for building component-based interfaces.
- **TypeScript**: Gives types to React props, API models, and state.
- **Vite**: Fast frontend dev server and build tool.
- **React Router**: Client-side routing.
- **TanStack Query**: Data-fetching and caching for API calls.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library.
- **lucide-react**: Icon library.

### Tooling

- **Bun** is listed as the package manager in the backend package metadata.
- **npm** scripts are also used successfully in this workspace.
- **Prisma config** is now in `backend/prisma.config.ts`, not `package.json#prisma`.

## 4. Core Concepts Before Building

### What Is a Frontend?

The frontend is the code that runs in the user's browser. In this project, it is a React app. It renders pages, buttons, tables, filters, navigation, and forms.

The frontend should not be trusted for security. A user can inspect or modify frontend code in their browser. That is why backend guards and filters are required.

### What Is a Backend?

The backend is a server application. It receives HTTP requests, checks authentication, checks authorization, validates data, runs business logic, talks to the database, and sends JSON responses back.

In this project, the backend is a NestJS API.

### What Is an API?

An API is a contract between systems. For example:

```http
GET /api/personnel/employees?page=1&limit=25
Authorization: Bearer <token>
```

The backend responds:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 25
}
```

The frontend uses that response to render a table and pagination controls.

### What Is a Database?

A database stores persistent data. PostgreSQL stores structured tables like `Employee`, `Role`, `ApprovalRequest`, and `SalaryGrade`.

### What Is an ORM?

ORM means Object Relational Mapper. Prisma is the ORM here. It lets TypeScript code query database tables using generated methods instead of writing raw SQL for every operation.

Example:

```ts
await prisma.employee.findMany({
  where: { status: 'ACTIVE' },
  orderBy: { id: 'asc' },
});
```

### What Is Authentication?

Authentication answers: "Who are you?"

In this project, login returns a JWT token. The frontend stores it in auth context and sends it in the `Authorization` header.

### What Is Authorization?

Authorization answers: "What are you allowed to do?"

In this project:

- Superadmin can read admin-wide resources.
- Approver can read approval/workforce resources.
- Employee can only read explicitly self-service resources and only scoped to their own employee id.

## 5. How Data Flows Through the System

The ideal data flow is:

```text
React component
  -> useApiQueries hook
  -> fetch(buildApiPath(path))
  -> Vite dev proxy or deployed API URL
  -> NestJS controller
  -> JwtAuthGuard
  -> RolesGuard
  -> PrismaCrudService or domain service
  -> Prisma Client
  -> PostgreSQL
```

Example from the employee directory:

```text
EmployeeDirectoryPage
  -> useApiQueries({
       employees: '/personnel/employees?page=1&limit=25&status=ACTIVE'
     })
  -> GET /api/personnel/employees?page=1&limit=25&status=ACTIVE
  -> JwtAuthGuard validates token
  -> RolesGuard checks role
  -> PrismaCrudService builds safe where clause
  -> prisma.employee.findMany(...)
  -> response envelope with data, total, page, limit
  -> PaginationControls renders real page controls
```

## 6. Rebuilding the Backend From Scratch

### 6.1 Create the Backend Folder

```bash
mkdir backend
cd backend
npm init -y
```

### 6.2 Install Backend Dependencies

Core dependencies:

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/jwt @nestjs/terminus @prisma/client bcryptjs class-transformer class-validator passport passport-jwt reflect-metadata rxjs
```

Development dependencies:

```bash
npm install -D @nestjs/cli @nestjs/testing @types/bcryptjs @types/express @types/jest @types/node @types/passport-jwt @types/supertest eslint eslint-config-prettier eslint-plugin-prettier globals jest prettier prisma supertest ts-jest ts-loader ts-node tsconfig-paths typescript typescript-eslint
```

### 6.3 Add TypeScript Config

The backend uses `tsconfig.json`. Important compiler options:

- `module: "nodenext"` and `moduleResolution: "nodenext"`: Node-compatible module behavior.
- `experimentalDecorators` and `emitDecoratorMetadata`: required for NestJS decorators.
- `strictNullChecks`: helps catch null/undefined bugs.
- `noImplicitAny`: prevents silent `any` types.

Avoid deprecated `baseUrl`. This project removed it because no source aliases require it.

### 6.4 Create the Nest Entry Files

`src/main.ts` is the runtime entrypoint.

`src/app.bootstrap.ts` centralizes app setup:

- API prefix, such as `/api`.
- CORS.
- Swagger docs.
- Global exception filters.
- Validation or middleware if needed later.

`src/app.module.ts` is the root Nest module. It imports:

- `ConfigModule`
- `PrismaModule`
- `HealthModule`
- `AuthModule`
- Phase 1 modules: RBAC, org structure, personnel, pay structure, approvals

It also registers global guards:

- `JwtAuthGuard`
- `RolesGuard`

### 6.5 Understand NestJS Modules

A Nest module groups related controllers and providers.

Example:

```ts
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class PersonnelModule {}
```

In this project, most Phase 1 resources use generated controllers from resource definitions instead of manually writing every CRUD controller.

### 6.6 Prisma Setup

Initialize Prisma:

```bash
npx prisma init
```

This creates:

```text
prisma/
  schema.prisma
.env
```

The schema uses PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The `DATABASE_URL` lives in `backend/.env`.

Example placeholder:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/diwa_hris?schema=public"
JWT_SECRET="replace-this-in-real-projects"
JWT_EXPIRES_IN="8h"
PORT="3000"
```

Do not commit real production secrets.

### 6.7 Prisma Config

This project uses `backend/prisma.config.ts`:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'bun run prisma/seed.ts',
  },
});
```

Why this exists:

- Prisma is deprecating `package.json#prisma`.
- Config belongs in `prisma.config.ts`.
- `dotenv/config` is required because Prisma skips automatic `.env` loading when a config file is detected.

### 6.8 Prisma Schema Design

The schema is organized around HRIS domains:

- RBAC: users, roles, permissions, role assignments.
- Org structure: company profiles, sites, hierarchy levels, org units, positions.
- Personnel: employees, profiles, education, exams, history, contacts, PIS fields.
- Pay structure: salary grades, earning templates, components, formulas, pay profiles.
- Approvals: approval setup, approver sequences, approval requests, workflow steps.

Important Prisma model concepts:

- `@id`: primary key.
- `@default(autoincrement())`: database generates numeric ids.
- `@relation`: declares table relationships.
- `@unique`: enforces uniqueness.
- `@@index`: adds an index for faster lookup.
- `Json`: stores flexible structured data.

### 6.9 Migrations

Migrations are database change scripts.

In this project:

```text
backend/prisma/migrations/
  migration_lock.toml
  202604230001_rbac_partial_uniques/
    migration.sql
```

The RBAC migration creates PostgreSQL partial unique indexes. This matters because PostgreSQL allows multiple `NULL` values in normal unique constraints. For scoped role-permission rows, nullable scope columns need partial unique indexes to truly prevent duplicates.

Apply migrations locally with:

```bash
cd backend
npx prisma migrate deploy
```

For development migration creation:

```bash
npx prisma migrate dev --name your_change_name
```

Use `migrate deploy` in deployed environments.

### 6.10 Prisma Client

Generate Prisma Client after schema changes:

```bash
npx prisma generate
```

The generated client exposes methods like:

```ts
prisma.employee.findMany()
prisma.employee.findFirst()
prisma.employee.create()
```

### 6.11 Prisma Service

`backend/src/core/prisma/prisma.service.ts` wraps Prisma Client for Nest dependency injection.

Dependency injection means classes can ask Nest for dependencies instead of manually creating them.

Example:

```ts
constructor(private readonly prisma: PrismaService) {}
```

### 6.12 Generic CRUD Pattern

The backend has a generic CRUD system:

```text
backend/src/common/crud/
  crud.factory.ts
  crud.module-metadata.ts
  crud.types.ts
  prisma-crud.service.ts
```

Resource definitions describe which Prisma model maps to which API path:

```ts
{
  path: 'employees',
  model: 'employee',
  label: 'Employee',
  searchFields: ['firstName', 'lastName', 'displayName', 'email', 'employeeNumber'],
  filterFields: ['status', 'jobType'],
}
```

The factory creates:

- `GET /api/<domain>/<path>`
- `GET /api/<domain>/<path>/:id`
- `POST /api/<domain>/<path>`
- `PATCH /api/<domain>/<path>/:id`
- `DELETE /api/<domain>/<path>/:id`

Current security rule:

- Generic reads are allowed by configured read roles.
- Generic writes are blocked by default with HTTP 405 unless the resource explicitly opts into `genericMutations`.

This is important because HR systems need workflows. You do not want arbitrary generic updates changing compensation, approval states, or lifecycle status.

### 6.13 Pagination and Filtering

Generic reads return envelopes:

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 25
}
```

Supported query params:

- `page`
- `limit`
- `search`
- allow-listed filter params such as `status`, `jobType`, or `referenceType`

Example:

```http
GET /api/personnel/employees?page=1&limit=25&search=ana&status=ACTIVE
```

Why filters are allow-listed:

- The backend should not accept arbitrary Prisma `where` objects from users.
- Each resource decides which fields are safe for public query filtering.
- Employee self-service scope is still applied after filters.

### 6.14 Authentication

Login is handled by:

```text
backend/src/modules/auth/
```

The login endpoint checks seeded demo accounts and returns a JWT token.

JWT payload includes:

- `sub`
- `backendUserId`
- `email`
- `role`
- `employeeId`
- `permissions`

The frontend stores the token and sends:

```http
Authorization: Bearer <token>
```

### 6.15 JWT Guard

`JwtAuthGuard` checks whether a request has a valid JWT.

If valid, it attaches the decoded payload to:

```ts
request.user
```

If missing or invalid, the request receives HTTP 401.

### 6.16 Roles Guard

`RolesGuard` checks the `@Roles(...)` metadata on a route.

Example:

```ts
@Roles('Superadmin', 'Approver')
@Get()
findAll() {}
```

If the user's role is not allowed, the request receives HTTP 403.

### 6.17 Employee Self-Service Scoping

Employees should not see broad HR datasets.

The generic CRUD service now supports:

```ts
employeeReadScope: { field: 'employeeId' }
```

For `/personnel/employees`, the scope is:

```ts
employeeReadScope: { field: 'id' }
```

That means an Employee token can read:

```text
GET /api/personnel/employees
```

but the backend forces:

```ts
where: { id: actor.employeeId }
```

For child records:

```ts
where: { employeeId: actor.employeeId }
```

If an employee tries to read an unscoped admin resource, the request is blocked.

### 6.18 Domain Modules

Mounted Phase 1 modules:

- `RbacModule`
- `OrgStructureModule`
- `PersonnelModule`
- `PayStructureModule`
- `ApprovalsModule`

Each module owns resource definitions for its domain.

Example:

```text
personnel/
  employees
  employments
  employee-profiles
  education-records
  exam-records
  family-members
  emergency-contacts
  paf-records
```

### 6.19 Tests

Backend tests use Jest and Supertest.

Run:

```bash
cd backend
npm run test
npm run test:e2e
```

Important current test coverage:

- Health endpoint works.
- Non-Superadmin cannot write generated CRUD.
- Superadmin also cannot use generic writes unless a resource opts in.
- Employee reads are scoped to their own employee record.
- Employee cannot read unscoped admin resources.
- Approval request self-service reads are employee-scoped.
- Allow-listed filters are preserved while unsupported filters are ignored.

## 7. Rebuilding the Frontend From Scratch

### 7.1 Create a Vite React TypeScript App

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### 7.2 Install Frontend Dependencies

```bash
npm install @tanstack/react-query framer-motion lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react typescript
```

Initialize Tailwind:

```bash
npx tailwindcss init -p
```

### 7.3 Frontend Entry Flow

The runtime starts here:

```text
frontend/index.html
  -> frontend/index.tsx
  -> frontend/App.tsx
  -> frontend/components/Layout.tsx
  -> frontend/components/AppShellRoutes.tsx
```

`index.tsx` mounts React into the DOM:

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

`App.tsx` wraps the app in providers:

- `QueryClientProvider`
- `AuthProvider`
- `NotificationProvider`
- `HashRouter`
- `BreadcrumbProvider`

### 7.4 React Components

A React component is a function that returns UI:

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}
```

Props are inputs to a component. TypeScript lets you type those props.

### 7.5 State

State is data that changes while the user is using the app.

Example:

```tsx
const [searchTerm, setSearchTerm] = useState('');
```

When `setSearchTerm` runs, React re-renders the component.

### 7.6 Derived Data

`useMemo` computes derived values:

```tsx
const rows = useMemo(() => {
  return data.map(transform);
}, [data]);
```

Use it for expensive transformations or to keep calculations clear.

### 7.7 Deferred Search

`useDeferredValue` lets React keep typing responsive while expensive UI updates happen slightly later.

Example:

```tsx
const deferredSearch = useDeferredValue(searchTerm);
```

This project uses it for table search inputs.

### 7.8 Context

Context stores app-wide values.

This project has:

- `AuthContext`: token, login state, current user.
- `BreadcrumbContext`: page title overrides.
- `NotificationContext`: shell notification state.

Context avoids passing props through every layer.

### 7.9 React Router

Routes map URLs to components.

Example:

```tsx
<Route path="/dashboard" element={<DashboardPage />} />
```

This project centralizes route metadata in:

```text
frontend/config/appShellRoutes.ts
```

Actual route rendering happens in:

```text
frontend/components/AppShellRoutes.tsx
```

### 7.10 Protected Routes

`ProtectedRoute` checks auth state before rendering a route.

If the user is not logged in:

```tsx
<Navigate to="/login" replace />
```

If the user is an Employee and tries to access admin pages, they are redirected to `/my-profile`.

Remember: frontend route guards are user experience features, not full security. Backend guards still matter most.

### 7.11 Lazy Loading

The project uses `React.lazy` for route-level code splitting:

```tsx
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
```

Why this matters:

- Without lazy loading, every page goes into the initial JavaScript bundle.
- With lazy loading, Vite creates separate chunks for feature pages.
- The initial bundle becomes smaller and faster to load.

`Suspense` shows a fallback while the chunk loads:

```tsx
<Suspense fallback={<RouteLoadingState />}>
  {children}
</Suspense>
```

### 7.12 API Base URL

The frontend builds API paths through:

```text
frontend/config/api.ts
```

During local development, Vite proxies `/api` to the backend:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

This lets frontend code call `/api/...` without hardcoding backend hostnames.

### 7.13 TanStack Query

TanStack Query manages:

- loading state
- error state
- cached API results
- refetching

The project uses:

```text
frontend/hooks/useQueries.ts
```

Important exports:

- `setApiTokenGetter`
- `buildQueryPath`
- `usePersonnelQuery`
- `useApiQueries`
- `ApiPage`

### 7.14 API Envelopes

The backend returns:

```ts
interface ApiPage<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

`useApiQueries` returns both:

- `data`: existing array-only convenience shape.
- `pages`: full pagination metadata.

This lets older screens keep working while newer screens use real pagination.

### 7.15 Building Query Paths

Use:

```ts
buildQueryPath('/personnel/employees', {
  page: 1,
  limit: 25,
  search: 'ana',
  status: 'ACTIVE',
});
```

This produces:

```text
/personnel/employees?page=1&limit=25&search=ana&status=ACTIVE
```

It skips empty values and `all`.

### 7.16 Pagination Controls

Reusable pagination UI lives in:

```text
frontend/components/phase1/PaginationControls.tsx
```

It accepts:

```ts
page: ApiPage
noun: string
onPageChange: (page: number) => void
```

Screens that use real server pagination:

- Employee Directory
- Approval List

### 7.17 Frontend Feature Screens

Important Phase 1 screens:

- Dashboard: aggregate overview.
- Employee Directory: paginated employee table.
- Employee Detail: profile, employment, pay profile, PAF, history.
- Pay Structure: compensation setup.
- Approval List: paginated approval queue.
- Approval Detail: workflow detail.
- Settings screens: RBAC, org structure, ranks, salary grades, approvals, employee fields.

### 7.18 Frontend Type Models

Shared model interfaces live in:

```text
frontend/config/phase1-data.ts
```

Examples:

```ts
export interface EmployeeRecord {
  id: number;
  employeeNumber: string;
  displayName: string;
  email: string;
  status: string;
}
```

These types describe API records so UI code does not fall back to `any`.

### 7.19 Why Avoid `any`

`any` disables TypeScript safety.

Bad:

```ts
function Card({ item }: any) {}
```

Better:

```ts
interface CardProps {
  item: EmployeeRecord;
}

function Card({ item }: CardProps) {}
```

This project tightened dashboard and employee detail tab typing so contract drift is caught earlier.

## 8. Running the Project Locally

### 8.1 Start PostgreSQL

Use local PostgreSQL or Docker. If using Docker:

```bash
docker run --name diwa-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=diwa_hris -p 5432:5432 -d postgres:16
```

### 8.2 Configure Backend `.env`

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/diwa_hris?schema=public"
JWT_SECRET="dev-only-secret"
JWT_EXPIRES_IN="8h"
PORT="3000"
```

### 8.3 Install Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run start:dev
```

If using Bun:

```bash
cd backend
bun install
bun run prisma:generate
npx prisma migrate deploy
bun run db:seed
bun run start:dev
```

### 8.4 Install Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite.

### 8.5 Useful URLs

```text
Backend API: http://localhost:3000/api
Swagger docs: http://localhost:3000/api/docs
Health check: http://localhost:3000/api/health
Frontend dev server: usually http://localhost:5173
```

## 9. Demo Accounts and Login Flow

Demo accounts are defined in:

```text
backend/prisma/phase1-demo-accounts.ts
```

The login flow:

```text
LoginPage
  -> AuthContext.login()
  -> POST /api/auth/login
  -> AuthService validates credentials
  -> JwtService signs token
  -> frontend stores token
  -> API hooks attach Authorization header
```

If an API returns 401:

- API hook emits `hris:unauthorized`.
- `ApiTokenBridge` hears that event.
- Auth context logs the user out.

## 10. Adding a New Backend Resource

Suppose you add a model called `TrainingCourse`.

### 10.1 Add Prisma Model

```prisma
model TrainingCourse {
  id        Int      @id @default(autoincrement())
  code      String   @unique
  name      String
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 10.2 Create Migration

```bash
cd backend
npx prisma migrate dev --name add_training_course
npx prisma generate
```

### 10.3 Add Resource Definition

In the relevant module:

```ts
{
  path: 'training-courses',
  model: 'trainingCourse',
  label: 'Training course',
  searchFields: ['code', 'name'],
  filterFields: ['status'],
}
```

### 10.4 Decide Access

Default read roles:

```ts
['Superadmin', 'Approver']
```

Default write roles:

```ts
['Superadmin']
```

But generic writes are still blocked unless `genericMutations: true`.

For sensitive HR workflows, prefer a domain-specific service and DTOs instead of generic writes.

### 10.5 Add Tests

Add tests for:

- allowed read role
- forbidden role
- pagination
- filters
- employee scoping if Employee can read it

## 11. Adding a New Frontend Page

### 11.1 Add Route Metadata

Edit:

```text
frontend/config/appShellRoutes.ts
```

Add:

```ts
{
  path: '/manage/training',
  title: 'Training',
  description: 'Training course management.',
  phase: 'phase1',
}
```

### 11.2 Create the Page

```text
frontend/features/training/TrainingPage.tsx
```

Example:

```tsx
export default function TrainingPage() {
  usePageTitle('Training');

  const { status, data, errorMessage, refresh } = useApiQueries({
    courses: '/training/training-courses?page=1&limit=25',
  });

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState description={errorMessage} />;

  return <div>{data.courses.length} courses</div>;
}
```

### 11.3 Lazy Load the Page

In `AppShellRoutes.tsx`:

```tsx
const TrainingPage = lazy(() => import('../features/training/TrainingPage'));
```

Then map the route in the switch or route renderer.

### 11.4 Use Typed Models

Add a type in `phase1-data.ts`:

```ts
export interface TrainingCourseRecord {
  id: number;
  code: string;
  name: string;
  status: string;
}
```

Then cast carefully at the API boundary:

```ts
const courses = (data.courses ?? []) as TrainingCourseRecord[];
```

## 12. Adding a Domain-Specific Write Workflow

Generic writes are intentionally blocked by default.

For real HR writes, create:

- DTO classes with validation.
- A controller endpoint with clear intent.
- A service method with business rules.
- A transaction if multiple tables must change together.
- Audit stamping from the authenticated user.
- Tests.

Example workflow:

```text
POST /api/personnel/employees/:id/paf
```

This is better than:

```text
PATCH /api/personnel/employees/:id
```

because it can:

- create a PAF record
- create an approval request
- create workflow steps
- avoid immediately mutating employee state
- preserve audit trail

## 13. Testing Strategy

### Backend

Run:

```bash
cd backend
npm run lint
npm run build
npm run test
npm run test:e2e
```

What each command catches:

- `lint`: unsafe TypeScript and style issues.
- `build`: TypeScript compilation errors.
- `test`: Jest tests.
- `test:e2e`: API behavior through Nest HTTP server.

### Frontend

Run:

```bash
cd frontend
npm run build
```

This runs:

- `tsc --noEmit`
- `vite build`

It catches:

- TypeScript errors.
- broken imports.
- route lazy-loading issues.
- production bundle problems.

## 14. Common Debugging Workflows

### Backend API Returns 401

Check:

- Is the frontend sending `Authorization: Bearer <token>`?
- Is the token expired?
- Does `JWT_SECRET` match the secret used to sign the token?

### Backend API Returns 403

Check:

- Does the route have `@Roles(...)`?
- Is the user's role allowed?
- Is the resource employee-scoped but the token has no `employeeId`?

### Backend API Returns 405

This likely means generic writes are blocked.

Use a domain-specific workflow instead.

### Prisma Cannot Find `DATABASE_URL`

Because this project uses `prisma.config.ts`, the config imports:

```ts
import 'dotenv/config';
```

If validation still fails:

- Make sure `backend/.env` exists.
- Make sure `DATABASE_URL` is spelled correctly.
- Run Prisma commands from the `backend` directory.

### Frontend Shows Empty Data

Check:

- Is backend running?
- Is Vite proxy configured?
- Is the user logged in?
- Did the API return 401 or 403?
- Is the route allowed for the current role?
- Does the API path include `/api` automatically through `buildApiPath`?

### Pagination Looks Wrong

Check:

- Is the backend returning `{ data, total, page, limit }`?
- Is the screen using `pages.<key>` from `useApiQueries`?
- Are filters being sent through `buildQueryPath`?
- Is the filter allow-listed in the backend resource definition?

## 15. TypeScript Concepts Used Here

### Interfaces

Interfaces describe object shapes:

```ts
interface EmployeeRecord {
  id: number;
  displayName: string;
}
```

### Union Types

Union means one of several values:

```ts
type UserRole = 'Superadmin' | 'Approver' | 'Employee';
```

### Optional Properties

`?` means the property may be missing:

```ts
phone?: string | null;
```

### Generics

Generics let functions work with different types:

```ts
function identity<T>(value: T): T {
  return value;
}
```

This project uses generics in CRUD types and API hooks.

### Type Guards

A type guard narrows unknown data:

```ts
function isApiPage(value: unknown): value is ApiPage {
  return typeof value === 'object' && value !== null && 'data' in value;
}
```

### Why `unknown` Is Safer Than `any`

`any` says: "trust me, do anything."

`unknown` says: "we do not know yet; check it first."

Use `unknown` at boundaries, then validate or narrow.

## 16. React Concepts Used Here

### Components

Reusable UI functions.

### Props

Inputs passed to components.

### State

Data that changes in the browser.

### Effects

`useEffect` runs after render for side effects, such as syncing tokens or resetting pagination.

### Memoization

`useMemo` keeps derived calculations stable between renders.

### Lazy Loading

`React.lazy` splits code by route.

### Context

App-wide state without prop drilling.

## 17. NestJS Concepts Used Here

### Modules

Group related functionality.

### Controllers

Handle HTTP routes.

### Providers and Services

Hold reusable logic and are dependency-injected.

### Guards

Allow or block requests.

### Decorators

Nest uses decorators like:

```ts
@Controller()
@Get()
@Injectable()
```

### Interceptors

Run logic around requests and responses. This project has a logging interceptor.

## 18. Prisma Concepts Used Here

### Schema

The source of truth for database models.

### Client

Generated TypeScript database client.

### Migration

SQL history of schema changes.

### Seed

Script that inserts demo data.

### Relations

Connections between models, such as employee to employments.

### Partial Unique Indexes

PostgreSQL-specific indexes that enforce uniqueness only when a condition is true.

This project uses them for nullable RBAC scope columns.

## 19. Security Rules in This Project

### Frontend Rules

- Do not trust frontend-only route hiding.
- Send tokens through headers.
- Handle 401 by logging out.
- Do not store secrets in frontend code.

### Backend Rules

- Every non-public route goes through JWT auth.
- Roles are enforced server-side.
- Employees only read scoped self-service data.
- Generic writes are blocked by default.
- Filters are allow-listed.
- Audit and workflow-sensitive writes should be domain-specific.

### Database Rules

- Use foreign keys for relationships.
- Use indexes for lookup performance.
- Use migrations for structural changes.
- Use partial unique indexes for nullable uniqueness cases.

## 20. Current Validation Checklist

Before saying the codebase is healthy, run:

```bash
cd backend
npx prisma validate
npm run lint
npm run build
npm run test
npm run test:e2e
```

Then:

```bash
cd frontend
npm run build
```

Expected result:

- Prisma schema valid.
- Backend lint passes.
- Backend build passes.
- Backend unit tests pass.
- Backend e2e tests pass.
- Frontend TypeScript and Vite build pass.
- No Vite large chunk warning.
- No Prisma `package.json#prisma` deprecation warning.
- No TypeScript `baseUrl` deprecation warning in source configs.

## 21. Current Architecture Decisions

### Why Generic Reads Exist

Phase 1 needs broad read visibility across many seeded HRIS tables. Generic reads prevent writing dozens of near-identical controllers.

### Why Generic Writes Are Blocked

Writes in HRIS are workflow-sensitive. A pay change, lifecycle change, approval state change, or role assignment should not be a simple generic patch.

### Why Employee Reads Are Scoped

Employees should only see their own self-service data. UI hiding is not enough. The backend enforces scope.

### Why API Responses Use Envelopes

Tables need pagination metadata:

- total rows
- current page
- page limit

Returning only arrays makes pagination difficult.

### Why Route Lazy Loading Was Added

The initial frontend bundle was too large. Lazy route imports split feature screens into separate chunks.

## 22. How to Study This Project

Suggested learning path:

1. Read `frontend/App.tsx` to understand providers.
2. Read `frontend/components/AppShellRoutes.tsx` to understand routing.
3. Read `frontend/hooks/useQueries.ts` to understand API calls.
4. Read `frontend/features/personnel/EmployeeDirectoryPage.tsx` to understand paginated UI.
5. Read `backend/src/app.module.ts` to understand the backend root module.
6. Read `backend/src/common/guards/jwt-auth.guard.ts` for authentication.
7. Read `backend/src/common/guards/roles.guard.ts` for authorization.
8. Read `backend/src/common/crud/prisma-crud.service.ts` for data access.
9. Read `backend/src/modules/personnel/personnel.module.ts` for resource definitions.
10. Read `backend/prisma/schema.prisma` to understand database structure.
11. Read `backend/test/app.e2e-spec.ts` to see expected security behavior.

## 23. Beginner Exercises

Try these in order:

1. Add a new read-only field to an existing Prisma model.
2. Run a migration.
3. Expose the field in an existing frontend type.
4. Render it in a table.
5. Add a filter field to the backend resource definition.
6. Send that filter from the frontend using `buildQueryPath`.
7. Add an e2e test proving unsupported filters are ignored.
8. Add a new lazy-loaded route placeholder.
9. Replace that placeholder with a real API-connected page.
10. Create a domain-specific POST endpoint with a DTO.

## 24. Production Considerations

Before production, add:

- Real identity provider or hardened user management.
- Strong password and token policies.
- Refresh token strategy if needed.
- DTO validation for all write workflows.
- Audit tables for sensitive actions.
- Database backup plan.
- Structured logging.
- Monitoring and alerting.
- Rate limiting.
- CSRF strategy if cookies are used.
- Environment-specific config.
- CI pipeline running all validation commands.

## 25. Quick Command Reference

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma validate
npx prisma migrate deploy
npm run db:seed
npm run start:dev
npm run lint
npm run build
npm run test
npm run test:e2e
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

Database:

```bash
docker run --name diwa-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=diwa_hris -p 5432:5432 -d postgres:16
```

## 26. Glossary

- **API**: A contract for one program to talk to another.
- **Backend**: Server-side application.
- **Frontend**: Browser-side application.
- **CRUD**: Create, read, update, delete.
- **DTO**: Data transfer object, usually request body shape plus validation.
- **Guard**: NestJS class that allows or blocks a request.
- **JWT**: Signed token used to identify a user session.
- **Migration**: Database change script.
- **ORM**: Tool that maps code objects to database tables.
- **Prisma Client**: Generated TypeScript database client.
- **Provider**: Injectable NestJS class.
- **React component**: Function that renders UI.
- **Route**: URL mapped to a page.
- **Seed**: Script that inserts initial/demo data.
- **TypeScript interface**: Compile-time object shape.
- **RBAC**: Role-based access control.
- **Self-service scope**: A security filter limiting an employee to their own records.

## 27. Final Mental Model

Think of the project as layers:

```text
PostgreSQL stores truth.
Prisma gives TypeScript access to truth.
NestJS protects and shapes truth into APIs.
React asks APIs for data and renders screens.
TypeScript checks contracts across the code.
Tests prove important security and data-flow rules.
```

When adding anything new, ask:

- Which database model owns this data?
- Which backend module owns this API?
- Which roles may read it?
- Is Employee access allowed, and if yes, how is it scoped?
- Is this a generic read or a workflow write?
- What response shape does the frontend need?
- What TypeScript model represents it?
- Which route or component renders it?
- What test proves it behaves safely?

If you can answer those questions, you can rebuild and extend this project with confidence.
