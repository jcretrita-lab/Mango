# Phase 1 API Testing Guide

This is your beginner-friendly manual for testing the Phase 1 backend with dummy data.

Phase 1 covers:

- Authentication
- Role-based access control (RBAC)
- Organizational structure
- Personnel information system
- Pay structure
- Approval workflows

The examples assume the backend runs here:

```text
http://localhost:3000/api
```

---

## 1. Prepare The Backend

### 1.1 Go to the backend folder

```powershell
cd backend
```

### 1.2 Install packages

```powershell
npm install
```

### 1.3 Check your `.env`

Your backend needs a PostgreSQL connection string and JWT secret:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres?schema=public"
JWT_SECRET="replace-this-with-a-long-local-secret"
SWAGGER_ENABLED=true
PORT=3000
```

Use your real PostgreSQL username, password, host, port, and database name.

### 1.4 Generate Prisma Client

```powershell
npm run prisma:generate
```

### 1.5 Apply migrations

For normal local use after migration files already exist:

```powershell
npm run migrate:deploy
```

For creating a new local migration while developing:

```powershell
npm run migrate:dev
```

### 1.6 Load dummy data

```powershell
npm run db:seed:dummy
```

This creates test users, roles, permissions, org units, employees, pay records, and approval data.

### 1.7 Start the server

```powershell
npm run start:dev
```

---

## 2. Test Accounts

All dummy accounts use the same password:

```text
DiwaPhase1!
```

### Superadmin

Use this for most tests because it has full Phase 1 access.

```text
email: platform.admin@diwalearning.seed
password: DiwaPhase1!
```

### Approver

Use this for approval tests.

```text
email: antonio.roxas@diwalearning.local
password: DiwaPhase1!
```

### Employee Self-Service

Use this to test employee-scoped access.

```text
email: lance.robredo@diwalearning.local
password: DiwaPhase1!
```

If one of these emails does not work in your local seed, check the source file:

```text
backend/prisma/bootstrap-accounts.ts
```

---

## 3. How To Send Requests

You can use Swagger, Postman, Thunder Client, Insomnia, or curl.

### Swagger

Open:

```text
http://localhost:3000/api/docs
```

Flow:

1. Run `POST /api/auth/login`.
2. Copy the returned token.
3. Click `Authorize`.
4. Paste:

```text
Bearer YOUR_TOKEN_HERE
```

### Postman Or Thunder Client

Create environment variables:

```text
baseUrl = http://localhost:3000/api
token = paste-login-token-here
```

For protected APIs, add this header:

```text
Authorization: Bearer {{token}}
```

---

## 4. How To Login

Request:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "platform.admin@diwalearning.seed",
  "password": "DiwaPhase1!"
}
```

Expected:

- HTTP `201`
- response has `token`
- response has `user`
- user has roles and permissions

Use the token in later requests:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

Logout:

```http
POST http://localhost:3000/api/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

After logout, using the same token should return `401`.

---

## 5. Common Response Shapes

Collection/list APIs return:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 200
}
```

Single-record APIs return one object.

Write APIs usually return the created or updated object.

Sensitive data rules:

- `passwordHash` should never appear.
- `tokenHash` should never appear.
- raw session metadata should not appear.
- sensitive personnel fields are masked unless the user has sensitive personnel permission.

---

## 6. Useful IDs From Dummy Data

You can usually start with these IDs:

```text
employeeId: 1
approvalSetupId: 1
roleId: 3
permissionId: 1
salaryGradeId: 1
earningTemplateFamilyId: 1
formulaId: 1
```

If an ID does not exist, list the resource first. Example:

```http
GET http://localhost:3000/api/personnel/employees?page=1&limit=5
Authorization: Bearer SUPERADMIN_TOKEN
```

Copy an `id` from the response and use it in the write test.

---

## 7. Health API

### Check backend and database health

```http
GET http://localhost:3000/api/health
```

Expected:

- HTTP `200`
- app/database status is healthy

---

## 8. Auth APIs

### Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "platform.admin@diwalearning.seed",
  "password": "DiwaPhase1!"
}
```

### Logout

```http
POST http://localhost:3000/api/auth/logout
Authorization: Bearer SUPERADMIN_TOKEN
```

### Security checks

Bad password:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "platform.admin@diwalearning.seed",
  "password": "wrong-password"
}
```

Expected:

- HTTP `401`

---

## 9. Shared Read Behavior

Use any list endpoint to test pagination:

```http
GET http://localhost:3000/api/personnel/employees?page=1&limit=20
Authorization: Bearer SUPERADMIN_TOKEN
```

Search employees:

```http
GET http://localhost:3000/api/personnel/employees?search=lance
Authorization: Bearer SUPERADMIN_TOKEN
```

Filter employees:

```http
GET http://localhost:3000/api/personnel/employees?status=Active
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- collection response has `data`, `total`, `page`, `limit`
- unsupported filters are ignored
- routes without token return `401`
- routes without permission return `403`

---

## 10. Org Structure APIs

Use Superadmin for every admin/write test in this section.

Important test habit: list a resource first, copy a real `id`, then use that `id` in write/update/delete tests. The examples use seeded IDs where possible, but your local database may differ after repeated testing.

### 10.1 Shared Org Structure Read Tests

All list APIs support `page` and `limit`. Many also support `search` and resource-specific filters such as `active=true`, `orgUnitId=1`, `employeeId=1`, or `positionProfileId=1`.

```http
GET http://localhost:3000/api/org-structure/org-units?page=1&limit=10&search=finance&active=true
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- HTTP `200`
- response has `data`, `total`, `page`, `limit`
- invalid typed filters, such as `active=maybe`, return `400`

### 10.2 Complete Org Structure Endpoint Checklist

```http
GET    /api/org-structure/company-profiles
GET    /api/org-structure/company-profiles/:id
POST   /api/org-structure/company-profiles
PATCH  /api/org-structure/company-profiles/:id
PATCH  /api/org-structure/company-profiles/:id/status

GET    /api/org-structure/hierarchy-levels
GET    /api/org-structure/hierarchy-levels/:id
POST   /api/org-structure/hierarchy-levels
PATCH  /api/org-structure/hierarchy-levels/:id
DELETE /api/org-structure/hierarchy-levels/:id

GET    /api/org-structure/sites
GET    /api/org-structure/sites/:id
POST   /api/org-structure/sites
PATCH  /api/org-structure/sites/:id
PATCH  /api/org-structure/sites/:id/status

GET    /api/org-structure/org-units
GET    /api/org-structure/org-units/:id
POST   /api/org-structure/org-units
PATCH  /api/org-structure/org-units/:id
PATCH  /api/org-structure/org-units/:id/status
PATCH  /api/org-structure/org-units/:id/head-position
POST   /api/org-structure/org-units/:id/move
DELETE /api/org-structure/org-units/:id
GET    /api/org-structure/org-units/:id/children
GET    /api/org-structure/org-units/:id/ancestors
GET    /api/org-structure/org-units/:id/descendants
GET    /api/org-structure/org-units/as-of?date=YYYY-MM-DD
POST   /api/org-structure/org-units/:id/rebuild-closure

GET    /api/org-structure/org-unit-closures
GET    /api/org-structure/org-unit-closures/:id

GET    /api/org-structure/org-unit-versions
GET    /api/org-structure/org-unit-versions/:id
POST   /api/org-structure/org-unit-versions

GET    /api/org-structure/ranks
GET    /api/org-structure/ranks/:id
POST   /api/org-structure/ranks
PATCH  /api/org-structure/ranks/:id
DELETE /api/org-structure/ranks/:id

GET    /api/org-structure/rank-levels
GET    /api/org-structure/rank-levels/:id
POST   /api/org-structure/rank-levels
PATCH  /api/org-structure/rank-levels/:id
DELETE /api/org-structure/rank-levels/:id

GET    /api/org-structure/position-templates
GET    /api/org-structure/position-templates/:id
POST   /api/org-structure/position-templates
PATCH  /api/org-structure/position-templates/:id
DELETE /api/org-structure/position-templates/:id

GET    /api/org-structure/position-profiles
GET    /api/org-structure/position-profiles/:id
POST   /api/org-structure/position-profiles
PATCH  /api/org-structure/position-profiles/:id
DELETE /api/org-structure/position-profiles/:id

GET    /api/org-structure/position-sub-levels
GET    /api/org-structure/position-sub-levels/:id
POST   /api/org-structure/position-sub-levels
PATCH  /api/org-structure/position-sub-levels/:id
DELETE /api/org-structure/position-sub-levels/:id

GET    /api/org-structure/positions
GET    /api/org-structure/positions/:id
GET    /api/org-structure/positions/headcount-summary
POST   /api/org-structure/positions
PATCH  /api/org-structure/positions/:id
PATCH  /api/org-structure/positions/:id/supervisor
DELETE /api/org-structure/positions/:id

GET    /api/org-structure/position-assignments
GET    /api/org-structure/position-assignments/:id
POST   /api/org-structure/position-assignments
PATCH  /api/org-structure/position-assignments/:id
POST   /api/org-structure/position-assignments/:id/end

GET    /api/system-settings/rank-terminology
PATCH  /api/system-settings/rank-terminology
```

