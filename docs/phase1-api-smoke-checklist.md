# Phase 1 API Smoke Checklist

This file is a practical QA checklist for verifying that the current Phase 1 APIs are reachable and returning sensible data.

Use this together with:

- [docs/phase1-api-inventory.md](/C:/Users/joshu/Documents/Diwa%20HRIS/docs/phase1-api-inventory.md)
- Swagger: `http://localhost:3000/api/docs`

## Assumptions

- Backend is running on `http://localhost:3000`
- Database is seeded
- You want a fast smoke pass first, then optional mutation checks

## Quick Start

Run the backend:

```bash
cd backend
bun run start:dev
```

Optional reseed before testing:

```bash
cd backend
bun run prisma:generate
bun run prisma:push
bun run db:seed
```

## Health Check

```bash
curl http://localhost:3000/api/health
```

Expected:

- HTTP `200`
- JSON with `ok: true`

QA:

- [ ] Pass
- Notes:

## Smoke Test Pattern

For each API below:

1. run the `GET` collection check
2. confirm HTTP `200`
3. confirm the response is a JSON array
4. confirm IDs and foreign keys look valid
5. compare with the code reference if something looks wrong

## Org Structure

Code reference:

- [backend/src/modules/org-structure/org-structure.module.ts](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/src/modules/org-structure/org-structure.module.ts)
- [backend/prisma/schema.prisma](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/prisma/schema.prisma)

### Company Profiles

```bash
curl http://localhost:3000/api/org-structure/company-profiles
```

Alias:

```bash
curl http://localhost:3000/api/org-structure/company-profile
```

Check:

- [ ] HTTP 200
- [ ] At least 1 company profile exists
- [ ] Employer registration fields are present

### Hierarchy Levels

```bash
curl http://localhost:3000/api/org-structure/hierarchy-levels
```

Check:

- [ ] HTTP 200
- [ ] Ordered hierarchy levels exist

### Org Units

```bash
curl http://localhost:3000/api/org-structure/org-units
```

Check:

- [ ] HTTP 200
- [ ] `hierarchyLevelId` values look valid
- [ ] Parent-child structure looks coherent

### Org Unit Closures

```bash
curl http://localhost:3000/api/org-structure/org-unit-closures
```

Alias:

```bash
curl http://localhost:3000/api/org-structure/org-unit-closure
```

Check:

- [ ] HTTP 200
- [ ] Depth `0` rows exist
- [ ] Ancestor/descendant pairs look consistent

### Org Unit Versions

```bash
curl http://localhost:3000/api/org-structure/org-unit-versions
```

Check:

- [ ] HTTP 200
- [ ] `orgUnitId` values exist in org units
- [ ] `isCurrent` rows are present

### Sites

```bash
curl http://localhost:3000/api/org-structure/sites
```

Check:

- [ ] HTTP 200
- [ ] Multiple enterprise sites exist

### Ranks

```bash
curl http://localhost:3000/api/org-structure/ranks
```

Check:

- [ ] HTTP 200
- [ ] Rank names and order values exist

### Rank Levels

```bash
curl http://localhost:3000/api/org-structure/rank-levels
```

Check:

- [ ] HTTP 200
- [ ] `rankId` values exist in ranks

### Position Templates

```bash
curl http://localhost:3000/api/org-structure/position-templates
```

Check:

- [ ] HTTP 200
- [ ] Reusable template rows exist

### Position Profiles

```bash
curl http://localhost:3000/api/org-structure/position-profiles
```

Check:

- [ ] HTTP 200
- [ ] Template/rank/grade references look valid

### Position Sub Levels

```bash
curl http://localhost:3000/api/org-structure/position-sub-levels
```

Check:

- [ ] HTTP 200
- [ ] `positionProfileId` values exist

### Positions

```bash
curl http://localhost:3000/api/org-structure/positions
```

Check:

- [ ] HTTP 200
- [ ] `orgUnitId` values exist
- [ ] `positionProfileId` values exist

### Position Assignments

```bash
curl http://localhost:3000/api/org-structure/position-assignments
```

Check:

- [ ] HTTP 200
- [ ] `positionId` values exist
- [ ] Employee assignments look realistic

## Pay Structure

Code reference:

- [backend/src/modules/pay-structure/pay-structure.module.ts](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/src/modules/pay-structure/pay-structure.module.ts)
- [backend/prisma/schema.prisma](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/prisma/schema.prisma)

### Salary Grades

```bash
curl http://localhost:3000/api/pay-structure/salary-grades
```

Check:

- [ ] HTTP 200
- [ ] Salary grades are under pay structure

### Salary Grade Steps

```bash
curl http://localhost:3000/api/pay-structure/salary-grade-steps
```

Check:

- [ ] HTTP 200
- [ ] `salaryGradeId` values exist

