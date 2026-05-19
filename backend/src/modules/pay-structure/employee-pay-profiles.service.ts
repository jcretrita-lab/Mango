import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  assertDateOrder,
  assertNonEmptyPayload,
  assertRecordExists,
  assertRequiredFields,
  auditWrite,
  pickDefinedFields,
  requireActor,
  type WriteDelegate,
  type WritePayload,
} from '../../common/api/domain-write.helpers';
import type { ReadModelName } from '../../common/api/read-resource.types';
import { projectApiRecord } from '../../common/api/response-projection';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PrismaService } from '../../core/prisma/prisma.service';

export interface UpdateEmployeePayProfilePayload {
  earningTemplateFamilyId?: number;
  payBasis?: string;
  effectiveStartDate?: Date;
  effectiveEndDate?: Date | null;
  status?: string;
  notes?: string;
}

@Injectable()
export class EmployeePayProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  createSalaryGrade(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('salaryGrade', 'SalaryGrade', data, actor, {
      eventType: 'PAY_SALARY_GRADE_CREATED',
      allowedFields: [
        'code',
        'name',
        'rateType',
        'minSalary',
        'maxSalary',
        'currency',
        'status',
      ],
      requiredFields: ['code', 'name', 'rateType'],
    });
  }

  updateSalaryGrade(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('salaryGrade', 'SalaryGrade', id, data, actor, {
      eventType: 'PAY_SALARY_GRADE_UPDATED',
      allowedFields: [
        'code',
        'name',
        'rateType',
        'minSalary',
        'maxSalary',
        'currency',
        'status',
      ],
    });
  }

  createSalaryGradeStep(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'salaryGradeStep',
      'SalaryGradeStep',
      data,
      actor,
      {
        eventType: 'PAY_SALARY_GRADE_STEP_CREATED',
        allowedFields: ['salaryGradeId', 'stepNumber', 'name', 'amount'],
        requiredFields: ['salaryGradeId', 'stepNumber', 'name', 'amount'],
      },
    );
  }

  updateSalaryGradeStep(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'salaryGradeStep',
      'SalaryGradeStep',
      id,
      data,
      actor,
      {
        eventType: 'PAY_SALARY_GRADE_STEP_UPDATED',
        allowedFields: ['salaryGradeId', 'stepNumber', 'name', 'amount'],
      },
    );
  }

  createFormula(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('formula', 'Formula', data, actor, {
      eventType: 'PAY_FORMULA_CREATED',
      allowedFields: ['code', 'name', 'expression', 'description', 'status'],
      requiredFields: ['code', 'name', 'expression'],
    });
  }

  updateFormula(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('formula', 'Formula', id, data, actor, {
      eventType: 'PAY_FORMULA_UPDATED',
      allowedFields: ['code', 'name', 'expression', 'description', 'status'],
    });
  }

  createFormulaVersion(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'effectiveStartDate', 'effectiveEndDate');

    return this.createCurrentVersionRecord(
      'formulaVersion',
      'FormulaVersion',
      data,
      actor,
      {
        eventType: 'PAY_FORMULA_VERSION_CREATED',
        currentWhereField: 'formulaId',
        allowedFields: [
          'formulaId',
          'versionNo',
          'expression',
          'effectiveStartDate',
          'effectiveEndDate',
          'isCurrent',
          'changeSummary',
        ],
        requiredFields: [
          'formulaId',
          'versionNo',
          'expression',
          'effectiveStartDate',
        ],
      },
    );
  }

  createEarningComponent(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'earningComponent',
      'EarningComponent',
      data,
      actor,
      {
        eventType: 'PAY_EARNING_COMPONENT_CREATED',
        allowedFields: [
          'code',
          'name',
          'category',
          'valueSource',
          'orgReferenceType',
          'fixedAmount',
          'formulaVersionId',
          'lookupTableVersionId',
          'isTaxableDefault',
          'includeIn13thMonthDefault',
          'status',
          'isSystem',
          'description',
        ],
        requiredFields: ['code', 'name', 'category', 'valueSource'],
      },
    );
  }

  updateEarningComponent(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningComponent',
      'EarningComponent',
      id,
      data,
      actor,
      {
        eventType: 'PAY_EARNING_COMPONENT_UPDATED',
        allowedFields: [
          'code',
          'name',
          'category',
          'valueSource',
          'orgReferenceType',
          'fixedAmount',
          'formulaVersionId',
          'lookupTableVersionId',
          'isTaxableDefault',
          'includeIn13thMonthDefault',
          'status',
          'isSystem',
          'description',
        ],
      },
    );
  }

  createEarningTemplateFamily(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'earningTemplateFamily',
      'EarningTemplateFamily',
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_FAMILY_CREATED',
        allowedFields: [
          'baseEarningTemplateFamilyId',
          'code',
          'name',
          'templateKind',
          'showInDefaultPicker',
          'payBasisApplicability',
          'status',
          'description',
        ],
        requiredFields: [
          'code',
          'name',
          'templateKind',
          'payBasisApplicability',
        ],
      },
    );
  }

  createEarningTemplateRevision(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'effectiveStartDate', 'effectiveEndDate');

    return this.createCurrentVersionRecord(
      'earningTemplateRevision',
      'EarningTemplateRevision',
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_REVISION_CREATED',
        currentWhereField: 'earningTemplateFamilyId',
        allowedFields: [
          'earningTemplateFamilyId',
          'versionNo',
          'currencyCode',
          'effectiveStartDate',
          'effectiveEndDate',
          'isCurrent',
          'changeSummary',
        ],
        requiredFields: [
          'earningTemplateFamilyId',
          'versionNo',
          'effectiveStartDate',
        ],
      },
    );
  }

  createEarningTemplateRevisionLine(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'earningTemplateRevisionLine',
      'EarningTemplateRevisionLine',
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_REVISION_LINE_CREATED',
        allowedFields: [
          'earningTemplateRevisionId',
          'earningComponentId',
          'sortOrder',
          'isRequired',
        ],
        requiredFields: ['earningTemplateRevisionId', 'earningComponentId'],
      },
    );
  }

  createPayProfile(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'effectiveStartDate', 'effectiveEndDate');

    return this.createRecord(
      'employeePayProfile',
      'EmployeePayProfile',
      data,
      actor,
      {
        eventType: 'PAY_PROFILE_CREATED',
        allowedFields: [
          'employeeId',
          'earningTemplateFamilyId',
          'payScheduleId',
          'approvalRequestId',
          'payBasis',
          'effectiveStartDate',
          'effectiveEndDate',
          'status',
          'notes',
        ],
        requiredFields: [
          'employeeId',
          'earningTemplateFamilyId',
          'payBasis',
          'effectiveStartDate',
        ],
      },
    );
  }

  async updatePayProfile(
    id: number,
    data: UpdateEmployeePayProfilePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    if (
      data.effectiveStartDate &&
      data.effectiveEndDate &&
      data.effectiveEndDate < data.effectiveStartDate
    ) {
      throw new BadRequestException(
        'effectiveEndDate must be on or after effectiveStartDate.',
      );
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter((entry) => entry[1] !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'No supported pay profile fields provided.',
      );
    }

    const profile = await this.prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.employeePayProfile.update({
        where: { id },
        data: {
          ...updateData,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'PAY_PROFILE_UPDATED',
          entityType: 'EmployeePayProfile',
          entityId: String(updatedProfile.id),
          metadataJson: { employeeId: updatedProfile.employeeId },
        },
      });

      return updatedProfile;
    });

    return projectApiRecord('employeePayProfile', profile, requestActor);
  }

  private async createCurrentVersionRecord(
    model: ReadModelName,
    entityType: string,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteOptions & { currentWhereField: string },
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, options.allowedFields);
    assertRequiredFields(payload, options.requiredFields ?? [], entityType);

    if (data.isCurrent === true || data.isCurrent === undefined) {
      const ownerId = data[options.currentWhereField];

      if (!ownerId) {
        throw new BadRequestException(
          `${options.currentWhereField} is required.`,
        );
      }
    }

    const record = await this.prisma.$transaction(async (tx) => {
      if (data.isCurrent === true || data.isCurrent === undefined) {
        await this.getDelegate(tx, model).updateMany({
          where: {
            [options.currentWhereField]: data[options.currentWhereField],
            isCurrent: true,
          },
          data: {
            isCurrent: false,
            updatedBy: requestActor.backendUserId,
          },
        });
      }

      const saved = (await this.getDelegate(tx, model).create({
        data: {
          ...payload,
          isCurrent: payload.isCurrent ?? true,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number };

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        entityType,
        saved.id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
  }

  private async createRecord(
    model: ReadModelName,
    entityType: string,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, options.allowedFields);
    assertRequiredFields(payload, options.requiredFields ?? [], entityType);

    const record = await this.prisma.$transaction(async (tx) => {
      const saved = (await this.getDelegate(tx, model).create({
        data: {
          ...payload,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number };

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        entityType,
        saved.id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
  }

  private async updateRecord(
    model: ReadModelName,
    entityType: string,
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, options.allowedFields);
    assertNonEmptyPayload(payload);

    const record = await this.prisma.$transaction(async (tx) => {
      const delegate = this.getDelegate(tx, model);
      await assertRecordExists(delegate, id, entityType);
      const saved = (await delegate.update({
        where: { id },
        data: {
          ...payload,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number };

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        entityType,
        saved.id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
  }

  private getDelegate(
    tx: Prisma.TransactionClient,
    model: ReadModelName,
  ): WriteDelegate {
    return tx[model] as unknown as WriteDelegate;
  }
}

interface WriteOptions {
  readonly eventType: string;
  readonly allowedFields: readonly string[];
  readonly requiredFields?: readonly string[];
}