Org-structure UI also depends on these pay-structure APIs:

```http
GET    /api/pay-structure/salary-grades
GET    /api/pay-structure/salary-grades/:id
POST   /api/pay-structure/salary-grades
PATCH  /api/pay-structure/salary-grades/:id
DELETE /api/pay-structure/salary-grades/:id

GET    /api/pay-structure/salary-grade-steps
GET    /api/pay-structure/salary-grade-steps/:id
POST   /api/pay-structure/salary-grade-steps
PATCH  /api/pay-structure/salary-grade-steps/:id
DELETE /api/pay-structure/salary-grade-steps/:id
```

For every `GET .../:id` endpoint in the checklist, first call the matching list endpoint, copy an existing `id`, then call the single-record endpoint. Example:

```http
GET http://localhost:3000/api/org-structure/positions/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- existing ID returns HTTP `200` and one object
- missing ID returns `404`

### 10.3 Company Profile Tests

List and get:

```http
GET http://localhost:3000/api/org-structure/company-profiles?search=Diwa
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
GET http://localhost:3000/api/org-structure/company-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/company-profiles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "registeredName": "API Test Company Inc.",
  "displayName": "API Test Company",
  "registrationType": "DOMESTIC_CORPORATION",
  "registrationNo": "API-REG-001",
  "tin": "999-999-999-000",
  "businessAddress": "API Test Address",
  "countryCode": "PH",
  "status": "ACTIVE"
}
```

Update:

```http
PATCH http://localhost:3000/api/org-structure/company-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "displayName": "Updated API Company",
  "rdoCode": "044"
}
```

Deactivate/reactivate:

```http
PATCH http://localhost:3000/api/org-structure/company-profiles/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

Expected:

- create requires legal/statutory fields
- status update changes only `status`
- invalid/missing required fields return `400`

### 10.4 Hierarchy Level Tests

List/get:

```http
GET http://localhost:3000/api/org-structure/hierarchy-levels?levelNo=1
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/hierarchy-levels
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "levelNo": 99,
  "label": "API Test Level",
  "description": "Created during API testing"
}
```

Update:

```http
PATCH http://localhost:3000/api/org-structure/hierarchy-levels/99
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "label": "Updated API Test Level"
}
```

Delete:

```http
DELETE http://localhost:3000/api/org-structure/hierarchy-levels/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- delete succeeds only when no org units or org unit versions use the level
- deleting a referenced level returns `400`

### 10.5 Site Tests

List/get:

```http
GET http://localhost:3000/api/org-structure/sites?search=Manila&active=true
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/sites
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-SITE",
  "name": "API Test Site",
  "city": "Quezon City",
  "region": "NCR",
  "countryCode": "PH",
  "isActive": true,
  "sortOrder": 99
}
```

Update:

```http
PATCH http://localhost:3000/api/org-structure/sites/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Site Name"
}
```

Deactivate/reactivate:

```http
PATCH http://localhost:3000/api/org-structure/sites/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "isActive": false
}
```

Expected:

- create requires `code` and `name`
- `active=true` and `active=false` filters work
- invalid status values return `400`

### 10.6 Org Unit Tree Tests

List/get:

```http
GET http://localhost:3000/api/org-structure/org-units?search=Finance&active=true
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/org-units
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "parentOrgUnitId": 1,
  "hierarchyLevelId": 1,
  "code": "API-UNIT",
  "name": "API Test Unit",
  "isActive": true
}
```

Update:

```http
PATCH http://localhost:3000/api/org-structure/org-units/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Org Unit Name"
}
```

Deactivate/reactivate:

```http
PATCH http://localhost:3000/api/org-structure/org-units/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "inactive"
}
```

Move:

```http
POST http://localhost:3000/api/org-structure/org-units/2/move
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "parentOrgUnitId": 1
}
```

Children/ancestors/descendants:

```http
GET http://localhost:3000/api/org-structure/org-units/1/children
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
GET http://localhost:3000/api/org-structure/org-units/2/ancestors
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
GET http://localhost:3000/api/org-structure/org-units/1/descendants
Authorization: Bearer SUPERADMIN_TOKEN
```

Rebuild closure:

```http
POST http://localhost:3000/api/org-structure/org-units/1/rebuild-closure
Authorization: Bearer SUPERADMIN_TOKEN
```

Delete org unit and child units:

```http
DELETE http://localhost:3000/api/org-structure/org-units/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- create creates closure rows automatically
- move prevents moving a unit under itself or under its descendant
- rebuild returns rebuilt org unit IDs and closure row count
- delete succeeds only when the subtree has no positions and is not used as a company root

### 10.7 Org Unit Closure And Version Tests

Closure list/get:

```http
GET http://localhost:3000/api/org-structure/org-unit-closures?ancestorOrgUnitId=1
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
GET http://localhost:3000/api/org-structure/org-unit-closures/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Version list/get:

```http
GET http://localhost:3000/api/org-structure/org-unit-versions?orgUnitId=1&current=true
Authorization: Bearer SUPERADMIN_TOKEN
```

Create version:

```http
POST http://localhost:3000/api/org-structure/org-unit-versions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "orgUnitId": 1,
  "parentOrgUnitId": null,
  "hierarchyLevelId": 1,
  "name": "API Versioned Org Unit",
  "effectiveStartDate": "2026-06-01T00:00:00.000Z",
  "isCurrent": true,
  "changeReason": "API testing"
}
```

Point-in-time chart:

```http
GET http://localhost:3000/api/org-structure/org-units/as-of?date=2026-06-01
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- creating a current version marks previous current versions for the same org unit as not current
- as-of response returns versions effective on the requested date
- end date before start date returns `400`

### 10.8 Rank And Rank Level Tests

List/get ranks:

```http
GET http://localhost:3000/api/org-structure/ranks?search=Manager&mode=STANDARD
Authorization: Bearer SUPERADMIN_TOKEN
```

Create/update/delete rank:

```http
POST http://localhost:3000/api/org-structure/ranks
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Rank",
  "sortOrder": 99,
  "color": "#2563eb",
  "mode": "STANDARD"
}
```