### Earning Template Families

```bash
curl http://localhost:3000/api/pay-structure/earning-template-families
```

Check:

- [ ] HTTP 200
- [ ] Enterprise package families exist

### Earning Template Family Scopes

```bash
curl http://localhost:3000/api/pay-structure/earning-template-family-scopes
```

Check:

- [ ] HTTP 200
- [ ] `earningTemplateFamilyId` values exist

### Earning Template Revisions

```bash
curl http://localhost:3000/api/pay-structure/earning-template-revisions
```

Check:

- [ ] HTTP 200
- [ ] Revision rows exist

### Earning Template Revision Lines

```bash
curl http://localhost:3000/api/pay-structure/earning-template-revision-lines
```

Check:

- [ ] HTTP 200
- [ ] Revision-to-component rows exist

### Earning Components

```bash
curl http://localhost:3000/api/pay-structure/earning-components
```

Check:

- [ ] HTTP 200
- [ ] Components contain realistic pay definitions

### Formulas

```bash
curl http://localhost:3000/api/pay-structure/formulas
```

Check:

- [ ] HTTP 200
- [ ] Formula rows exist

### Formula Versions

```bash
curl http://localhost:3000/api/pay-structure/formula-versions
```

Check:

- [ ] HTTP 200
- [ ] `formulaId` values exist

### Employee Pay Profiles

```bash
curl http://localhost:3000/api/pay-structure/employee-pay-profiles
```

Check:

- [ ] HTTP 200
- [ ] `employeeId` values exist
- [ ] `earningTemplateFamilyId` values exist

## Personnel / PIS

Code reference:

- [backend/src/modules/personnel/personnel.module.ts](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/src/modules/personnel/personnel.module.ts)
- [backend/prisma/schema.prisma](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/prisma/schema.prisma)

### Employees

```bash
curl http://localhost:3000/api/personnel/employees
```

Check:

- [ ] HTTP 200
- [ ] Enterprise employee rows exist

### Employments

```bash
curl http://localhost:3000/api/personnel/employments
```

Check:

- [ ] HTTP 200
- [ ] `employeeId` values exist

### Employee Profiles

```bash
curl http://localhost:3000/api/personnel/employee-profiles
```

Check:

- [ ] HTTP 200
- [ ] Profile rows map to employees

### Education Records

```bash
curl http://localhost:3000/api/personnel/education-records
```

Check:

- [ ] HTTP 200
- [ ] `employeeId` values exist

### Exam Records

```bash
curl http://localhost:3000/api/personnel/exam-records
```

Check:

- [ ] HTTP 200
- [ ] `employeeId` values exist

### Employment History Records

```bash
curl http://localhost:3000/api/personnel/employment-history-records
```

Check:

- [ ] HTTP 200

### Reference Contacts

```bash
curl http://localhost:3000/api/personnel/reference-contacts
```

Check:

- [ ] HTTP 200

### Family Members

```bash
curl http://localhost:3000/api/personnel/family-members
```

Check:

- [ ] HTTP 200

### Emergency Contacts

```bash
curl http://localhost:3000/api/personnel/emergency-contacts
```

Check:

- [ ] HTTP 200

### PIS Tabs

```bash
curl http://localhost:3000/api/personnel/pis-tabs
```

Check:

- [ ] HTTP 200

### PIS Fields

```bash
curl http://localhost:3000/api/personnel/pis-fields
```

Check:

- [ ] HTTP 200
- [ ] `pisTabId` values exist

### PIS Field Options

```bash
curl http://localhost:3000/api/personnel/pis-field-options
```

Check:

- [ ] HTTP 200

### PIS Field Policies

```bash
curl http://localhost:3000/api/personnel/pis-field-policies
```

Check:

- [ ] HTTP 200

### Employee Field Values

```bash
curl http://localhost:3000/api/personnel/employee-field-values
```

Check:

- [ ] HTTP 200
- [ ] `employeeId` and `pisFieldId` values exist

### Employee Field Value Histories

```bash
curl http://localhost:3000/api/personnel/employee-field-value-histories
```

Alias:

```bash
curl http://localhost:3000/api/personnel/employee-field-value-history
```

Check:

- [ ] HTTP 200

### Employee Onboarding Records

```bash
curl http://localhost:3000/api/personnel/employee-onboarding-records
```

Check:

- [ ] HTTP 200

### Employee Offboarding Records

```bash
curl http://localhost:3000/api/personnel/employee-offboarding-records
```

Check:

- [ ] HTTP 200

### Employee LOA Records

```bash
curl http://localhost:3000/api/personnel/employee-loa-records
```

Check:

- [ ] HTTP 200

### PAF Records

```bash
curl http://localhost:3000/api/personnel/paf-records
```

Check:

- [ ] HTTP 200

### Employee Profile Histories

