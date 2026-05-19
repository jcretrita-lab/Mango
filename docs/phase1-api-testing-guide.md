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

Use Superadmin.

### Read APIs

```http
GET /api/org-structure/company-profiles
GET /api/org-structure/company-profiles/:id
GET /api/org-structure/hierarchy-levels
GET /api/org-structure/hierarchy-levels/:id
GET /api/org-structure/org-units
GET /api/org-structure/org-units/:id
GET /api/org-structure/org-unit-closures
GET /api/org-structure/org-unit-closures/:id
GET /api/org-structure/org-unit-versions
GET /api/org-structure/org-unit-versions/:id
GET /api/org-structure/sites
GET /api/org-structure/sites/:id
GET /api/org-structure/ranks
GET /api/org-structure/ranks/:id
GET /api/org-structure/rank-levels
GET /api/org-structure/rank-levels/:id
GET /api/org-structure/position-templates
GET /api/org-structure/position-templates/:id
GET /api/org-structure/position-profiles
GET /api/org-structure/position-profiles/:id
GET /api/org-structure/position-sub-levels
GET /api/org-structure/position-sub-levels/:id
GET /api/org-structure/positions
GET /api/org-structure/positions/:id
GET /api/org-structure/position-assignments
GET /api/org-structure/position-assignments/:id
```

Example:

```http
GET http://localhost:3000/api/org-structure/org-units?page=1&limit=10
Authorization: Bearer SUPERADMIN_TOKEN
```

### Write APIs Added

Create hierarchy level:

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

Update hierarchy level:

```http
PATCH http://localhost:3000/api/org-structure/hierarchy-levels/99
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "label": "Updated API Test Level"
}
```

Create site:

```http
POST http://localhost:3000/api/org-structure/sites
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-SITE",
  "name": "API Test Site",
  "city": "Quezon City",
  "region": "NCR",
  "countryCode": "PH"
}
```

Update site:

```http
PATCH http://localhost:3000/api/org-structure/sites/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Site Name"
}
```

Create org unit:

```http
POST http://localhost:3000/api/org-structure/org-units
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "parentOrgUnitId": 1,
  "hierarchyLevelId": 1,
  "code": "API-UNIT",
  "name": "API Test Unit"
}
```

Move org unit:

```http
POST http://localhost:3000/api/org-structure/org-units/2/move
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "parentOrgUnitId": 1
}
```

Create rank:

```http
POST http://localhost:3000/api/org-structure/ranks
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Rank",
  "sortOrder": 99,
  "mode": "STANDARD"
}
```

Create rank level:

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

Create position template:

```http
POST http://localhost:3000/api/org-structure/position-templates
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "API Test Position Template",
  "family": "Operations",
  "category": "Staff"
}
```

Create position profile:

```http
POST http://localhost:3000/api/org-structure/position-profiles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "positionTemplateId": 1,
  "label": "API Test Position Profile",
  "progressionMode": "STANDARD"
}
```

Create position:

```http
POST http://localhost:3000/api/org-structure/positions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "orgUnitId": 1,
  "positionProfileId": 1,
  "title": "API Test Position",
  "employmentStatus": "ACTIVE",
  "defaultBasePay": 30000,
  "fte": 1
}
```

Create position assignment:

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

End position assignment:

```http
POST http://localhost:3000/api/org-structure/position-assignments/1/end
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

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

Use Superadmin.

### Read APIs

```http
GET /api/pay-structure/salary-grades
GET /api/pay-structure/salary-grades/:id
GET /api/pay-structure/salary-grade-steps
GET /api/pay-structure/salary-grade-steps/:id
GET /api/pay-structure/earning-template-families
GET /api/pay-structure/earning-template-families/:id
GET /api/pay-structure/earning-template-family-scopes
GET /api/pay-structure/earning-template-family-scopes/:id
GET /api/pay-structure/earning-template-revisions
GET /api/pay-structure/earning-template-revisions/:id
GET /api/pay-structure/earning-template-revision-lines
GET /api/pay-structure/earning-template-revision-lines/:id
GET /api/pay-structure/earning-components
GET /api/pay-structure/earning-components/:id
GET /api/pay-structure/formulas
GET /api/pay-structure/formulas/:id
GET /api/pay-structure/formula-versions
GET /api/pay-structure/formula-versions/:id
GET /api/pay-structure/employee-pay-profiles
GET /api/pay-structure/employee-pay-profiles/:id
```

### Write APIs

Create salary grade:

```http
POST http://localhost:3000/api/pay-structure/salary-grades
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API-SG",
  "name": "API Salary Grade",
  "rateType": "MONTHLY",
  "minSalary": 30000,
  "maxSalary": 60000
}
```

Create salary grade step:

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

Create formula:

```http
POST http://localhost:3000/api/pay-structure/formulas
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_FORMULA",
  "name": "API Test Formula",
  "expression": "basePay * 0.10"
}
```

Create formula version:

```http
POST http://localhost:3000/api/pay-structure/formula-versions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "formulaId": 1,
  "versionNo": "api-v1",
  "expression": "basePay * 0.10",
  "effectiveStartDate": "2026-01-01T00:00:00.000Z",
  "isCurrent": true
}
```

Create earning component:

```http
POST http://localhost:3000/api/pay-structure/earning-components
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_ALLOWANCE",
  "name": "API Allowance",
  "category": "ALLOWANCE",
  "valueSource": "FIXED",
  "fixedAmount": 1000
}
```

Create earning template family:

```http
POST http://localhost:3000/api/pay-structure/earning-template-families
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "code": "API_TEMPLATE",
  "name": "API Template",
  "templateKind": "STANDARD",
  "payBasisApplicability": "MONTHLY"
}
```

Create earning template revision:

```http
POST http://localhost:3000/api/pay-structure/earning-template-revisions
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateFamilyId": 1,
  "versionNo": "api-v1",
  "effectiveStartDate": "2026-01-01T00:00:00.000Z",
  "isCurrent": true
}
```

Create earning template revision line:

```http
POST http://localhost:3000/api/pay-structure/earning-template-revision-lines
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "earningTemplateRevisionId": 1,
  "earningComponentId": 1,
  "sortOrder": 99,
  "isRequired": true
}
```

Create employee pay profile:

```http
POST http://localhost:3000/api/pay-structure/employee-pay-profiles
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "employeeId": 1,
  "earningTemplateFamilyId": 1,
  "payBasis": "Monthly",
  "effectiveStartDate": "2027-01-01T00:00:00.000Z",
  "status": "ACTIVE"
}
```

Update employee pay profile:

```http
PATCH http://localhost:3000/api/pay-structure/employee-pay-profiles/1
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "notes": "Updated during API testing"
}
```

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