```http
PATCH http://localhost:3000/api/org-structure/ranks/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "color": "#16a34a"
}
```

```http
DELETE http://localhost:3000/api/org-structure/ranks/99
Authorization: Bearer SUPERADMIN_TOKEN
```

List/create/update/delete rank level:

```http
GET http://localhost:3000/api/org-structure/rank-levels?rankId=1
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
POST http://localhost:3000/api/org-structure/rank-levels
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "rankId": 1,
  "code": "API-L1",
  "sortOrder": 99
}
```

```http
PATCH http://localhost:3000/api/org-structure/rank-levels/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-L1-UPD"
}
```

```http
DELETE http://localhost:3000/api/org-structure/rank-levels/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- rank delete fails while rank levels or position profiles use it
- rank level delete fails while position profiles use it

### 10.9 Position Template, Profile, And Sub-Level Tests

Position template:

```http
GET http://localhost:3000/api/org-structure/position-templates?search=Teacher&family=Academic
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
POST http://localhost:3000/api/org-structure/position-templates
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Position Template",
  "family": "Operations",
  "category": "Staff",
  "description": "Created during API testing"
}
```

```http
PATCH http://localhost:3000/api/org-structure/position-templates/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "category": "Leadership"
}
```

```http
DELETE http://localhost:3000/api/org-structure/position-templates/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Position profile:

```http
GET http://localhost:3000/api/org-structure/position-profiles?positionTemplateId=1
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
POST http://localhost:3000/api/org-structure/position-profiles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "positionTemplateId": 1,
  "label": "API Test Position Profile",
  "rankId": 1,
  "rankLevelId": 1,
  "progressionMode": "STANDARD",
  "defaultSalaryGradeId": 1
}
```

```http
PATCH http://localhost:3000/api/org-structure/position-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "progressionMode": "STEP"
}
```

```http
DELETE http://localhost:3000/api/org-structure/position-profiles/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Position sub-level:

```http
GET http://localhost:3000/api/org-structure/position-sub-levels?positionProfileId=1
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
POST http://localhost:3000/api/org-structure/position-sub-levels
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "positionProfileId": 1,
  "name": "API Step 1",
  "sortOrder": 99,
  "salaryGradeId": 1
}
```

```http
PATCH http://localhost:3000/api/org-structure/position-sub-levels/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated API Step"
}
```

```http
DELETE http://localhost:3000/api/org-structure/position-sub-levels/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- template/profile/sub-level deletes fail if child or position records use them
- profile can point to rank, rank level, and default salary grade
- sub-level can point to salary grade

### 10.10 Position Tests

List/get:

```http
GET http://localhost:3000/api/org-structure/positions?orgUnitId=1&search=Manager
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/positions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "orgUnitId": 1,
  "positionProfileId": 1,
  "positionSubLevelId": 1,
  "salaryGradeId": 1,
  "salaryGradeStepId": 1,
  "title": "API Test Position",
  "employmentStatus": "ACTIVE",
  "defaultBasePay": 30000,
  "plannedHeadcount": 1,
  "fte": 1
}
```

Edit or move to another org unit:

```http
PATCH http://localhost:3000/api/org-structure/positions/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "orgUnitId": 2,
  "title": "Updated API Position"
}
```

Set supervisor:

```http
PATCH http://localhost:3000/api/org-structure/positions/2/supervisor
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "supervisorPositionId": 1
}
```

Clear supervisor:

```http
PATCH http://localhost:3000/api/org-structure/positions/2/supervisor
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "supervisorPositionId": null
}
```

Assign unit head:

```http
PATCH http://localhost:3000/api/org-structure/org-units/1/head-position
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "headPositionId": 1
}
```

Headcount/vacancy summary:

```http
GET http://localhost:3000/api/org-structure/positions/headcount-summary?orgUnitId=1&date=2026-01-01
Authorization: Bearer SUPERADMIN_TOKEN
```

Delete:

```http
DELETE http://localhost:3000/api/org-structure/positions/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- supervisor cannot be the same position
- supervisor update rejects reporting cycles
- unit head position must belong to the org unit it heads
- delete fails if assignments, subordinate positions, unit-head links, or approval rules still reference the position

### 10.11 Position Assignment Tests

List/get:

```http
GET http://localhost:3000/api/org-structure/position-assignments?employeeId=1
Authorization: Bearer SUPERADMIN_TOKEN
```

```http
GET http://localhost:3000/api/org-structure/position-assignments?positionId=1&assignmentType=PRIMARY
Authorization: Bearer SUPERADMIN_TOKEN
```

Create:

```http
POST http://localhost:3000/api/org-structure/position-assignments
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "positionId": 1,
  "employeeId": 1,
  "startDate": "2026-01-01T00:00:00.000Z",
  "assignmentType": "PRIMARY",
  "fte": 1
}
```

Update with optimistic version:

```http
PATCH http://localhost:3000/api/org-structure/position-assignments/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "version": 1,
  "assignmentType": "CONCURRENT",
  "fte": 0.5
}
```

End assignment:

```http
POST http://localhost:3000/api/org-structure/position-assignments/1/end
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

Expected:

- overlapping assignment FTE cannot exceed position capacity
- stale `version` returns `409 Conflict`
- end date before start date returns `400`

### 10.12 Salary Grade APIs Used By Org Structure

Create/update/delete salary grade:

```http
POST http://localhost:3000/api/pay-structure/salary-grades
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-SG",
  "name": "API Salary Grade",
  "rateType": "MONTHLY",
  "minSalary": 30000,
  "maxSalary": 60000,
  "currency": "PHP",
  "status": "ACTIVE"
}
```

```http
PATCH http://localhost:3000/api/pay-structure/salary-grades/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "maxSalary": 65000
}
```

```http
DELETE http://localhost:3000/api/pay-structure/salary-grades/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Create/update/delete salary grade step:

```http
POST http://localhost:3000/api/pay-structure/salary-grade-steps
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "salaryGradeId": 1,
  "stepNumber": 99,
  "name": "API Step",
  "amount": 35000
}
```

```http
PATCH http://localhost:3000/api/pay-structure/salary-grade-steps/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "amount": 36000
}
```

```http
DELETE http://localhost:3000/api/pay-structure/salary-grade-steps/99
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- deleting a salary grade with references deactivates it instead of breaking linked org records
- deleting a salary grade step fails while positions use it

### 10.13 Rank Terminology Setting

Read:

```http
GET http://localhost:3000/api/system-settings/rank-terminology
Authorization: Bearer SUPERADMIN_TOKEN
```

Update:

```http
PATCH http://localhost:3000/api/system-settings/rank-terminology
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "rankLabel": "Job Band",
  "rankLevelLabel": "Band Level",
  "positionSubLevelLabel": "Step"
}
```

Expected:

- read returns defaults when no setting exists
- update stores labels in `SystemSetting`
- non-string labels return `400`

### 10.14 Org Structure Negative Tests

Missing permission:

```http
POST http://localhost:3000/api/org-structure/ranks
Authorization: Bearer EMPLOYEE_TOKEN
Content-Type: application/json

{
  "name": "Should Fail",
  "sortOrder": 1000,
  "mode": "STANDARD"
}
```

Expected: `403 Forbidden`.

Missing token:

```http
GET http://localhost:3000/api/org-structure/org-units
```

Expected: `401 Unauthorized`.

Bad move:

```http
POST http://localhost:3000/api/org-structure/org-units/1/move
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "parentOrgUnitId": 1
}
```

Expected: `400 Bad Request`.

Blocked generic mutation:

```http
POST http://localhost:3000/api/org-structure/org-unit-closures
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "ancestorOrgUnitId": 1,
  "descendantOrgUnitId": 1,
  "depth": 0
}
```

