-- Phase 1 integrity hardening kept compatible with existing string status fields.
-- These checks and partial indexes complement Prisma schema constraints that cannot
-- model every PostgreSQL production rule directly.

ALTER TABLE "OrgUnitVersion"
  ADD CONSTRAINT "org_unit_version_date_order_chk"
  CHECK ("effectiveEndDate" IS NULL OR "effectiveEndDate" >= "effectiveStartDate");

ALTER TABLE "Employment"
  ADD CONSTRAINT "employment_date_order_chk"
  CHECK ("endDate" IS NULL OR "endDate" >= "startDate");

ALTER TABLE "PositionAssignment"
  ADD CONSTRAINT "position_assignment_date_order_chk"
  CHECK ("endDate" IS NULL OR "endDate" >= "startDate");

ALTER TABLE "FormulaVersion"
  ADD CONSTRAINT "formula_version_date_order_chk"
  CHECK ("effectiveEndDate" IS NULL OR "effectiveEndDate" >= "effectiveStartDate");

ALTER TABLE "EarningTemplateRevision"
  ADD CONSTRAINT "earning_template_revision_date_order_chk"
  CHECK ("effectiveEndDate" IS NULL OR "effectiveEndDate" >= "effectiveStartDate");

ALTER TABLE "EmployeePayProfile"
  ADD CONSTRAINT "employee_pay_profile_date_order_chk"
  CHECK ("effectiveEndDate" IS NULL OR "effectiveEndDate" >= "effectiveStartDate");

ALTER TABLE "ApprovalDelegation"
  ADD CONSTRAINT "approval_delegation_date_order_chk"
  CHECK ("endDate" >= "startDate");

ALTER TABLE "ApprovalRequest"
  ADD CONSTRAINT "approval_request_status_chk"
  CHECK ("status" IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'));

ALTER TABLE "ApprovalWorkflow"
  ADD CONSTRAINT "approval_workflow_status_chk"
  CHECK ("status" IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'));

ALTER TABLE "ApprovalDelegation"
  ADD CONSTRAINT "approval_delegation_status_chk"
  CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'REVOKED'));

ALTER TABLE "ApproverSequence"
  ADD CONSTRAINT "approver_sequence_source_chk"
  CHECK (
    "isAutoApproved" = true
    OR (
      (CASE WHEN "approverUserId" IS NULL THEN 0 ELSE 1 END)
      + (CASE WHEN "approverRoleId" IS NULL THEN 0 ELSE 1 END)
      + (CASE WHEN "approverPositionId" IS NULL THEN 0 ELSE 1 END)
    ) = 1
  );

CREATE UNIQUE INDEX "org_unit_version_current_uq"
ON "OrgUnitVersion" ("orgUnitId")
WHERE "isCurrent" = true;

CREATE UNIQUE INDEX "formula_version_current_uq"
ON "FormulaVersion" ("formulaId")
WHERE "isCurrent" = true;

CREATE UNIQUE INDEX "earning_template_revision_current_uq"
ON "EarningTemplateRevision" ("earningTemplateFamilyId")
WHERE "isCurrent" = true;

CREATE UNIQUE INDEX "employee_pay_profile_current_active_uq"
ON "EmployeePayProfile" ("employeeId")
WHERE "status" = 'ACTIVE' AND "effectiveEndDate" IS NULL;

CREATE INDEX "approval_workflow_queue_idx"
ON "ApprovalWorkflow" ("approverUserId", "status", "createdAt");

CREATE INDEX "approval_request_reference_idx"
ON "ApprovalRequest" ("referenceType", "referenceId");
