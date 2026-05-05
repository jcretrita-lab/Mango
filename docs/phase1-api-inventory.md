# Phase 1 API Inventory

This file lists the actual Phase 1 APIs currently mounted in the backend so you can manually verify each one.

## Quick Start

Base backend URLs:

- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/api/health`

## What is in Phase 1

Mounted business modules:

- `org-structure`
- `pay-structure`
- `personnel`
- `approvals`
- `rbac`

Out of scope for this Phase 1 mount:

- `identity`
- position hierarchy cache APIs
- position version APIs

## How every Phase 1 API is wired

Read these files first if you want to understand the full request flow:

- `backend/src/app.module.ts`
  - mounts the Phase 1 modules
- `backend/src/main.ts`
  - applies the `/api` prefix and enables Swagger
- `backend/src/common/crud/crud.factory.ts`
  - generates the CRUD controllers for each resource
- `backend/src/common/crud/prisma-crud.service.ts`
  - runs the actual Prisma `findMany/findUnique/create/update/delete`
- `backend/prisma/schema.prisma`
  - contains the Prisma model for each resource

All resource APIs below use the same generic CRUD pattern:

- `GET /api/<domain>/<resource>`
- `GET /api/<domain>/<resource>/:id`
- `POST /api/<domain>/<resource>`
- `PATCH /api/<domain>/<resource>/:id`
- `DELETE /api/<domain>/<resource>/:id`

Error behavior from the shared CRUD service:

- `404` when a record does not exist
- `409` on unique-key conflicts
- `400` on foreign-key reference errors

## How to manually check an API

For each resource below, the fastest smoke test is:

1. open Swagger at `/api/docs`
2. run the collection `GET`
3. confirm you get `200`
4. confirm the payload shape matches the Prisma model
5. confirm foreign-key IDs point to real records in related resources
6. optionally run `POST`, `PATCH`, and `DELETE` on a test row

## Org Structure

Main code for this module:

- `backend/src/modules/org-structure/org-structure.module.ts`
- `backend/prisma/schema.prisma`
- shared CRUD files under `backend/src/common/crud/`

| Resource | Canonical base path | Alias | Function | Connects to | Where to read code | Manual check |
| --- | --- | --- | --- | --- | --- | --- |
| Company Profiles | `/api/org-structure/company-profiles` | `/api/org-structure/company-profile` | Top-level tenant/company record. | Connects to org units and employer-level setup. | `org-structure.module.ts`, `schema.prisma` -> `model CompanyProfile` | `GET` should return the seeded company record and its employer registration fields. |
| Hierarchy Levels | `/api/org-structure/hierarchy-levels` | None | Defines the allowed org depth levels. | Used by org units. | `org-structure.module.ts`, `schema.prisma` -> `model HierarchyLevel` | `GET` should show ordered hierarchy levels used by seeded org units. |
| Org Units | `/api/org-structure/org-units` | None | Core company structure nodes. | Connects to hierarchy levels, positions, employees through assignments. | `org-structure.module.ts`, `schema.prisma` -> `model OrgUnit` | `GET` should show parent-child-ready units with valid `hierarchyLevelId`. |
| Org Unit Closures | `/api/org-structure/org-unit-closures` | `/api/org-structure/org-unit-closure` | Ancestor-descendant cache for org traversal. | Connects org units to hierarchy queries. | `org-structure.module.ts`, `schema.prisma` -> `model OrgUnitClosure` | `GET` should show depth `0` self-rows and ancestor paths for descendants. |
| Org Unit Versions | `/api/org-structure/org-unit-versions` | None | Effective-dated snapshots of org units. | Connects to org units and future historical tracking. | `org-structure.module.ts`, `schema.prisma` -> `model OrgUnitVersion` | `GET` should show `isCurrent=true` rows tied to real `orgUnitId` values. |
| Sites | `/api/org-structure/sites` | None | Physical work locations. | Used by org design and employee placement concepts. | `org-structure.module.ts`, `schema.prisma` -> `model Site` | `GET` should return multiple enterprise sites from the seed data. |
| Ranks | `/api/org-structure/ranks` | None | High-level job/rank grouping. | Connects to rank levels and position profiles. | `org-structure.module.ts`, `schema.prisma` -> `model Rank` | `GET` should show seeded rank categories with sort order. |
| Rank Levels | `/api/org-structure/rank-levels` | None | Sub-levels inside a rank. | Connects ranks to position profiles. | `org-structure.module.ts`, `schema.prisma` -> `model RankLevel` | `GET` should show rows pointing to real `rankId` values. |
| Position Templates | `/api/org-structure/position-templates` | None | Reusable template for position families. | Connects to position profiles. | `org-structure.module.ts`, `schema.prisma` -> `model PositionTemplate` | `GET` should show reusable template rows for the enterprise seed. |
| Position Profiles | `/api/org-structure/position-profiles` | None | Detailed position definition and progression base. | Connects templates, ranks, salary grades, and sub-levels. | `org-structure.module.ts`, `schema.prisma` -> `model PositionProfile` | `GET` should show profiles with valid references to template/rank/grade fields. |
| Position Sub Levels | `/api/org-structure/position-sub-levels` | None | Optional progression slices under a profile. | Connects to position profiles and salary grades. | `org-structure.module.ts`, `schema.prisma` -> `model PositionSubLevel` | `GET` should show rows tied to valid `positionProfileId` values. |
| Positions | `/api/org-structure/positions` | None | Actual approved positions in the org. | Connects org units, profiles, grades, and assignments. | `org-structure.module.ts`, `schema.prisma` -> `model Position` | `GET` should show live positions with valid `orgUnitId` and `positionProfileId`. |
| Position Assignments | `/api/org-structure/position-assignments` | None | Links employees to positions over time. | Connects positions to personnel employees and employments. | `org-structure.module.ts`, `schema.prisma` -> `model PositionAssignment` | `GET` should show each seeded employee assignment tied to a real position. |

## Pay Structure

Main code for this module:

- `backend/src/modules/pay-structure/pay-structure.module.ts`
- `backend/prisma/schema.prisma`
- shared CRUD files under `backend/src/common/crud/`

| Resource | Canonical base path | Alias | Function | Connects to | Where to read code | Manual check |
| --- | --- | --- | --- | --- | --- | --- |
| Salary Grades | `/api/pay-structure/salary-grades` | None | Compensation bands for roles and profiles. | Connects to org structure profiles, positions, and salary grade steps. | `pay-structure.module.ts`, `schema.prisma` -> `model SalaryGrade` | `GET` should show multiple seeded grades under pay structure, not org structure. |
| Salary Grade Steps | `/api/pay-structure/salary-grade-steps` | None | Step progression amounts per grade. | Connects to salary grades and positions. | `pay-structure.module.ts`, `schema.prisma` -> `model SalaryGradeStep` | `GET` should show step rows with valid `salaryGradeId`. |
| Earning Template Families | `/api/pay-structure/earning-template-families` | None | Reusable pay package families. | Connects to scopes, revisions, and employee pay profiles. | `pay-structure.module.ts`, `schema.prisma` -> `model EarningTemplateFamily` | `GET` should show family rows for enterprise packages. |
| Earning Template Family Scopes | `/api/pay-structure/earning-template-family-scopes` | None | Where a pay package is applicable. | Connects template families to scope references such as org units or positions. | `pay-structure.module.ts`, `schema.prisma` -> `model EarningTemplateFamilyScope` | `GET` should show rows tied to valid `earningTemplateFamilyId`. |
| Earning Template Revisions | `/api/pay-structure/earning-template-revisions` | None | Effective-dated versions of a pay package. | Connects template families to revision lines. | `pay-structure.module.ts`, `schema.prisma` -> `model EarningTemplateRevision` | `GET` should show current revisions with valid family IDs. |
| Earning Template Revision Lines | `/api/pay-structure/earning-template-revision-lines` | None | The earning components inside a revision. | Connects revisions to earning components. | `pay-structure.module.ts`, `schema.prisma` -> `model EarningTemplateRevisionLine` | `GET` should show rows joining a revision to a component. |
| Earning Components | `/api/pay-structure/earning-components` | None | Atomic earning definitions such as base pay or allowances. | Connects formulas, revisions, and employee pay profiles indirectly. | `pay-structure.module.ts`, `schema.prisma` -> `model EarningComponent` | `GET` should show taxable/default flags and optional formula references. |
| Formulas | `/api/pay-structure/formulas` | None | Named payroll formulas. | Connects to formula versions and earning components. | `pay-structure.module.ts`, `schema.prisma` -> `model Formula` | `GET` should show seeded formula definitions. |
| Formula Versions | `/api/pay-structure/formula-versions` | None | Effective-dated formula expressions. | Connects formulas to earning components or other pay logic. | `pay-structure.module.ts`, `schema.prisma` -> `model FormulaVersion` | `GET` should show rows tied to real `formulaId` values. |
| Employee Pay Profiles | `/api/pay-structure/employee-pay-profiles` | None | Employee-specific pay assignment record. | Connects employees to earning template families and approval requests. | `pay-structure.module.ts`, `schema.prisma` -> `model EmployeePayProfile` | `GET` should show rows tied to real employees and template families. |

## Personnel / PIS

Main code for this module:

- `backend/src/modules/personnel/personnel.module.ts`
- `backend/prisma/schema.prisma`
- shared CRUD files under `backend/src/common/crud/`

| Resource | Canonical base path | Alias | Function | Connects to | Where to read code | Manual check |
| --- | --- | --- | --- | --- | --- | --- |
| Employees | `/api/personnel/employees` | None | Core employee shell record. | Connects to employments, profiles, PIS values, assignments, approvals, and pay profiles. | `personnel.module.ts`, `schema.prisma` -> `model Employee` | `GET` should show enterprise employees with valid primary assignment IDs. |
| Employments | `/api/personnel/employments` | None | Employment lifecycle record. | Connects employees to position assignments and pay schedule concepts. | `personnel.module.ts`, `schema.prisma` -> `model Employment` | `GET` should show real employee-employment rows with valid `employeeId`. |
| Employee Profiles | `/api/personnel/employee-profiles` | None | Personal/statutory profile extension of employee. | Connects directly to employees. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeProfile` | `GET` should show one profile per seeded employee. |
| Education Records | `/api/personnel/education-records` | None | Education history entries. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model EducationRecord` | `GET` should show rows tied to real employees. |
| Exam Records | `/api/personnel/exam-records` | None | Licenses, certifications, or exam history. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model ExamRecord` | `GET` should show records with valid `employeeId`. |
| Employment History Records | `/api/personnel/employment-history-records` | None | Pre-hire work history. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model EmploymentHistoryRecord` | `GET` should show prior-company history rows. |
| Reference Contacts | `/api/personnel/reference-contacts` | None | Employee reference persons. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model ReferenceContact` | `GET` should show reference rows linked to employees. |
| Family Members | `/api/personnel/family-members` | None | Family/dependent records. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model FamilyMember` | `GET` should show rows with relationship fields. |
| Emergency Contacts | `/api/personnel/emergency-contacts` | None | Emergency contact list. | Connects to employees. | `personnel.module.ts`, `schema.prisma` -> `model EmergencyContact` | `GET` should show rows tied to employees. |
| PIS Tabs | `/api/personnel/pis-tabs` | None | Configurable tab groupings for the personnel UI. | Connects to PIS fields. | `personnel.module.ts`, `schema.prisma` -> `model PisTab` | `GET` should show tab definitions used by fields. |
| PIS Fields | `/api/personnel/pis-fields` | None | Configurable fields inside a PIS tab. | Connects tabs, options, policies, and employee field values. | `personnel.module.ts`, `schema.prisma` -> `model PisField` | `GET` should show fields with valid `pisTabId`. |
| PIS Field Options | `/api/personnel/pis-field-options` | None | Allowed option values for a field. | Connects to PIS fields. | `personnel.module.ts`, `schema.prisma` -> `model PisFieldOption` | `GET` should show option rows tied to real fields. |
| PIS Field Policies | `/api/personnel/pis-field-policies` | None | Rule layer for field required/enabled behavior. | Connects to PIS fields and scope concepts. | `personnel.module.ts`, `schema.prisma` -> `model PisFieldPolicy` | `GET` should show policy rows with valid `pisFieldId`. |
| Employee Field Values | `/api/personnel/employee-field-values` | None | Employee-specific stored custom field value. | Connects employees to PIS fields. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeFieldValue` | `GET` should show values with valid `employeeId` and `pisFieldId`. |
| Employee Field Value Histories | `/api/personnel/employee-field-value-histories` | `/api/personnel/employee-field-value-history` | Audit history of custom field changes. | Connects to employee field values. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeFieldValueHistory` | `GET` should show prior-value snapshots tied to real field values. |
| Employee Onboarding Records | `/api/personnel/employee-onboarding-records` | None | Onboarding workflow record. | Connects employees to setup/progress tracking. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeOnboardingRecord` | `GET` should show seeded onboarding rows and statuses. |
| Employee Offboarding Records | `/api/personnel/employee-offboarding-records` | None | Offboarding/separation workflow record. | Connects employees to clearance or exit data. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeOffboardingRecord` | `GET` should show seeded offboarding rows if present. |
| Employee LOA Records | `/api/personnel/employee-loa-records` | None | Leave-of-absence transaction record. | Connects employees and optionally PAF records. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeLoaRecord` | `GET` should show LOA rows tied to valid employees. |
| PAF Records | `/api/personnel/paf-records` | None | Personnel Action Form business record. | Connects employees, approval setup, and approval requests. | `personnel.module.ts`, `schema.prisma` -> `model PafRecord` | `GET` should show action-type rows tied to approval workflow IDs where seeded. |
| Employee Profile Histories | `/api/personnel/employee-profile-histories` | `/api/personnel/employee-profile-history` | Audit trail for employee profile changes. | Connects employees and optionally PAF records. | `personnel.module.ts`, `schema.prisma` -> `model EmployeeProfileHistory` | `GET` should show profile change rows tied to real employees. |