Expected: `405 Method Not Allowed`.

---

## 11. Personnel APIs

Use Superadmin first. Use Employee later for self-service scope tests.

### Read APIs

```http
GET /api/personnel/employees
GET /api/personnel/employees/:id
GET /api/personnel/employments
GET /api/personnel/employments/:id
GET /api/personnel/employee-profiles
GET /api/personnel/employee-profiles/:id
GET /api/personnel/education-records
GET /api/personnel/education-records/:id
GET /api/personnel/exam-records
GET /api/personnel/exam-records/:id
GET /api/personnel/employment-history-records
GET /api/personnel/employment-history-records/:id
GET /api/personnel/reference-contacts
GET /api/personnel/reference-contacts/:id
GET /api/personnel/family-members
GET /api/personnel/family-members/:id
GET /api/personnel/emergency-contacts
GET /api/personnel/emergency-contacts/:id
GET /api/personnel/pis-tabs
GET /api/personnel/pis-tabs/:id
GET /api/personnel/pis-fields
GET /api/personnel/pis-fields/:id
GET /api/personnel/pis-field-options
GET /api/personnel/pis-field-options/:id
GET /api/personnel/pis-field-policies
GET /api/personnel/pis-field-policies/:id
GET /api/personnel/employee-field-values
GET /api/personnel/employee-field-values/:id
GET /api/personnel/employee-field-value-histories
GET /api/personnel/employee-field-value-histories/:id
GET /api/personnel/employee-onboarding-records
GET /api/personnel/employee-onboarding-records/:id
GET /api/personnel/employee-offboarding-records
GET /api/personnel/employee-offboarding-records/:id
GET /api/personnel/employee-loa-records
GET /api/personnel/employee-loa-records/:id
GET /api/personnel/paf-records
GET /api/personnel/paf-records/:id
GET /api/employees/:employeeId/paf-records
GET /api/me/paf-records
GET /api/personnel/employee-profile-histories
GET /api/personnel/employee-profile-histories/:id
```

Example:

```http
GET http://localhost:3000/api/personnel/employees?page=1&limit=10
Authorization: Bearer SUPERADMIN_TOKEN
```

### Write APIs

Create employee:

```http
POST http://localhost:3000/api/personnel/employees
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "employeeNumber": "API-EMP-001",
  "firstName": "Api",
  "lastName": "Tester",
  "displayName": "Api Tester",
  "email": "api.tester@diwalearning.local",
  "status": "Active",
  "jobType": "Regular"
}
```

Update employee:

```http
PATCH http://localhost:3000/api/personnel/employees/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "phone": "09170000000",
  "roleTitle": "Updated API Role"
}
```

Update employee profile:

```http
PATCH http://localhost:3000/api/personnel/employees/1/profile
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "civilStatus": "Single",
  "residentialAddress": "Local test address",
  "bankName": "Local Test Bank"
}
```

Update employee PIS field value:

```http
PATCH http://localhost:3000/api/personnel/employees/1/field-values/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "valueJson": "Updated local test value",
  "changeReason": "API testing"
}
```

Create employment record:

```http
POST http://localhost:3000/api/personnel/employees/1/employments
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "Active",
  "jobType": "Regular",
  "startDate": "2026-01-01T00:00:00.000Z",
  "remarks": "API test employment"
}
```

Create education record:

```http
POST http://localhost:3000/api/personnel/employees/1/education-records
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "attainment": "College",
  "course": "BS Information Technology",
  "school": "API Test University"
}
```

Create exam record:

```http
POST http://localhost:3000/api/personnel/employees/1/exam-records
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Exam",
  "rating": "Passed"
}
```

Create family member:

```http
POST http://localhost:3000/api/personnel/employees/1/family-members
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "relationship": "Sibling",
  "firstName": "Test",
  "lastName": "Sibling"
}
```

Create emergency contact:

```http
POST http://localhost:3000/api/personnel/employees/1/emergency-contacts
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "relationship": "Parent",
  "firstName": "Test",
  "lastName": "Contact",
  "contactNo": "09171111111"
}
```

Create reference contact:

```http
POST http://localhost:3000/api/personnel/employees/1/reference-contacts
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "firstName": "Reference",
  "lastName": "Person",
  "business": "API Test Company"
}
```

Create PIS field:

```http
POST http://localhost:3000/api/personnel/employees/pis-fields
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "pisTabId": 1,
  "code": "API_TEST_FIELD",
  "label": "API Test Field",
  "dataType": "text",
  "isSensitive": false
}
```

Update child records:

```http
PATCH /api/personnel/employees/employments/:recordId
PATCH /api/personnel/employees/education-records/:recordId
PATCH /api/personnel/employees/exam-records/:recordId
PATCH /api/personnel/employees/family-members/:recordId
PATCH /api/personnel/employees/emergency-contacts/:recordId
PATCH /api/personnel/employees/reference-contacts/:recordId
PATCH /api/personnel/employees/pis-fields/:fieldId
```

### PAF APIs

Use Superadmin for manage actions. Use Employee Self Service only for `/api/me/paf-records` and employee-scoped read checks.

Endpoint checklist:

```http
POST   /api/personnel/paf-records
GET    /api/personnel/paf-records
GET    /api/personnel/paf-records/:id
PATCH  /api/personnel/paf-records/:id
DELETE /api/personnel/paf-records/:id

GET    /api/employees/:employeeId/paf-records
GET    /api/me/paf-records
GET    /api/personnel/paf-records?employeeId=&actionType=&status=&effectiveFrom=&effectiveTo=

POST   /api/personnel/paf-records/:id/submit
POST   /api/personnel/paf-records/:id/cancel
POST   /api/approvals/approval-requests/:id/actions
POST   /api/personnel/paf-records/:id/verify
POST   /api/personnel/paf-records/:id/apply

PATCH  /api/personnel/paf-records/:id/approval-setup
POST   /api/personnel/paf-records/:id/approval-request
GET    /api/personnel/paf-records/:id/approval-trail

GET    /api/personnel/paf-records/:id/payload
PATCH  /api/personnel/paf-records/:id/payload
POST   /api/personnel/paf-records/validate

GET    /api/personnel/paf-records/:id/profile-histories
GET    /api/personnel/paf-records/:id/loa-records
POST   /api/personnel/paf-records/:id/profile-history
POST   /api/personnel/paf-records/:id/loa-record

GET    /api/personnel/paf-records/:id/print
GET    /api/personnel/paf-records/:id/pdf
```

Create a draft PAF:

```http
POST http://localhost:3000/api/personnel/paf-records
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "employeeId": 1,
  "approvalSetupId": 1,
  "actionType": "Department Transfer",
  "effectiveDate": "2027-06-01T00:00:00.000Z",
  "payloadJson": {
    "fromOrgUnitId": 1,
    "toOrgUnitId": 2,
    "proposedPositionId": 1,
    "reason": "Move to operations support"
  },
  "status": "DRAFT"
}
```

Expected: `201`, status `DRAFT`, projected PAF record, and audit event `PAF_RECORD_CREATED`.

List, search, date-filter, get, and employee-scope reads:

```http
GET http://localhost:3000/api/personnel/paf-records?search=Transfer&employeeId=1&actionType=Department%20Transfer&status=DRAFT&effectiveFrom=2027-01-01&effectiveTo=2027-12-31
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/personnel/paf-records/1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/employees/1/paf-records
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/me/paf-records
Authorization: Bearer EMPLOYEE_SELF_SERVICE_TOKEN
```

Expected: employee self-service returns only the signed-in employee's PAF records; asking for another employee through `/api/employees/:employeeId/paf-records` returns `403`.