```bash
curl http://localhost:3000/api/personnel/employee-profile-histories
```

Alias:

```bash
curl http://localhost:3000/api/personnel/employee-profile-history
```

Check:

- [ ] HTTP 200

## Approvals

Code reference:

- [backend/src/modules/approvals/approvals.module.ts](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/src/modules/approvals/approvals.module.ts)
- [backend/prisma/schema.prisma](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/prisma/schema.prisma)

### Approval Setups

```bash
curl http://localhost:3000/api/approvals/approval-setups
```

Check:

- [ ] HTTP 200

### Approver Sequences

```bash
curl http://localhost:3000/api/approvals/approver-sequences
```

Check:

- [ ] HTTP 200

### Approval Sequence Secondary Approvers

```bash
curl http://localhost:3000/api/approvals/approval-sequence-secondary-approvers
```

Check:

- [ ] HTTP 200

### Approval Delegations

```bash
curl http://localhost:3000/api/approvals/approval-delegations
```

Check:

- [ ] HTTP 200

### Workflow Assignments

```bash
curl http://localhost:3000/api/approvals/workflow-assignments
```

Check:

- [ ] HTTP 200

### Approval Requests

```bash
curl http://localhost:3000/api/approvals/approval-requests
```

Check:

- [ ] HTTP 200

### Approval Workflows

```bash
curl http://localhost:3000/api/approvals/approval-workflows
```

Check:

- [ ] HTTP 200

### Approval Workflow Notes

```bash
curl http://localhost:3000/api/approvals/approval-workflow-notes
```

Check:

- [ ] HTTP 200

## RBAC

Code reference:

- [backend/src/modules/rbac/rbac.module.ts](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/src/modules/rbac/rbac.module.ts)
- [backend/prisma/schema.prisma](/C:/Users/joshu/Documents/Diwa%20HRIS/backend/prisma/schema.prisma)

### Roles

```bash
curl http://localhost:3000/api/rbac/roles
```

Check:

- [ ] HTTP 200

### User Role Assignments

```bash
curl http://localhost:3000/api/rbac/user-role-assignments
```

Check:

- [ ] HTTP 200

### Permissions

```bash
curl http://localhost:3000/api/rbac/permissions
```

Check:

- [ ] HTTP 200

### System Modules

```bash
curl http://localhost:3000/api/rbac/system-modules
```

Check:

- [ ] HTTP 200

### Permission Module Configs

```bash
curl http://localhost:3000/api/rbac/permission-module-configs
```

Check:

- [ ] HTTP 200

### Permission Module Config Scopes

```bash
curl http://localhost:3000/api/rbac/permission-module-config-scopes
```

Check:

- [ ] HTTP 200

### Permission Module Config Actions

```bash
curl http://localhost:3000/api/rbac/permission-module-config-actions
```

Check:

- [ ] HTTP 200

### Permission Module Config States

```bash
curl http://localhost:3000/api/rbac/permission-module-config-states
```

Check:

- [ ] HTTP 200

### Role Permission Assignments

```bash
curl http://localhost:3000/api/rbac/role-permission-assignments
```

Check:

- [ ] HTTP 200

## Optional Mutation Test Template

Use this pattern carefully on a non-critical resource when you want to confirm `POST`, `PATCH`, and `DELETE`.

Example shape:

```bash
curl -X POST http://localhost:3000/api/rbac/roles ^
  -H "Content-Type: application/json" ^
  -d "{\"code\":\"TEST_ROLE\",\"name\":\"Test Role\",\"status\":\"ACTIVE\"}"
```

Then:

```bash
curl http://localhost:3000/api/rbac/roles
curl -X PATCH http://localhost:3000/api/rbac/roles/<id> -H "Content-Type: application/json" -d "{\"name\":\"Updated Test Role\"}"
curl -X DELETE http://localhost:3000/api/rbac/roles/<id>
```

Expected:

- `POST` creates a row
- `PATCH` updates it
- `DELETE` removes it
- invalid foreign keys should return `400`
- unique conflicts should return `409`
- missing IDs should return `404`

## Recommended First Pass

If you want the shortest useful verification run, start here:

```bash
curl http://localhost:3000/api/org-structure/org-units
curl http://localhost:3000/api/org-structure/positions
curl http://localhost:3000/api/pay-structure/salary-grades
curl http://localhost:3000/api/pay-structure/employee-pay-profiles
curl http://localhost:3000/api/personnel/employees
curl http://localhost:3000/api/personnel/pis-fields
curl http://localhost:3000/api/personnel/paf-records
curl http://localhost:3000/api/approvals/approval-requests
curl http://localhost:3000/api/rbac/roles
curl http://localhost:3000/api/rbac/role-permission-assignments
```

If those pass and the references look coherent, your Phase 1 backend is in a good starting state.
