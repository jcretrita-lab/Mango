# Local PostgreSQL Seeding

1. Create a local PostgreSQL database in pgAdmin named `diwa_hris`.
2. Copy `.env.example` to `.env`.
3. Update `DATABASE_URL` in `.env` with your local PostgreSQL credentials.
4. Install dependencies with `bun install`.
5. Generate the Prisma client with `bun run prisma:generate`.
6. Push the schema with `bun run prisma:push`.
7. Seed the database with `bun run db:seed`.

Useful URLs after the backend is running:

- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/api/health`

Example Phase 1 routes:

- `GET /api/org-structure/company-profiles`
- `GET /api/org-structure/org-unit-closures`
- `GET /api/org-structure/org-units`
- `GET /api/personnel/employees`
- `GET /api/personnel/employee-field-value-histories`
- `GET /api/pay-structure/employee-pay-profiles`
- `GET /api/pay-structure/salary-grades`
- `GET /api/pay-structure/salary-grade-steps`
- `GET /api/approvals/approval-requests`
- `GET /api/rbac/roles`

Notes:

- The mounted Phase 1 business domains are `org-structure`, `pay-structure`, `personnel`, `approvals`, and `rbac`.
- `identity` is not mounted as part of the Phase 1 API scope.
- Legacy singular aliases remain available for `company-profile`, `org-unit-closure`, `employee-field-value-history`, and `employee-profile-history`.