Validate and update payload:

```http
POST http://localhost:3000/api/personnel/paf-records/validate
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "actionType": "Department Transfer",
  "payloadJson": {
    "toOrgUnitId": 2,
    "reason": "Move to operations support"
  }
}
```

```http
GET http://localhost:3000/api/personnel/paf-records/1/payload
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/personnel/paf-records/1/payload
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "payloadJson": {
    "fromOrgUnitId": 1,
    "toOrgUnitId": 3,
    "proposedSupervisorPositionId": 5,
    "remarks": "Updated during API testing"
  }
}
```

Expected: validation returns `valid: true` for known action types with required payload fields. Payload updates are blocked after the PAF is applied or cancelled.

Update normal PAF fields:

```http
PATCH http://localhost:3000/api/personnel/paf-records/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "effectiveDate": "2027-06-15T00:00:00.000Z",
  "payloadJson": {
    "fromOrgUnitId": 1,
    "toOrgUnitId": 3,
    "reason": "Updated department target"
  }
}
```

Link or create approval request:

```http
PATCH http://localhost:3000/api/personnel/paf-records/1/approval-setup
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "approvalSetupId": 1
}

POST http://localhost:3000/api/personnel/paf-records/1/approval-request
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "approvalSetupId": 1
}
```

Expected: the approval request uses `referenceType: "PAF_RECORD"` and `referenceId` equal to the PAF ID.

Submit, approve/reject, verify, and apply:

```http
POST http://localhost:3000/api/personnel/paf-records/1/submit
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/personnel/paf-records/1/approval-trail
Authorization: Bearer SUPERADMIN_TOKEN

POST http://localhost:3000/api/approvals/approval-requests/1/actions
Authorization: Bearer APPROVER_TOKEN
Content-Type: application/json

{
  "action": "approve",
  "comments": "Approved during API testing"
}

POST http://localhost:3000/api/personnel/paf-records/1/verify
Authorization: Bearer SUPERADMIN_TOKEN

POST http://localhost:3000/api/personnel/paf-records/1/apply
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: submit creates or submits the linked approval request and sets PAF status to `PENDING_APPROVAL`; approval actions advance the approval workflow; verify sets status `VERIFIED`; apply sets status `APPLIED` and fills `appliedAt`.

Cancel before apply:

```http
POST http://localhost:3000/api/personnel/paf-records/1/cancel
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: non-applied records become `CANCELLED`; pending linked approval workflows are cancelled.

Generate downstream profile history:

```http
POST http://localhost:3000/api/personnel/paf-records/1/profile-history
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "fields": [
    {
      "fieldName": "orgUnitId",
      "previousValue": "1",
      "newValue": "3",
      "changeReason": "Department transfer PAF"
    }
  ]
}

GET http://localhost:3000/api/personnel/paf-records/1/profile-histories
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: profile history rows link back through `pafRecordId`.

Generate downstream LOA record for leave/LOA PAFs:

```http
POST http://localhost:3000/api/personnel/paf-records/1/loa-record
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "loaType": "MEDICAL_LEAVE",
  "startDate": "2027-06-01T00:00:00.000Z",
  "expectedReturnDate": "2027-06-15T00:00:00.000Z",
  "notes": "Generated from PAF API test"
}

GET http://localhost:3000/api/personnel/paf-records/1/loa-records
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: LOA record links back through `pafRecordId`.

Print and PDF:

```http
GET http://localhost:3000/api/personnel/paf-records/1/print
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/personnel/paf-records/1/pdf
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: `/print` returns a printable HTML representation. `/pdf` returns a simple generated PDF document for API coverage; replace this with a formal report renderer if official government/company formatting is required.

Negative tests:

```http
POST http://localhost:3000/api/personnel/paf-records/validate
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "actionType": "Department Transfer",
  "payloadJson": {
    "reason": "Missing target org unit"
  }
}
```

Expected: `valid: false` with an error requiring `toOrgUnitId` or `proposedOrgUnitId`.

```http
PATCH http://localhost:3000/api/personnel/paf-records/1/payload
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "payloadJson": "not an object"
}
```

Expected: `400`.

```http
POST http://localhost:3000/api/personnel/paf-records/1/apply
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: `400` when the PAF is not approved or verified.

### Employee Self-Service Test

Login as:

```text
lance.robredo@diwalearning.local
```

Then test:

```http
GET http://localhost:3000/api/personnel/employees
Authorization: Bearer EMPLOYEE_TOKEN
```

Expected:

- employee sees only their own employee record
- employee cannot read another employee by ID
- sensitive fields stay masked unless permission allows them

---

## 12. Pay Structure APIs

Use Superadmin unless the test explicitly says to use Employee Self Service.

All list endpoints support the shared paging/sorting contract:

```http
GET http://localhost:3000/api/pay-structure/formulas?page=1&pageSize=20&sortBy=id&sortOrder=desc
Authorization: Bearer SUPERADMIN_TOKEN
```

Search and filter examples:

```http
GET /api/pay-structure/formulas?search=allowance&status=ACTIVE
GET /api/pay-structure/formula-versions?formulaId=1&current=true
GET /api/pay-structure/earning-components?search=basic&category=BASE&valueSource=FORMULA
GET /api/pay-structure/earning-template-families?templateKind=STANDARD&status=ACTIVE
GET /api/pay-structure/earning-template-family-scopes?earningTemplateFamilyId=1&primary=true
GET /api/pay-structure/earning-template-revisions?earningTemplateFamilyId=1&current=true
GET /api/pay-structure/earning-template-revision-lines?earningTemplateRevisionId=1
GET /api/pay-structure/employee-pay-profiles?employeeId=1&status=ACTIVE
GET /api/pay-structure/salary-grades?search=manager&rateType=MONTHLY&status=ACTIVE
GET /api/pay-structure/salary-grade-steps?salaryGradeId=1&stepNumber=1
```

### Endpoint Checklist

```http
POST   /api/pay-structure/formulas
GET    /api/pay-structure/formulas
GET    /api/pay-structure/formulas/:id
PATCH  /api/pay-structure/formulas/:id
PATCH  /api/pay-structure/formulas/:id/status
GET    /api/pay-structure/formulas/:id/as-of?date=YYYY-MM-DD

POST   /api/pay-structure/formula-versions
GET    /api/pay-structure/formula-versions
GET    /api/pay-structure/formula-versions/:id
POST   /api/pay-structure/formula-versions/:id/set-current

POST   /api/pay-structure/earning-components
GET    /api/pay-structure/earning-components
GET    /api/pay-structure/earning-components/:id
PATCH  /api/pay-structure/earning-components/:id
PATCH  /api/pay-structure/earning-components/:id/status
POST   /api/pay-structure/earning-components/:id/resolve

POST   /api/pay-structure/earning-template-families
GET    /api/pay-structure/earning-template-families
GET    /api/pay-structure/earning-template-families/:id
PATCH  /api/pay-structure/earning-template-families/:id
PATCH  /api/pay-structure/earning-template-families/:id/status
POST   /api/pay-structure/earning-template-families/:id/variants
GET    /api/pay-structure/earning-template-families/:id/current-revision

POST   /api/pay-structure/earning-template-family-scopes
GET    /api/pay-structure/earning-template-family-scopes
GET    /api/pay-structure/earning-template-family-scopes/:id
PATCH  /api/pay-structure/earning-template-family-scopes/:id
POST   /api/pay-structure/earning-template-family-scopes/:id/set-primary

POST   /api/pay-structure/earning-template-revisions
GET    /api/pay-structure/earning-template-revisions
GET    /api/pay-structure/earning-template-revisions/:id
POST   /api/pay-structure/earning-template-revisions/:id/set-current

POST   /api/pay-structure/earning-template-revision-lines
GET    /api/pay-structure/earning-template-revision-lines
GET    /api/pay-structure/earning-template-revision-lines/:id
PATCH  /api/pay-structure/earning-template-revision-lines/:id
DELETE /api/pay-structure/earning-template-revision-lines/:id
POST   /api/pay-structure/earning-template-revisions/:id/reorder-lines

POST   /api/pay-structure/employee-pay-profiles
GET    /api/pay-structure/employee-pay-profiles
GET    /api/pay-structure/employee-pay-profiles/:id
PATCH  /api/pay-structure/employee-pay-profiles/:id
PATCH  /api/pay-structure/employee-pay-profiles/:id/end
GET    /api/employees/:employeeId/pay-profile/current

POST   /api/pay-structure/salary-grades
GET    /api/pay-structure/salary-grades
GET    /api/pay-structure/salary-grades/:id
PATCH  /api/pay-structure/salary-grades/:id
PATCH  /api/pay-structure/salary-grades/:id/status
DELETE /api/pay-structure/salary-grades/:id

POST   /api/pay-structure/salary-grade-steps
GET    /api/pay-structure/salary-grade-steps
GET    /api/pay-structure/salary-grade-steps/:id
GET    /api/pay-structure/salary-grades/:id/steps
PATCH  /api/pay-structure/salary-grade-steps/:id
DELETE /api/pay-structure/salary-grade-steps/:id
```

