-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "employeeId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenType" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemModule" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SystemModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionModuleConfig" (
    "id" SERIAL NOT NULL,
    "systemModuleId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PermissionModuleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionModuleConfigScope" (
    "id" SERIAL NOT NULL,
    "permissionModuleConfigId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PermissionModuleConfigScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionModuleConfigAction" (
    "id" SERIAL NOT NULL,
    "permissionModuleConfigId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PermissionModuleConfigAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionModuleConfigState" (
    "id" SERIAL NOT NULL,
    "permissionModuleConfigId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PermissionModuleConfigState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissionAssignment" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "systemModuleId" INTEGER,
    "permissionModuleConfigId" INTEGER,
    "permissionModuleConfigScopeId" INTEGER,
    "permissionModuleConfigActionId" INTEGER,
    "permissionModuleConfigStateId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RolePermissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" SERIAL NOT NULL,
    "actorUserId" INTEGER,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "route" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" SERIAL NOT NULL,
    "registeredName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "registrationType" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "tin" TEXT NOT NULL,
    "branchCode" TEXT,
    "rdoCode" TEXT,
    "sssEmployerNo" TEXT,
    "philhealthEmployerNo" TEXT,
    "pagibigEmployerNo" TEXT,
    "businessAddress" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'PH',
    "rootOrgUnitId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HierarchyLevel" (
    "id" SERIAL NOT NULL,
    "levelNo" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "HierarchyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'PH',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgUnit" (
    "id" SERIAL NOT NULL,
    "parentOrgUnitId" INTEGER,
    "hierarchyLevelId" INTEGER NOT NULL,
    "headPositionId" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrgUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgUnitClosure" (
    "id" SERIAL NOT NULL,
    "ancestorOrgUnitId" INTEGER NOT NULL,
    "descendantOrgUnitId" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrgUnitClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgUnitVersion" (
    "id" SERIAL NOT NULL,
    "orgUnitId" INTEGER NOT NULL,
    "parentOrgUnitId" INTEGER,
    "hierarchyLevelId" INTEGER NOT NULL,
    "headPositionId" INTEGER,
    "name" TEXT NOT NULL,
    "effectiveStartDate" TIMESTAMP(3) NOT NULL,
    "effectiveEndDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrgUnitVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "color" TEXT,
    "mode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankLevel" (
    "id" SERIAL NOT NULL,
    "rankId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RankLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryGrade" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rateType" TEXT NOT NULL,
    "minSalary" DECIMAL(15,2),
    "maxSalary" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SalaryGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryGradeStep" (
    "id" SERIAL NOT NULL,
    "salaryGradeId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SalaryGradeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT,
    "category" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PositionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionProfile" (
    "id" SERIAL NOT NULL,
    "positionTemplateId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "rankId" INTEGER,
    "rankLevelId" INTEGER,
    "progressionMode" TEXT NOT NULL,
    "defaultSalaryGradeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PositionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionSubLevel" (
    "id" SERIAL NOT NULL,
    "positionProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "salaryGradeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PositionSubLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "orgUnitId" INTEGER NOT NULL,
    "positionProfileId" INTEGER NOT NULL,
    "positionSubLevelId" INTEGER,
    "salaryGradeId" INTEGER,
    "salaryGradeStepId" INTEGER,
    "supervisorPositionId" INTEGER,
    "title" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "defaultBasePay" DECIMAL(15,2) NOT NULL,
    "plannedHeadcount" INTEGER NOT NULL DEFAULT 1,
    "fte" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionAssignment" (
    "id" SERIAL NOT NULL,
    "positionId" INTEGER NOT NULL,
    "employeeId" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "assignmentType" TEXT NOT NULL,
    "fte" DECIMAL(5,2) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PositionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "orgUnitJson" JSONB,
    "roleTitle" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "primaryPositionAssignmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employment" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "positionAssignmentId" INTEGER,
    "status" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "payScheduleId" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "civilStatus" TEXT,
    "residentialAddress" TEXT,
    "sssNo" TEXT,
    "tinNo" TEXT,
    "philhealthNo" TEXT,
    "pagibigNo" TEXT,
    "bankName" TEXT,
    "bankAccountNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "attainment" TEXT NOT NULL,
    "course" TEXT,
    "school" TEXT NOT NULL,
    "dateGraduated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EducationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "dateTaken" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "rating" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ExamRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentHistoryRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "address" TEXT,
    "position" TEXT,
    "department" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmploymentHistoryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceContact" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "position" TEXT,
    "contactNo" TEXT,
    "business" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ReferenceContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "occupation" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contactNo" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PisTab" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PisTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PisField" (
    "id" SERIAL NOT NULL,
    "pisTabId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "validationRegex" TEXT,
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "sourceTable" TEXT,
    "sourceColumn" TEXT,
    "placeholder" TEXT,
    "helpText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PisField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PisFieldOption" (
    "id" SERIAL NOT NULL,
    "pisFieldId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PisFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PisFieldPolicy" (
    "id" SERIAL NOT NULL,
    "pisFieldId" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" INTEGER,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PisFieldPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeFieldValue" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "pisFieldId" INTEGER NOT NULL,
    "valueJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeFieldValueHistory" (
    "id" SERIAL NOT NULL,
    "employeeFieldValueId" INTEGER NOT NULL,
    "previousValueJson" JSONB NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" INTEGER,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeFieldValueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeOnboardingRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedStepsJson" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeOnboardingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeOffboardingRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "clearanceStatus" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeOffboardingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PafRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "approvalSetupId" INTEGER,
    "approvalRequestId" INTEGER,
    "actionType" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PafRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeLoaRecord" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "loaType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedReturnDate" TIMESTAMP(3),
    "actualReturnDate" TIMESTAMP(3),
    "pauseAccruals" BOOLEAN NOT NULL DEFAULT true,
    "haltPayrollExpectations" BOOLEAN NOT NULL DEFAULT true,
    "pafRecordId" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeLoaRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProfileHistory" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "previousValue" TEXT,
    "newValue" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "changeSource" TEXT NOT NULL,
    "pafRecordId" INTEGER,
    "changeReason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeeProfileHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormulaVersion" (
    "id" SERIAL NOT NULL,
    "formulaId" INTEGER NOT NULL,
    "versionNo" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "effectiveStartDate" TIMESTAMP(3) NOT NULL,
    "effectiveEndDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "FormulaVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningComponent" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "valueSource" TEXT NOT NULL,
    "orgReferenceType" TEXT,
    "fixedAmount" DECIMAL(15,2),
    "formulaVersionId" INTEGER,
    "lookupTableVersionId" INTEGER,
    "isTaxableDefault" BOOLEAN NOT NULL DEFAULT true,
    "includeIn13thMonthDefault" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EarningComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningTemplateFamily" (
    "id" SERIAL NOT NULL,
    "baseEarningTemplateFamilyId" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateKind" TEXT NOT NULL,
    "showInDefaultPicker" BOOLEAN NOT NULL DEFAULT true,
    "payBasisApplicability" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EarningTemplateFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningTemplateFamilyScope" (
    "id" SERIAL NOT NULL,
    "earningTemplateFamilyId" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeRefId" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EarningTemplateFamilyScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningTemplateRevision" (
    "id" SERIAL NOT NULL,
    "earningTemplateFamilyId" INTEGER NOT NULL,
    "versionNo" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "effectiveStartDate" TIMESTAMP(3) NOT NULL,
    "effectiveEndDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EarningTemplateRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningTemplateRevisionLine" (
    "id" SERIAL NOT NULL,
    "earningTemplateRevisionId" INTEGER NOT NULL,
    "earningComponentId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EarningTemplateRevisionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeePayProfile" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "earningTemplateFamilyId" INTEGER NOT NULL,
    "payScheduleId" INTEGER,
    "approvalRequestId" INTEGER,
    "payBasis" TEXT NOT NULL,
    "effectiveStartDate" TIMESTAMP(3) NOT NULL,
    "effectiveEndDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EmployeePayProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalSetup" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApproverSequence" (
    "id" SERIAL NOT NULL,
    "approvalSetupId" INTEGER NOT NULL,
    "stepNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "approverType" TEXT DEFAULT 'USER',
    "approverRoleId" INTEGER,
    "approverUserId" INTEGER,
    "approverPositionId" INTEGER,
    "requiredApprovals" INTEGER NOT NULL DEFAULT 1,
    "isAutoApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApproverSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalSequenceSecondaryApprover" (
    "id" SERIAL NOT NULL,
    "approverSequenceId" INTEGER NOT NULL,
    "approverType" TEXT DEFAULT 'USER',
    "userId" INTEGER,
    "roleId" INTEGER,
    "positionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalSequenceSecondaryApprover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalDelegation" (
    "id" SERIAL NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalDelegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowAssignment" (
    "id" SERIAL NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeRefId" INTEGER,
    "approvalSetupId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WorkflowAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" SERIAL NOT NULL,
    "approvalSetupId" INTEGER NOT NULL,
    "requestedByUserId" INTEGER,
    "employeeId" INTEGER,
    "referenceType" TEXT,
    "referenceId" INTEGER,
    "status" TEXT NOT NULL,
    "currentStepNo" INTEGER NOT NULL DEFAULT 1,
    "payloadJson" JSONB,
    "submittedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalWorkflow" (
    "id" SERIAL NOT NULL,
    "approvalRequestId" INTEGER NOT NULL,
    "approverSequenceId" INTEGER NOT NULL,
    "approverUserId" INTEGER,
    "status" TEXT NOT NULL,
    "actedAt" TIMESTAMP(3),
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalWorkflowNote" (
    "id" SERIAL NOT NULL,
    "approvalWorkflowId" INTEGER NOT NULL,
    "authorUserId" INTEGER,
    "noteType" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ApprovalWorkflowNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_status_isActive_idx" ON "User"("status", "isActive");

-- CreateIndex
CREATE INDEX "User_employeeId_idx" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userId_key" ON "UserCredential"("userId");

-- CreateIndex
CREATE INDEX "UserCredential_lockedUntil_idx" ON "UserCredential"("lockedUntil");

-- CreateIndex
CREATE INDEX "UserSession_userId_status_expiresAt_idx" ON "UserSession"("userId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "UserSession_status_expiresAt_idx" ON "UserSession"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "UserAuthToken_userId_tokenType_consumedAt_idx" ON "UserAuthToken"("userId", "tokenType", "consumedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SystemModule_code_key" ON "SystemModule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionModuleConfig_code_key" ON "PermissionModuleConfig"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionModuleConfigScope_code_key" ON "PermissionModuleConfigScope"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionModuleConfigAction_code_key" ON "PermissionModuleConfigAction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionModuleConfigState_code_key" ON "PermissionModuleConfigState"("code");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_userId_isActive_idx" ON "UserRoleAssignment"("userId", "isActive");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_roleId_isActive_idx" ON "UserRoleAssignment"("roleId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_userId_roleId_key" ON "UserRoleAssignment"("userId", "roleId");

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_roleId_permissionId_idx" ON "RolePermissionAssignment"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_roleId_isActive_idx" ON "RolePermissionAssignment"("roleId", "isActive");

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_permissionId_isActive_idx" ON "RolePermissionAssignment"("permissionId", "isActive");

-- CreateIndex
CREATE INDEX "RolePermissionAssignment_systemModuleId_idx" ON "RolePermissionAssignment"("systemModuleId");

-- CreateIndex
CREATE INDEX "AuditEvent_actorUserId_createdAt_idx" ON "AuditEvent"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_eventType_createdAt_idx" ON "AuditEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OrgUnit_code_key" ON "OrgUnit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OrgUnitClosure_ancestorOrgUnitId_descendantOrgUnitId_depth_key" ON "OrgUnitClosure"("ancestorOrgUnitId", "descendantOrgUnitId", "depth");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryGrade_code_key" ON "SalaryGrade"("code");

-- CreateIndex
CREATE INDEX "PositionAssignment_employeeId_startDate_endDate_idx" ON "PositionAssignment"("employeeId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "PositionAssignment_positionId_startDate_endDate_idx" ON "PositionAssignment"("positionId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeNumber_key" ON "Employee"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_status_jobType_idx" ON "Employee"("status", "jobType");

-- CreateIndex
CREATE INDEX "Employment_employeeId_startDate_endDate_idx" ON "Employment"("employeeId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_employeeId_key" ON "EmployeeProfile"("employeeId");

-- CreateIndex
CREATE INDEX "EducationRecord_employeeId_idx" ON "EducationRecord"("employeeId");

-- CreateIndex
CREATE INDEX "ExamRecord_employeeId_idx" ON "ExamRecord"("employeeId");

-- CreateIndex
CREATE INDEX "EmploymentHistoryRecord_employeeId_idx" ON "EmploymentHistoryRecord"("employeeId");

-- CreateIndex
CREATE INDEX "ReferenceContact_employeeId_idx" ON "ReferenceContact"("employeeId");

-- CreateIndex
CREATE INDEX "FamilyMember_employeeId_idx" ON "FamilyMember"("employeeId");

-- CreateIndex
CREATE INDEX "EmergencyContact_employeeId_idx" ON "EmergencyContact"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "PisTab_code_key" ON "PisTab"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PisField_code_key" ON "PisField"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PisFieldOption_code_key" ON "PisFieldOption"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeFieldValue_employeeId_pisFieldId_key" ON "EmployeeFieldValue"("employeeId", "pisFieldId");

-- CreateIndex
CREATE INDEX "EmployeeFieldValueHistory_employeeFieldValueId_changedAt_idx" ON "EmployeeFieldValueHistory"("employeeFieldValueId", "changedAt");

-- CreateIndex
CREATE INDEX "EmployeeOnboardingRecord_employeeId_status_idx" ON "EmployeeOnboardingRecord"("employeeId", "status");

-- CreateIndex
CREATE INDEX "EmployeeOffboardingRecord_employeeId_clearanceStatus_idx" ON "EmployeeOffboardingRecord"("employeeId", "clearanceStatus");

-- CreateIndex
CREATE INDEX "EmployeeLoaRecord_employeeId_startDate_actualReturnDate_idx" ON "EmployeeLoaRecord"("employeeId", "startDate", "actualReturnDate");

-- CreateIndex
CREATE INDEX "EmployeeProfileHistory_employeeId_changedAt_idx" ON "EmployeeProfileHistory"("employeeId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Formula_code_key" ON "Formula"("code");

-- CreateIndex
CREATE INDEX "FormulaVersion_formulaId_isCurrent_effectiveStartDate_idx" ON "FormulaVersion"("formulaId", "isCurrent", "effectiveStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "EarningComponent_code_key" ON "EarningComponent"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EarningTemplateFamily_code_key" ON "EarningTemplateFamily"("code");

-- CreateIndex
CREATE INDEX "EarningTemplateRevision_earningTemplateFamilyId_isCurrent_e_idx" ON "EarningTemplateRevision"("earningTemplateFamilyId", "isCurrent", "effectiveStartDate");

-- CreateIndex
CREATE INDEX "EmployeePayProfile_employeeId_status_effectiveStartDate_idx" ON "EmployeePayProfile"("employeeId", "status", "effectiveStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalSetup_code_key" ON "ApprovalSetup"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ApproverSequence_approvalSetupId_stepNo_key" ON "ApproverSequence"("approvalSetupId", "stepNo");

-- CreateIndex
CREATE INDEX "ApprovalDelegation_fromUserId_toUserId_status_startDate_end_idx" ON "ApprovalDelegation"("fromUserId", "toUserId", "status", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "ApprovalDelegation_toUserId_status_startDate_endDate_idx" ON "ApprovalDelegation"("toUserId", "status", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "ApprovalRequest_employeeId_status_idx" ON "ApprovalRequest"("employeeId", "status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_requestedByUserId_status_idx" ON "ApprovalRequest"("requestedByUserId", "status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_currentStepNo_idx" ON "ApprovalRequest"("status", "currentStepNo");

-- CreateIndex
CREATE INDEX "ApprovalWorkflow_approvalRequestId_status_idx" ON "ApprovalWorkflow"("approvalRequestId", "status");

-- CreateIndex
CREATE INDEX "ApprovalWorkflow_approverUserId_status_idx" ON "ApprovalWorkflow"("approverUserId", "status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuthToken" ADD CONSTRAINT "UserAuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionModuleConfig" ADD CONSTRAINT "PermissionModuleConfig_systemModuleId_fkey" FOREIGN KEY ("systemModuleId") REFERENCES "SystemModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionModuleConfigScope" ADD CONSTRAINT "PermissionModuleConfigScope_permissionModuleConfigId_fkey" FOREIGN KEY ("permissionModuleConfigId") REFERENCES "PermissionModuleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionModuleConfigAction" ADD CONSTRAINT "PermissionModuleConfigAction_permissionModuleConfigId_fkey" FOREIGN KEY ("permissionModuleConfigId") REFERENCES "PermissionModuleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionModuleConfigState" ADD CONSTRAINT "PermissionModuleConfigState_permissionModuleConfigId_fkey" FOREIGN KEY ("permissionModuleConfigId") REFERENCES "PermissionModuleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_systemModuleId_fkey" FOREIGN KEY ("systemModuleId") REFERENCES "SystemModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionModuleConfigId_fkey" FOREIGN KEY ("permissionModuleConfigId") REFERENCES "PermissionModuleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionModuleConfigScopeId_fkey" FOREIGN KEY ("permissionModuleConfigScopeId") REFERENCES "PermissionModuleConfigScope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionModuleConfigActionId_fkey" FOREIGN KEY ("permissionModuleConfigActionId") REFERENCES "PermissionModuleConfigAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionAssignment" ADD CONSTRAINT "RolePermissionAssignment_permissionModuleConfigStateId_fkey" FOREIGN KEY ("permissionModuleConfigStateId") REFERENCES "PermissionModuleConfigState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnit" ADD CONSTRAINT "OrgUnit_parentOrgUnitId_fkey" FOREIGN KEY ("parentOrgUnitId") REFERENCES "OrgUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnit" ADD CONSTRAINT "OrgUnit_hierarchyLevelId_fkey" FOREIGN KEY ("hierarchyLevelId") REFERENCES "HierarchyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnit" ADD CONSTRAINT "OrgUnit_headPositionId_fkey" FOREIGN KEY ("headPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitClosure" ADD CONSTRAINT "OrgUnitClosure_ancestorOrgUnitId_fkey" FOREIGN KEY ("ancestorOrgUnitId") REFERENCES "OrgUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitClosure" ADD CONSTRAINT "OrgUnitClosure_descendantOrgUnitId_fkey" FOREIGN KEY ("descendantOrgUnitId") REFERENCES "OrgUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitVersion" ADD CONSTRAINT "OrgUnitVersion_orgUnitId_fkey" FOREIGN KEY ("orgUnitId") REFERENCES "OrgUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitVersion" ADD CONSTRAINT "OrgUnitVersion_parentOrgUnitId_fkey" FOREIGN KEY ("parentOrgUnitId") REFERENCES "OrgUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitVersion" ADD CONSTRAINT "OrgUnitVersion_hierarchyLevelId_fkey" FOREIGN KEY ("hierarchyLevelId") REFERENCES "HierarchyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUnitVersion" ADD CONSTRAINT "OrgUnitVersion_headPositionId_fkey" FOREIGN KEY ("headPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankLevel" ADD CONSTRAINT "RankLevel_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryGradeStep" ADD CONSTRAINT "SalaryGradeStep_salaryGradeId_fkey" FOREIGN KEY ("salaryGradeId") REFERENCES "SalaryGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionProfile" ADD CONSTRAINT "PositionProfile_positionTemplateId_fkey" FOREIGN KEY ("positionTemplateId") REFERENCES "PositionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionProfile" ADD CONSTRAINT "PositionProfile_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionProfile" ADD CONSTRAINT "PositionProfile_rankLevelId_fkey" FOREIGN KEY ("rankLevelId") REFERENCES "RankLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionProfile" ADD CONSTRAINT "PositionProfile_defaultSalaryGradeId_fkey" FOREIGN KEY ("defaultSalaryGradeId") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionSubLevel" ADD CONSTRAINT "PositionSubLevel_positionProfileId_fkey" FOREIGN KEY ("positionProfileId") REFERENCES "PositionProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionSubLevel" ADD CONSTRAINT "PositionSubLevel_salaryGradeId_fkey" FOREIGN KEY ("salaryGradeId") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_orgUnitId_fkey" FOREIGN KEY ("orgUnitId") REFERENCES "OrgUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_positionProfileId_fkey" FOREIGN KEY ("positionProfileId") REFERENCES "PositionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_positionSubLevelId_fkey" FOREIGN KEY ("positionSubLevelId") REFERENCES "PositionSubLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_salaryGradeId_fkey" FOREIGN KEY ("salaryGradeId") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_salaryGradeStepId_fkey" FOREIGN KEY ("salaryGradeStepId") REFERENCES "SalaryGradeStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_supervisorPositionId_fkey" FOREIGN KEY ("supervisorPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAssignment" ADD CONSTRAINT "PositionAssignment_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAssignment" ADD CONSTRAINT "PositionAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_primaryPositionAssignmentId_fkey" FOREIGN KEY ("primaryPositionAssignmentId") REFERENCES "PositionAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_positionAssignmentId_fkey" FOREIGN KEY ("positionAssignmentId") REFERENCES "PositionAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_payScheduleId_fkey" FOREIGN KEY ("payScheduleId") REFERENCES "SalaryGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationRecord" ADD CONSTRAINT "EducationRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRecord" ADD CONSTRAINT "ExamRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistoryRecord" ADD CONSTRAINT "EmploymentHistoryRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferenceContact" ADD CONSTRAINT "ReferenceContact_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PisField" ADD CONSTRAINT "PisField_pisTabId_fkey" FOREIGN KEY ("pisTabId") REFERENCES "PisTab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PisFieldOption" ADD CONSTRAINT "PisFieldOption_pisFieldId_fkey" FOREIGN KEY ("pisFieldId") REFERENCES "PisField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PisFieldPolicy" ADD CONSTRAINT "PisFieldPolicy_pisFieldId_fkey" FOREIGN KEY ("pisFieldId") REFERENCES "PisField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeFieldValue" ADD CONSTRAINT "EmployeeFieldValue_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeFieldValue" ADD CONSTRAINT "EmployeeFieldValue_pisFieldId_fkey" FOREIGN KEY ("pisFieldId") REFERENCES "PisField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeFieldValueHistory" ADD CONSTRAINT "EmployeeFieldValueHistory_employeeFieldValueId_fkey" FOREIGN KEY ("employeeFieldValueId") REFERENCES "EmployeeFieldValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOnboardingRecord" ADD CONSTRAINT "EmployeeOnboardingRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOffboardingRecord" ADD CONSTRAINT "EmployeeOffboardingRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PafRecord" ADD CONSTRAINT "PafRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PafRecord" ADD CONSTRAINT "PafRecord_approvalSetupId_fkey" FOREIGN KEY ("approvalSetupId") REFERENCES "ApprovalSetup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PafRecord" ADD CONSTRAINT "PafRecord_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLoaRecord" ADD CONSTRAINT "EmployeeLoaRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLoaRecord" ADD CONSTRAINT "EmployeeLoaRecord_pafRecordId_fkey" FOREIGN KEY ("pafRecordId") REFERENCES "PafRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfileHistory" ADD CONSTRAINT "EmployeeProfileHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfileHistory" ADD CONSTRAINT "EmployeeProfileHistory_pafRecordId_fkey" FOREIGN KEY ("pafRecordId") REFERENCES "PafRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaVersion" ADD CONSTRAINT "FormulaVersion_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "Formula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningComponent" ADD CONSTRAINT "EarningComponent_formulaVersionId_fkey" FOREIGN KEY ("formulaVersionId") REFERENCES "FormulaVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningTemplateFamily" ADD CONSTRAINT "EarningTemplateFamily_baseEarningTemplateFamilyId_fkey" FOREIGN KEY ("baseEarningTemplateFamilyId") REFERENCES "EarningTemplateFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningTemplateFamilyScope" ADD CONSTRAINT "EarningTemplateFamilyScope_earningTemplateFamilyId_fkey" FOREIGN KEY ("earningTemplateFamilyId") REFERENCES "EarningTemplateFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningTemplateRevision" ADD CONSTRAINT "EarningTemplateRevision_earningTemplateFamilyId_fkey" FOREIGN KEY ("earningTemplateFamilyId") REFERENCES "EarningTemplateFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningTemplateRevisionLine" ADD CONSTRAINT "EarningTemplateRevisionLine_earningTemplateRevisionId_fkey" FOREIGN KEY ("earningTemplateRevisionId") REFERENCES "EarningTemplateRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningTemplateRevisionLine" ADD CONSTRAINT "EarningTemplateRevisionLine_earningComponentId_fkey" FOREIGN KEY ("earningComponentId") REFERENCES "EarningComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePayProfile" ADD CONSTRAINT "EmployeePayProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePayProfile" ADD CONSTRAINT "EmployeePayProfile_earningTemplateFamilyId_fkey" FOREIGN KEY ("earningTemplateFamilyId") REFERENCES "EarningTemplateFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePayProfile" ADD CONSTRAINT "EmployeePayProfile_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverSequence" ADD CONSTRAINT "ApproverSequence_approvalSetupId_fkey" FOREIGN KEY ("approvalSetupId") REFERENCES "ApprovalSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverSequence" ADD CONSTRAINT "ApproverSequence_approverRoleId_fkey" FOREIGN KEY ("approverRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverSequence" ADD CONSTRAINT "ApproverSequence_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverSequence" ADD CONSTRAINT "ApproverSequence_approverPositionId_fkey" FOREIGN KEY ("approverPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalSequenceSecondaryApprover" ADD CONSTRAINT "ApprovalSequenceSecondaryApprover_approverSequenceId_fkey" FOREIGN KEY ("approverSequenceId") REFERENCES "ApproverSequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalSequenceSecondaryApprover" ADD CONSTRAINT "ApprovalSequenceSecondaryApprover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalSequenceSecondaryApprover" ADD CONSTRAINT "ApprovalSequenceSecondaryApprover_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalSequenceSecondaryApprover" ADD CONSTRAINT "ApprovalSequenceSecondaryApprover_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalDelegation" ADD CONSTRAINT "ApprovalDelegation_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalDelegation" ADD CONSTRAINT "ApprovalDelegation_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAssignment" ADD CONSTRAINT "WorkflowAssignment_approvalSetupId_fkey" FOREIGN KEY ("approvalSetupId") REFERENCES "ApprovalSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvalSetupId_fkey" FOREIGN KEY ("approvalSetupId") REFERENCES "ApprovalSetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflow" ADD CONSTRAINT "ApprovalWorkflow_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflow" ADD CONSTRAINT "ApprovalWorkflow_approverSequenceId_fkey" FOREIGN KEY ("approverSequenceId") REFERENCES "ApproverSequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflow" ADD CONSTRAINT "ApprovalWorkflow_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflowNote" ADD CONSTRAINT "ApprovalWorkflowNote_approvalWorkflowId_fkey" FOREIGN KEY ("approvalWorkflowId") REFERENCES "ApprovalWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflowNote" ADD CONSTRAINT "ApprovalWorkflowNote_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