## Approvals

Main code for this module:

- `backend/src/modules/approvals/approvals.module.ts`
- `backend/prisma/schema.prisma`
- shared CRUD files under `backend/src/common/crud/`

| Resource | Canonical base path | Alias | Function | Connects to | Where to read code | Manual check |
| --- | --- | --- | --- | --- | --- | --- |
| Approval Setups | `/api/approvals/approval-setups` | None | Defines approval template/config per business action. | Connects to approver sequences, workflow assignments, PAF records, and approval requests. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalSetup` | `GET` should show seeded setup rows by module/action. |
| Approver Sequences | `/api/approvals/approver-sequences` | None | Ordered approval steps under a setup. | Connects approval setups to approver users/roles/positions. | `approvals.module.ts`, `schema.prisma` -> `model ApproverSequence` | `GET` should show step order and valid `approvalSetupId`. |
| Approval Sequence Secondary Approvers | `/api/approvals/approval-sequence-secondary-approvers` | None | Backup/secondary approvers for a sequence step. | Connects to approver sequences and optional users/roles/positions. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalSequenceSecondaryApprover` | `GET` should show rows tied to valid approver sequence IDs. |
| Approval Delegations | `/api/approvals/approval-delegations` | None | Temporary delegated approval authority. | Connects users to substitute approver behavior. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalDelegation` | `GET` should show from/to user mappings and status. |
| Workflow Assignments | `/api/approvals/workflow-assignments` | None | Binds approval setups to business scope. | Connects approval setup to a scope target. | `approvals.module.ts`, `schema.prisma` -> `model WorkflowAssignment` | `GET` should show rows pointing to valid `approvalSetupId`. |
| Approval Requests | `/api/approvals/approval-requests` | None | Actual approval transaction request. | Connects setups to employees and business references such as PAF or pay profile decisions. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalRequest` | `GET` should show seeded request rows and statuses. |
| Approval Workflows | `/api/approvals/approval-workflows` | None | Per-step execution status of an approval request. | Connects approval requests and approver sequences. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalWorkflow` | `GET` should show rows tied to real request and sequence IDs. |
| Approval Workflow Notes | `/api/approvals/approval-workflow-notes` | None | Notes/comments on a workflow step. | Connects to approval workflows. | `approvals.module.ts`, `schema.prisma` -> `model ApprovalWorkflowNote` | `GET` should show note rows tied to real workflow IDs. |

## RBAC

Main code for this module:

- `backend/src/modules/rbac/rbac.module.ts`
- `backend/prisma/schema.prisma`
- shared CRUD files under `backend/src/common/crud/`

| Resource | Canonical base path | Alias | Function | Connects to | Where to read code | Manual check |
| --- | --- | --- | --- | --- | --- | --- |
| Roles | `/api/rbac/roles` | None | Named access roles. | Connects to user-role assignments and role-permission assignments. | `rbac.module.ts`, `schema.prisma` -> `model Role` | `GET` should show seeded enterprise roles. |
| User Role Assignments | `/api/rbac/user-role-assignments` | None | Assigns roles to users. | Connects roles to users from the seed set. | `rbac.module.ts`, `schema.prisma` -> `model UserRoleAssignment` | `GET` should show rows with valid `roleId` and `userId`. |
| Permissions | `/api/rbac/permissions` | None | Reusable permission codes. | Connects to role-permission assignments. | `rbac.module.ts`, `schema.prisma` -> `model Permission` | `GET` should show permission codes used by the role matrix. |
| System Modules | `/api/rbac/system-modules` | None | RBAC-visible business module catalog. | Connects permission configs to module-level access. | `rbac.module.ts`, `schema.prisma` -> `model SystemModule` | `GET` should show seeded module codes matching Phase 1 areas. |
| Permission Module Configs | `/api/rbac/permission-module-configs` | None | RBAC config blocks inside a system module. | Connects system modules to scopes/actions/states. | `rbac.module.ts`, `schema.prisma` -> `model PermissionModuleConfig` | `GET` should show rows tied to valid `systemModuleId`. |
| Permission Module Config Scopes | `/api/rbac/permission-module-config-scopes` | None | Allowed scope dimension under a module config. | Connects permission module configs to scope definitions. | `rbac.module.ts`, `schema.prisma` -> `model PermissionModuleConfigScope` | `GET` should show rows with valid `permissionModuleConfigId`. |
| Permission Module Config Actions | `/api/rbac/permission-module-config-actions` | None | Allowed action dimension under a module config. | Connects permission module configs to action definitions. | `rbac.module.ts`, `schema.prisma` -> `model PermissionModuleConfigAction` | `GET` should show rows with valid `permissionModuleConfigId`. |
| Permission Module Config States | `/api/rbac/permission-module-config-states` | None | Allowed workflow state dimension under a module config. | Connects permission module configs to state definitions. | `rbac.module.ts`, `schema.prisma` -> `model PermissionModuleConfigState` | `GET` should show rows with valid `permissionModuleConfigId`. |
| Role Permission Assignments | `/api/rbac/role-permission-assignments` | None | Final mapping of role to permission and module config combination. | Connects roles, permissions, modules, scopes, actions, and states. | `rbac.module.ts`, `schema.prisma` -> `model RolePermissionAssignment` | `GET` should show the effective RBAC matrix with valid foreign-key references. |

## Suggested verification order

If you want the cleanest QA path, check APIs in this order:

1. `org-structure`
2. `rbac`
3. `personnel`
4. `pay-structure`
5. `approvals`

Reason:

- org structure provides foundational references
- rbac gives you access structure
- personnel depends on org and assignments
- pay structure depends on org and personnel references
- approvals often references personnel and pay/personnel transactions

## Fast Phase 1 smoke pass

If you want a short pass before deep testing, start with these:

- `GET /api/org-structure/company-profiles`
- `GET /api/org-structure/org-units`
- `GET /api/org-structure/positions`
- `GET /api/pay-structure/salary-grades`
- `GET /api/pay-structure/earning-template-families`
- `GET /api/pay-structure/employee-pay-profiles`
- `GET /api/personnel/employees`
- `GET /api/personnel/pis-fields`
- `GET /api/personnel/paf-records`
- `GET /api/approvals/approval-setups`
- `GET /api/approvals/approval-requests`
- `GET /api/rbac/roles`
- `GET /api/rbac/role-permission-assignments`

If those return valid data and the foreign keys line up, the Phase 1 backend is generally wired correctly.