### Formula Catalog and Versions

Create a formula:

```http
POST http://localhost:3000/api/pay-structure/formulas
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_FORMULA",
  "name": "API Test Formula",
  "expression": "basePay * 0.10",
  "description": "API test formula",
  "status": "ACTIVE"
}
```

Expected: `201`, projected formula response, audit event `PAY_FORMULA_CREATED`.

List, search, get, update, and deactivate/reactivate:

```http
GET http://localhost:3000/api/pay-structure/formulas?search=API_FORMULA&status=ACTIVE
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/formulas/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/formulas/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Formula Updated",
  "expression": "basePay * 0.12"
}

PATCH http://localhost:3000/api/pay-structure/formulas/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

Create formula versions:

```http
POST http://localhost:3000/api/pay-structure/formula-versions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "formulaId": 1,
  "versionNo": "api-v1",
  "expression": "basePay * 0.10",
  "effectiveStartDate": "2026-01-01T00:00:00.000Z",
  "effectiveEndDate": "2026-12-31T00:00:00.000Z",
  "isCurrent": true,
  "changeSummary": "Initial API test version"
}
```

```http
POST http://localhost:3000/api/pay-structure/formula-versions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "formulaId": 1,
  "versionNo": "api-v2",
  "expression": "basePay * 0.12",
  "effectiveStartDate": "2027-01-01T00:00:00.000Z",
  "isCurrent": true,
  "changeSummary": "Supersedes API v1"
}
```

Expected: the new current version clears `isCurrent` from the previous current version for the same formula.

Read versions and set current:

```http
GET http://localhost:3000/api/pay-structure/formula-versions?formulaId=1&current=true
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/formula-versions/1
Authorization: Bearer SUPERADMIN_TOKEN

POST http://localhost:3000/api/pay-structure/formula-versions/1/set-current
Authorization: Bearer SUPERADMIN_TOKEN
```

Get formula by effective date:

```http
GET http://localhost:3000/api/pay-structure/formulas/1/as-of?date=2026-06-01
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: response contains `formula`, matching `version`, and `asOf`.

### Earning Components

Create fixed and formula-backed components:

```http
POST http://localhost:3000/api/pay-structure/earning-components
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_FIXED_ALLOWANCE",
  "name": "API Fixed Allowance",
  "category": "ALLOWANCE",
  "valueSource": "FIXED",
  "fixedAmount": 1000,
  "isTaxableDefault": true,
  "includeIn13thMonthDefault": false,
  "status": "ACTIVE",
  "description": "Fixed allowance for API testing"
}
```

```http
POST http://localhost:3000/api/pay-structure/earning-components
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_FORMULA_ALLOWANCE",
  "name": "API Formula Allowance",
  "category": "ALLOWANCE",
  "valueSource": "FORMULA",
  "formulaVersionId": 2,
  "status": "ACTIVE"
}
```

List, get, update, and change status:

```http
GET http://localhost:3000/api/pay-structure/earning-components?search=API&category=ALLOWANCE&status=ACTIVE
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-components/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/earning-components/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "fixedAmount": 1250,
  "description": "Updated during API testing"
}

PATCH http://localhost:3000/api/pay-structure/earning-components/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

Resolve component amounts:

```http
POST http://localhost:3000/api/pay-structure/earning-components/1/resolve
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "variables": {
    "basePay": 50000
  }
}
```

Expected for fixed components: returns `amount` from `fixedAmount`. Expected for formula-backed components: evaluates arithmetic expressions using numeric variables. If `lookupTableVersionId` is set, expect `400` until lookup table schema/services are added.

### Earning Template Families and Scopes

Create a template family:

```http
POST http://localhost:3000/api/pay-structure/earning-template-families
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_TEMPLATE",
  "name": "API Monthly Template",
  "templateKind": "STANDARD",
  "showInDefaultPicker": true,
  "payBasisApplicability": "MONTHLY",
  "status": "ACTIVE",
  "description": "Template created by API testing"
}
```

List, get, update, deactivate/reactivate, and create a variant:

```http
GET http://localhost:3000/api/pay-structure/earning-template-families?search=API_TEMPLATE&status=ACTIVE
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-template-families/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/earning-template-families/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "description": "Updated template description"
}

PATCH http://localhost:3000/api/pay-structure/earning-template-families/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "INACTIVE"
}

POST http://localhost:3000/api/pay-structure/earning-template-families/1/variants
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_TEMPLATE_VARIANT",
  "name": "API Monthly Template Variant",
  "payBasisApplicability": "MONTHLY",
  "description": "Child variant of API_TEMPLATE"
}
```

Create and manage scopes:

```http
POST http://localhost:3000/api/pay-structure/earning-template-family-scopes
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateFamilyId": 1,
  "scopeType": "ORG_UNIT",
  "scopeRefId": 1,
  "isPrimary": true,
  "notes": "Primary scope for API testing"
}
```

```http
GET http://localhost:3000/api/pay-structure/earning-template-family-scopes?earningTemplateFamilyId=1&primary=true
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-template-family-scopes/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/earning-template-family-scopes/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "notes": "Updated API scope note"
}

POST http://localhost:3000/api/pay-structure/earning-template-family-scopes/1/set-primary
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: setting one scope primary clears other primary scopes for the same template family.

### Template Revisions and Lines

Create two revisions:

```http
POST http://localhost:3000/api/pay-structure/earning-template-revisions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateFamilyId": 1,
  "versionNo": "api-v1",
  "currencyCode": "PHP",
  "effectiveStartDate": "2026-01-01T00:00:00.000Z",
  "effectiveEndDate": "2026-12-31T00:00:00.000Z",
  "isCurrent": true,
  "changeSummary": "Initial API template revision"
}
```

```http
POST http://localhost:3000/api/pay-structure/earning-template-revisions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateFamilyId": 1,
  "versionNo": "api-v2",
  "currencyCode": "PHP",
  "effectiveStartDate": "2027-01-01T00:00:00.000Z",
  "isCurrent": true,
  "changeSummary": "Second API template revision"
}
```

Read revisions and current revision:

