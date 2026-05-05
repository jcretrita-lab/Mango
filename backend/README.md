# Diwa HRIS Backend

NestJS + Prisma backend for Diwa HRIS Phase 1.

## Phase 1 API scope

Mounted business domains:

- `org-structure`
- `pay-structure`
- `personnel`
- `approvals`
- `rbac`

Out of scope for this Phase 1 mount:

- `identity`
- org-structure resources for position versions
- org-structure resources for position hierarchy cache

The backend uses a generic CRUD pattern for Phase 1 resources:

- `GET /api/<domain>/<resource>`
- `GET /api/<domain>/<resource>/:id`
- `POST /api/<domain>/<resource>`
- `PATCH /api/<domain>/<resource>/:id`
- `DELETE /api/<domain>/<resource>/:id`

Representative collection routes:

- `GET /api/org-structure/company-profiles`
- `GET /api/org-structure/org-unit-closures`
- `GET /api/pay-structure/salary-grades`
- `GET /api/pay-structure/salary-grade-steps`
- `GET /api/personnel/employee-field-value-histories`
- `GET /api/personnel/employee-profile-histories`
- `GET /api/approvals/approval-requests`
- `GET /api/rbac/roles`

Legacy singular collection aliases remain available for the renamed Phase 1 resources to avoid breaking existing callers.

## Local setup

```bash
bun install
bun run prisma:generate
bun run prisma:push
bun run db:seed
bun run start:dev
```

## Useful URLs

- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/health`