```http
GET http://localhost:3000/api/pay-structure/earning-template-revisions?earningTemplateFamilyId=1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-template-revisions/1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-template-families/1/current-revision
Authorization: Bearer SUPERADMIN_TOKEN

POST http://localhost:3000/api/pay-structure/earning-template-revisions/1/set-current
Authorization: Bearer SUPERADMIN_TOKEN
```

Create, update, reorder, and remove lines:

```http
POST http://localhost:3000/api/pay-structure/earning-template-revision-lines
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateRevisionId": 1,
  "earningComponentId": 1,
  "sortOrder": 1,
  "isRequired": true
}
```

```http
GET http://localhost:3000/api/pay-structure/earning-template-revision-lines?earningTemplateRevisionId=1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/earning-template-revision-lines/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/earning-template-revision-lines/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "sortOrder": 2,
  "isRequired": false
}

POST http://localhost:3000/api/pay-structure/earning-template-revisions/1/reorder-lines
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "lines": [
    { "id": 1, "sortOrder": 1 },
    { "id": 2, "sortOrder": 2 }
  ]
}

DELETE http://localhost:3000/api/pay-structure/earning-template-revision-lines/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: reorder rejects line IDs that do not belong to the target revision.

### Employee Pay Profiles

Create, read, update, end, and get current profile:

```http
POST http://localhost:3000/api/pay-structure/employee-pay-profiles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "employeeId": 1,
  "earningTemplateFamilyId": 1,
  "payScheduleId": 1,
  "payBasis": "MONTHLY",
  "effectiveStartDate": "2027-01-01T00:00:00.000Z",
  "status": "ACTIVE",
  "notes": "Created during API testing"
}
```

```http
GET http://localhost:3000/api/pay-structure/employee-pay-profiles?employeeId=1&status=ACTIVE
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/employee-pay-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/employee-pay-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "notes": "Updated during API testing"
}

GET http://localhost:3000/api/employees/1/pay-profile/current?date=2027-06-01
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/employee-pay-profiles/1/end
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "effectiveEndDate": "2027-12-31T00:00:00.000Z",
  "status": "ENDED"
}
```

Employee self-read check:

```http
GET http://localhost:3000/api/employees/1/pay-profile/current?date=2027-06-01
Authorization: Bearer EMPLOYEE_SELF_SERVICE_TOKEN
```

Expected: succeeds only when the token belongs to employee `1`; otherwise expect `403`.

### Salary Grades and Steps

Create, read, update, status-change, and delete/deactivate salary grade:

```http
POST http://localhost:3000/api/pay-structure/salary-grades
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-SG",
  "name": "API Salary Grade",
  "rateType": "MONTHLY",
  "minSalary": 30000,
  "maxSalary": 60000,
  "currency": "PHP",
  "status": "ACTIVE"
}
```

```http
GET http://localhost:3000/api/pay-structure/salary-grades?search=API-SG&status=ACTIVE
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/salary-grades/1
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/salary-grades/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "maxSalary": 65000
}

PATCH http://localhost:3000/api/pay-structure/salary-grades/1/status
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "status": "INACTIVE"
}

DELETE http://localhost:3000/api/pay-structure/salary-grades/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: delete hard-deletes unused grades; if referenced, it returns `deleted: false` and status `INACTIVE`.

Create and test salary grade steps:

```http
POST http://localhost:3000/api/pay-structure/salary-grade-steps
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "salaryGradeId": 1,
  "stepNumber": 1,
  "name": "API Step 1",
  "amount": 35000
}
```

```http
GET http://localhost:3000/api/pay-structure/salary-grade-steps?salaryGradeId=1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/salary-grade-steps/1
Authorization: Bearer SUPERADMIN_TOKEN

GET http://localhost:3000/api/pay-structure/salary-grades/1/steps
Authorization: Bearer SUPERADMIN_TOKEN

PATCH http://localhost:3000/api/pay-structure/salary-grade-steps/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "amount": 36000
}

DELETE http://localhost:3000/api/pay-structure/salary-grade-steps/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected: step delete returns `400` if the step is already used by a position.

### Negative Tests

```http
POST http://localhost:3000/api/pay-structure/formula-versions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "formulaId": 1,
  "versionNo": "bad-date",
  "expression": "basePay",
  "effectiveStartDate": "2027-01-01T00:00:00.000Z",
  "effectiveEndDate": "2026-01-01T00:00:00.000Z"
}
```

Expected: `400` because the end date is before the start date.

```http
POST http://localhost:3000/api/pay-structure/earning-components/999999/resolve
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "variables": {
    "basePay": 50000
  }
}
```

Expected: `404`.

```http
POST http://localhost:3000/api/pay-structure/earning-template-revisions/1/reorder-lines
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "lines": []
}
```

Expected: `400` because `lines` must be a non-empty array.

```http
GET http://localhost:3000/api/pay-structure/formulas
Authorization: Bearer EMPLOYEE_SELF_SERVICE_TOKEN
```

Expected: `403` unless the token has pay-structure read permission.

---

## 13. Approval APIs

Use Superadmin for setup and request creation. Use Approver to approve/reject.

### Read APIs

```http
GET /api/approvals/approval-setups
GET /api/approvals/approval-setups/:id
GET /api/approvals/approver-sequences
GET /api/approvals/approver-sequences/:id
GET /api/approvals/approval-sequence-secondary-approvers
GET /api/approvals/approval-sequence-secondary-approvers/:id
GET /api/approvals/approval-delegations
GET /api/approvals/approval-delegations/:id
GET /api/approvals/workflow-assignments
GET /api/approvals/workflow-assignments/:id
GET /api/approvals/approval-requests
GET /api/approvals/approval-requests/:id
GET /api/approvals/approval-workflows
GET /api/approvals/approval-workflows/:id
GET /api/approvals/approval-workflow-notes
GET /api/approvals/approval-workflow-notes/:id
```

### Approval Admin Writes

Create approval setup:

```http
POST http://localhost:3000/api/approvals/approval-setups
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_APPROVAL",
  "name": "API Approval Setup",
  "moduleKey": "personnel",
  "actionType": "API_TEST"
}
```

Create approver sequence:

```http
POST http://localhost:3000/api/approvals/approver-sequences
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "approvalSetupId": 1,
  "stepNo": 99,
  "name": "API Approver Step",
  "approverType": "USER",
  "approverUserId": 3,
  "requiredApprovals": 1
}
```

Important: use only one approver source:

- `approverUserId`, or
- `approverRoleId`, or
- `approverPositionId`

Create approval delegation:

```http
POST http://localhost:3000/api/approvals/approval-delegations
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "fromUserId": 3,
  "toUserId": 1,
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-12-31T00:00:00.000Z",
  "reason": "API test delegation"
}
```

Create workflow assignment:

```http
POST http://localhost:3000/api/approvals/workflow-assignments
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "scopeType": "GLOBAL",
  "approvalSetupId": 1,
  "priority": 99,
  "isActive": true
}
```

Add workflow note:

```http
POST http://localhost:3000/api/approvals/approval-workflow-notes
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "approvalWorkflowId": 1,
  "noteType": "COMMENT",
  "note": "API test note"
}
```

### Approval Request Workflow

Create approval request:

```http
POST http://localhost:3000/api/approvals/approval-requests
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "approvalSetupId": 1,
  "employeeId": 1,
  "referenceType": "EmployeeProfile",
  "referenceId": 1,
  "payloadJson": {
    "reason": "Local API testing"
  }
}
```

Copy the returned approval request `id`.

Submit:

```http
POST http://localhost:3000/api/approvals/approval-requests/REQUEST_ID/submit
Authorization: Bearer SUPERADMIN_TOKEN
```

Approve:

```http
POST http://localhost:3000/api/approvals/approval-requests/REQUEST_ID/approve
Authorization: Bearer APPROVER_TOKEN
Content-Type: application/json

{
  "comments": "Approved during API testing"
}
```

Reject:

```http
POST http://localhost:3000/api/approvals/approval-requests/REQUEST_ID/reject
Authorization: Bearer APPROVER_TOKEN
Content-Type: application/json

{
  "comments": "Rejected during API testing"
}
```

Cancel:

```http
POST http://localhost:3000/api/approvals/approval-requests/REQUEST_ID/cancel
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- draft request can be submitted
- pending request can be approved/rejected by assigned approver or valid delegate
- approved/rejected request cannot be acted on again
- unauthorized approver gets `403`

---

## 14. RBAC APIs

Use Superadmin.

### Read APIs

```http
GET /api/rbac/users
GET /api/rbac/users/:id
GET /api/rbac/user-sessions
GET /api/rbac/user-sessions/:id
GET /api/rbac/roles
GET /api/rbac/roles/:id
GET /api/rbac/user-role-assignments
GET /api/rbac/user-role-assignments/:id
GET /api/rbac/permissions
GET /api/rbac/permissions/:id
GET /api/rbac/system-modules
GET /api/rbac/system-modules/:id
GET /api/rbac/permission-module-configs
GET /api/rbac/permission-module-configs/:id
GET /api/rbac/permission-module-config-scopes
GET /api/rbac/permission-module-config-scopes/:id
GET /api/rbac/permission-module-config-actions
GET /api/rbac/permission-module-config-actions/:id
GET /api/rbac/permission-module-config-states
GET /api/rbac/permission-module-config-states/:id
GET /api/rbac/role-permission-assignments
GET /api/rbac/role-permission-assignments/:id
```

### Write APIs

Create role:

```http
POST http://localhost:3000/api/rbac/roles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_ROLE",
  "name": "API Test Role",
  "description": "Created during API testing"
}
```

Update role:

```http
PATCH http://localhost:3000/api/rbac/roles/3
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "description": "Updated during API testing"
}
```

Create permission:

```http
POST http://localhost:3000/api/rbac/permissions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_PERMISSION",
  "name": "API Test Permission"
}
```

Create system module:

```http
POST http://localhost:3000/api/rbac/system-modules
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_MODULE",
  "name": "API Test Module",
  "sortOrder": 99
}
```

Assign role to user:

```http
POST http://localhost:3000/api/rbac/users/9/roles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "roleId": 3,
  "isPrimary": true
}
```

Revoke role from user:

```http
DELETE http://localhost:3000/api/rbac/users/9/roles/3
Authorization: Bearer SUPERADMIN_TOKEN
```

Assign permission to role:

```http
POST http://localhost:3000/api/rbac/roles/3/permissions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "permissionId": 1
}
```

Revoke permission from role:

```http
DELETE http://localhost:3000/api/rbac/roles/3/permissions/1
Authorization: Bearer SUPERADMIN_TOKEN
```

Revoke user session:

```http
POST http://localhost:3000/api/rbac/user-sessions/1/revoke
Authorization: Bearer SUPERADMIN_TOKEN
```

---

## 15. Generic Write Blocking

Some resources are still read/config only. Generic writes should return `405`.

Example:

```http
POST http://localhost:3000/api/personnel/pis-tabs
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "BLOCKED",
  "name": "Blocked Generic Write"
}
```

Expected:

```text
405 Method Not Allowed
```

This is correct. It means the backend is forcing important changes through explicit domain services.

---

## 16. Security Tests

### Missing token

```http
GET http://localhost:3000/api/personnel/employees
```

Expected:

```text
401 Unauthorized
```

### Invalid token

```http
GET http://localhost:3000/api/personnel/employees
Authorization: Bearer invalid-token
```

Expected:

```text
401 Unauthorized
```

### Wrong permission

Login as Employee and try:

```http
POST http://localhost:3000/api/rbac/roles
Authorization: Bearer EMPLOYEE_TOKEN
Content-Type: application/json

{
  "code": "SHOULD_FAIL",
  "name": "Should Fail"
}
```

Expected:

```text
403 Forbidden
```

### Sensitive field masking

Login as Approver and call:

```http
GET http://localhost:3000/api/personnel/employee-profiles
Authorization: Bearer APPROVER_TOKEN
```

Expected:

- sensitive fields such as `birthDate`, `residentialAddress`, government IDs, and bank account numbers should be `null` or omitted

Login as Superadmin and call the same endpoint:

```http
GET http://localhost:3000/api/personnel/employee-profiles
Authorization: Bearer SUPERADMIN_TOKEN
```

Expected:

- Superadmin may see sensitive fields because it has sensitive-read permission
- sensitive read should be audit logged

---

## 17. Recommended Full Test Order

Run automated checks:

```powershell
npm run build
npm run lint
npm run schema:check
npm run test
npm run test:integration
```

Then run manual API checks:

1. `GET /api/health`
2. Login as Superadmin
3. Read org structure resources
4. Create/update one org resource
5. Read personnel resources
6. Create/update one employee child record
7. Test sensitive field masking
8. Read pay structure resources
9. Create/update one pay resource
10. Create approval request
11. Submit approval request
12. Login as Approver
13. Approve or reject the request
14. Login as Employee
15. Confirm employee self-service only sees own records
16. Test missing token returns `401`
17. Test wrong permission returns `403`
18. Test blocked generic write returns `405`
19. Logout and confirm old token returns `401`

---

## 18. Quick Checklist

```text
[ ] npm run build passes
[ ] npm run lint passes
[ ] npm run schema:check passes
[ ] npm run test passes
[ ] npm run test:integration passes
[ ] npm run db:seed:dummy succeeds
[ ] GET /api/health returns 200
[ ] Superadmin can login
[ ] Superadmin can read all Phase 1 domains
[ ] Superadmin can create/update explicit domain resources
[ ] Approver can approve/reject assigned approval requests
[ ] Employee can only read own scoped records
[ ] Missing token returns 401
[ ] Wrong permission returns 403
[ ] Generic write fallback returns 405
[ ] Sensitive fields are masked for non-sensitive readers
[ ] Logout revokes the active session
```

---

## 19. Troubleshooting

### `401 Unauthorized`

Common causes:

- missing `Authorization` header
- token does not start with `Bearer`
- token is invalid
- token belongs to a logged-out/revoked session

Correct format:

```text
Authorization: Bearer YOUR_TOKEN_HERE
```

### `403 Forbidden`

You are logged in, but your account does not have the required permission.

Use Superadmin for admin/write tests:

```text
platform.admin@diwalearning.seed
DiwaPhase1!
```

### `404 Not Found`

Common causes:

- wrong URL
- missing `/api`
- ID does not exist
- employee self-service is hiding records outside the employee scope

### `405 Method Not Allowed`

This is expected for generic writes on resources without explicit business workflows.

### Unique constraint errors

You may be reusing a code that already exists, such as:

```text
API_ROLE
API_TEST_FIELD
API_FORMULA
```

Change the code to something new, for example:

```text
API_ROLE_002
```

### Date constraint errors

For effective-dated records:

```text
effectiveEndDate must be after effectiveStartDate
```

Fix the dates and try again.

### Approver sequence constraint error

Each approver sequence must use only one approver source:

```text
approverUserId OR approverRoleId OR approverPositionId
```

Do not send two of them in the same request.

### Seeded account login fails

Run:

```powershell
npm run db:seed:dummy
```

Then try again:

```text
platform.admin@diwalearning.seed
DiwaPhase1!
```

Make sure the backend is connected to the same database you seeded.
