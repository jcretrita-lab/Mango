import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
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
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
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

  updateSalaryGradeStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'salaryGrade',
      'SalaryGrade',
      id,
      { status: this.readStatus(data) },
      actor,
      {
        eventType: 'PAY_SALARY_GRADE_STATUS_UPDATED',
        allowedFields: ['status'],
      },
    );
  }

  async deleteSalaryGrade(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const result = await this.prisma.$transaction(async (tx) => {
      const grade = await tx.salaryGrade.findUnique({ where: { id } });
      if (!grade) {
        throw new BadRequestException(`SalaryGrade ${id} was not found.`);
      }

      const referenceCount =
        (await tx.salaryGradeStep.count({ where: { salaryGradeId: id } })) +
        (await tx.positionProfile.count({
          where: { defaultSalaryGradeId: id },
        })) +
        (await tx.positionSubLevel.count({ where: { salaryGradeId: id } })) +
        (await tx.position.count({ where: { salaryGradeId: id } })) +
        (await tx.employment.count({ where: { payScheduleId: id } }));

      if (referenceCount > 0) {
        const saved = await tx.salaryGrade.update({
          where: { id },
          data: {
            status: 'INACTIVE',
            updatedBy: requestActor.backendUserId,
          },
        });
        await auditWrite(
          tx.auditEvent,
          requestActor.backendUserId,
          'PAY_SALARY_GRADE_DEACTIVATED',
          'SalaryGrade',
          saved.id,
        );

        return { id, deleted: false, status: saved.status };
      }

      await tx.salaryGrade.delete({ where: { id } });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAY_SALARY_GRADE_DELETED',
        'SalaryGrade',
        id,
      );

      return { id, deleted: true };
    });

    return result;
  }

  async findSalaryGradeStepsByGrade(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    await assertRecordExists(
      this.prisma.salaryGrade as unknown as WriteDelegate,
      id,
      'SalaryGrade',
    );

    const steps = await this.prisma.salaryGradeStep.findMany({
      where: { salaryGradeId: id },
      orderBy: { stepNumber: 'asc' },
    });

    return {
      data: steps.map((step) =>
        projectApiRecord('salaryGradeStep', step, actor),
      ),
      total: steps.length,
    };
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

  async deleteSalaryGradeStep(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    await this.prisma.$transaction(async (tx) => {
      const step = await tx.salaryGradeStep.findUnique({ where: { id } });
      if (!step) {
        throw new BadRequestException(`SalaryGradeStep ${id} was not found.`);
      }

      const positionCount = await tx.position.count({
        where: { salaryGradeStepId: id },
      });
      if (positionCount > 0) {
        throw new BadRequestException(
          'Cannot delete salary grade step while it is used by positions.',
        );
      }

      await tx.salaryGradeStep.delete({ where: { id } });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAY_SALARY_GRADE_STEP_DELETED',
        'SalaryGradeStep',
        id,
      );
    });

    return { id, deleted: true };
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

  updateFormulaStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'formula',
      'Formula',
      id,
      { status: this.readStatus(data) },
      actor,
      {
        eventType: 'PAY_FORMULA_STATUS_UPDATED',
        allowedFields: ['status'],
      },
    );
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

  setCurrentFormulaVersion(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.setCurrentVersion(
      'formulaVersion',
      'FormulaVersion',
      id,
      actor,
      {
        ownerField: 'formulaId',
        eventType: 'PAY_FORMULA_VERSION_SET_CURRENT',
      },
    );
  }

  async findFormulaAsOf(
    id: number,
    dateValue: unknown,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const asOf = this.readDate(dateValue, 'date');
    const formula = await this.prisma.formula.findUnique({ where: { id } });

    if (!formula) {
      throw new NotFoundException(`Formula ${id} was not found.`);
    }

    const version = await this.prisma.formulaVersion.findFirst({
      where: {
        formulaId: id,
        effectiveStartDate: { lte: asOf },
        OR: [{ effectiveEndDate: null }, { effectiveEndDate: { gte: asOf } }],
      },
      orderBy: { effectiveStartDate: 'desc' },
    });

    if (!version) {
      throw new NotFoundException(
        `Formula ${id} has no version effective on ${asOf.toISOString()}.`,
      );
    }

    return {
      formula: projectApiRecord('formula', formula, actor),
      version: projectApiRecord('formulaVersion', version, actor),
      asOf: asOf.toISOString(),
    };
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

  updateEarningComponentStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningComponent',
      'EarningComponent',
      id,
      { status: this.readStatus(data) },
      actor,
      {
        eventType: 'PAY_EARNING_COMPONENT_STATUS_UPDATED',
        allowedFields: ['status'],
      },
    );
  }

  async resolveEarningComponent(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    requireActor(actor);
    const component = await this.prisma.earningComponent.findUnique({
      where: { id },
    });

    if (!component) {
      throw new NotFoundException(`EarningComponent ${id} was not found.`);
    }

    if (component.lookupTableVersionId) {
      throw new BadRequestException(
        'Lookup table resolution is not available until lookup table schema is implemented.',
      );
    }

    if (component.fixedAmount !== null && component.fixedAmount !== undefined) {
      return {
        earningComponentId: id,
        valueSource: component.valueSource,
        amount: this.decimalToNumber(component.fixedAmount),
        trace: ['Resolved from fixedAmount.'],
      };
    }

    if (!component.formulaVersionId) {
      throw new BadRequestException(
        'Earning component has no fixed amount or formula version to resolve.',
      );
    }

    const version = await this.prisma.formulaVersion.findUnique({
      where: { id: component.formulaVersionId },
    });

    if (!version) {
      throw new NotFoundException(
        `FormulaVersion ${component.formulaVersionId} was not found.`,
      );
    }

    const variables = this.readVariables(data.variables ?? data);
    const amount = this.evaluateFormulaExpression(
      version.expression,
      variables,
    );

    return {
      earningComponentId: id,
      formulaVersionId: version.id,
      valueSource: component.valueSource,
      amount,
      variables,
      trace: [`Resolved from formula version ${version.versionNo}.`],
    };
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

  updateEarningTemplateFamily(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningTemplateFamily',
      'EarningTemplateFamily',
      id,
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_FAMILY_UPDATED',
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
      },
    );
  }

  updateEarningTemplateFamilyStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningTemplateFamily',
      'EarningTemplateFamily',
      id,
      { status: this.readStatus(data) },
      actor,
      {
        eventType: 'PAY_TEMPLATE_FAMILY_STATUS_UPDATED',
        allowedFields: ['status'],
      },
    );
  }

  async createEarningTemplateFamilyVariant(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    await assertRecordExists(
      this.prisma.earningTemplateFamily as unknown as WriteDelegate,
      id,
      'EarningTemplateFamily',
    );

    return this.createEarningTemplateFamily(
      {
        ...data,
        baseEarningTemplateFamilyId: id,
        templateKind: data.templateKind ?? 'VARIANT',
      },
      actor,
    );
  }

  createEarningTemplateFamilyScope(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'earningTemplateFamilyScope',
      'EarningTemplateFamilyScope',
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_SCOPE_CREATED',
        allowedFields: [
          'earningTemplateFamilyId',
          'scopeType',
          'scopeRefId',
          'isPrimary',
          'notes',
        ],
        requiredFields: ['earningTemplateFamilyId', 'scopeType'],
        beforeCreate: async (tx, payload, requestActor) => {
          if (payload.isPrimary === true) {
            await this.clearPrimaryTemplateScopes(
              tx,
              Number(payload.earningTemplateFamilyId),
              requestActor.backendUserId,
            );
          }
        },
      },
    );
  }

  updateEarningTemplateFamilyScope(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningTemplateFamilyScope',
      'EarningTemplateFamilyScope',
      id,
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_SCOPE_UPDATED',
        allowedFields: [
          'earningTemplateFamilyId',
          'scopeType',
          'scopeRefId',
          'isPrimary',
          'notes',
        ],
        beforeUpdate: async (tx, payload, requestActor, existing) => {
          if (payload.isPrimary === true) {
            const familyId = Number(
              payload.earningTemplateFamilyId ??
                (existing as { earningTemplateFamilyId: number })
                  .earningTemplateFamilyId,
            );
            await this.clearPrimaryTemplateScopes(
              tx,
              familyId,
              requestActor.backendUserId,
              id,
            );
          }
        },
      },
    );
  }

  async setPrimaryEarningTemplateFamilyScope(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const scope = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.earningTemplateFamilyScope.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(
          `EarningTemplateFamilyScope ${id} was not found.`,
        );
      }

      await this.clearPrimaryTemplateScopes(
        tx,
        existing.earningTemplateFamilyId,
        requestActor.backendUserId,
        id,
      );

      const saved = await tx.earningTemplateFamilyScope.update({
        where: { id },
        data: { isPrimary: true, updatedBy: requestActor.backendUserId },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAY_TEMPLATE_SCOPE_SET_PRIMARY',
        'EarningTemplateFamilyScope',
        saved.id,
      );

      return saved;
    });

    return projectApiRecord('earningTemplateFamilyScope', scope, requestActor);
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

  async findCurrentEarningTemplateRevision(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    await assertRecordExists(
      this.prisma.earningTemplateFamily as unknown as WriteDelegate,
      id,
      'EarningTemplateFamily',
    );
    const revision = await this.prisma.earningTemplateRevision.findFirst({
      where: { earningTemplateFamilyId: id, isCurrent: true },
      orderBy: { effectiveStartDate: 'desc' },
    });

    if (!revision) {
      throw new NotFoundException(
        `EarningTemplateFamily ${id} has no current revision.`,
      );
    }

    return projectApiRecord('earningTemplateRevision', revision, actor);
  }

  setCurrentEarningTemplateRevision(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.setCurrentVersion(
      'earningTemplateRevision',
      'EarningTemplateRevision',
      id,
      actor,
      {
        ownerField: 'earningTemplateFamilyId',
        eventType: 'PAY_TEMPLATE_REVISION_SET_CURRENT',
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

  updateEarningTemplateRevisionLine(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'earningTemplateRevisionLine',
      'EarningTemplateRevisionLine',
      id,
      data,
      actor,
      {
        eventType: 'PAY_TEMPLATE_REVISION_LINE_UPDATED',
        allowedFields: [
          'earningTemplateRevisionId',
          'earningComponentId',
          'sortOrder',
          'isRequired',
        ],
      },
    );
  }

  async deleteEarningTemplateRevisionLine(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    await this.prisma.$transaction(async (tx) => {
      await assertRecordExists(
        tx.earningTemplateRevisionLine as unknown as WriteDelegate,
        id,
        'EarningTemplateRevisionLine',
      );
      await tx.earningTemplateRevisionLine.delete({ where: { id } });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAY_TEMPLATE_REVISION_LINE_DELETED',
        'EarningTemplateRevisionLine',
        id,
      );
    });

    return { id, deleted: true };
  }

  async reorderEarningTemplateRevisionLines(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const lines = this.readLineOrder(data);

    const updated = await this.prisma.$transaction(async (tx) => {
      await assertRecordExists(
        tx.earningTemplateRevision as unknown as WriteDelegate,
        id,
        'EarningTemplateRevision',
      );

      for (const line of lines) {
        const existing = await tx.earningTemplateRevisionLine.findUnique({
          where: { id: line.id },
        });

        if (!existing || existing.earningTemplateRevisionId !== id) {
          throw new BadRequestException(
            `Line ${line.id} does not belong to earning template revision ${id}.`,
          );
        }

        await tx.earningTemplateRevisionLine.update({
          where: { id: line.id },
          data: {
            sortOrder: line.sortOrder,
            updatedBy: requestActor.backendUserId,
          },
        });
      }

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAY_TEMPLATE_REVISION_LINES_REORDERED',
        'EarningTemplateRevision',
        id,
        { lines },
      );

      return tx.earningTemplateRevisionLine.findMany({
        where: { earningTemplateRevisionId: id },
        orderBy: { sortOrder: 'asc' },
      });
    });

    return {
      data: updated.map((line) =>
        projectApiRecord('earningTemplateRevisionLine', line, requestActor),
      ),
    };
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

  endPayProfile(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'employeePayProfile',
      'EmployeePayProfile',
      id,
      {
        effectiveEndDate: this.readDate(
          data.effectiveEndDate,
          'effectiveEndDate',
        ),
        status: data.status ?? 'ENDED',
      },
      actor,
      {
        eventType: 'PAY_PROFILE_ENDED',
        allowedFields: ['effectiveEndDate', 'status'],
      },
    );
  }

  async findCurrentEmployeePayProfile(
    employeeId: number,
    dateValue: unknown,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const hasGlobalRead = requestActor.permissions.includes(
      PERMISSION_CODES.PAY_STRUCTURE_READ,
    );

    if (!hasGlobalRead && requestActor.employeeId !== String(employeeId)) {
      throw new ForbiddenException(
        'Employee pay profile is outside the current employee scope.',
      );
    }

    const asOf = this.readDate(dateValue, 'date', new Date());
    const profile = await this.prisma.employeePayProfile.findFirst({
      where: {
        employeeId,
        status: 'ACTIVE',
        effectiveStartDate: { lte: asOf },
        OR: [{ effectiveEndDate: null }, { effectiveEndDate: { gte: asOf } }],
      },
      orderBy: { effectiveStartDate: 'desc' },
    });

    if (!profile) {
      throw new NotFoundException(
        `Employee ${employeeId} has no active pay profile on ${asOf.toISOString()}.`,
      );
    }

    return {
      profile: projectApiRecord('employeePayProfile', profile, requestActor),
      asOf: asOf.toISOString(),
    };
  }

  private readStatus(data: WritePayload): string {
    const value = data.status ?? data.isActive;

    if (typeof value === 'boolean') {
      return value ? 'ACTIVE' : 'INACTIVE';
    }

    if (typeof value === 'string' && value.trim()) {
      const normalized = value.trim().toUpperCase();
      if (['ACTIVE', 'INACTIVE', 'ENDED', 'DRAFT'].includes(normalized)) {
        return normalized;
      }
    }

    throw new BadRequestException(
      'status must be ACTIVE, INACTIVE, ENDED, or DRAFT.',
    );
  }

  private readPositiveInteger(value: unknown, field: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${field} must be a positive integer.`);
    }

    return parsed;
  }

  private readDate(value: unknown, field: string, fallback?: Date): Date {
    let candidate: unknown = value;
    if (Array.isArray(value)) {
      candidate = value[0];
    }

    if (candidate === undefined || candidate === null || candidate === '') {
      if (fallback) {
        return fallback;
      }

      throw new BadRequestException(`${field} is required.`);
    }

    const date =
      candidate instanceof Date
        ? candidate
        : typeof candidate === 'string' || typeof candidate === 'number'
          ? new Date(candidate)
          : undefined;

    if (!date || Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} must be a valid date.`);
    }

    return date;
  }

  private decimalToNumber(value: unknown): number {
    return Number(value?.toString() ?? 0);
  }

  private readVariables(value: unknown): Record<string, number> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('variables must be an object.');
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'variables')
        .map(([key, entryValue]) => {
          const parsed = Number(entryValue);

          if (!Number.isFinite(parsed)) {
            throw new BadRequestException(
              `Formula variable ${key} must be numeric.`,
            );
          }

          return [key, parsed];
        }),
    );
  }

  private evaluateFormulaExpression(
    expression: string,
    variables: Record<string, number>,
  ): number {
    const tokens = this.tokenizeExpression(expression, variables);
    let index = 0;

    const parseExpression = (): number => {
      let value = parseTerm();

      while (tokens[index] === '+' || tokens[index] === '-') {
        const operator = tokens[index++];
        const right = parseTerm();
        value = operator === '+' ? value + right : value - right;
      }

      return value;
    };

    const parseTerm = (): number => {
      let value = parseFactor();

      while (tokens[index] === '*' || tokens[index] === '/') {
        const operator = tokens[index++];
        const right = parseFactor();
        value = operator === '*' ? value * right : value / right;
      }

      return value;
    };

    const parseFactor = (): number => {
      const token = tokens[index++];

      if (token === '(') {
        const value = parseExpression();
        if (tokens[index++] !== ')') {
          throw new BadRequestException(
            'Formula expression has unmatched parentheses.',
          );
        }
        return value;
      }

      if (token === '-') {
        return -parseFactor();
      }

      const parsed = Number(token);
      if (!Number.isFinite(parsed)) {
        throw new BadRequestException(
          `Formula token ${String(token)} is invalid.`,
        );
      }

      return parsed;
    };

    const result = parseExpression();
    if (index !== tokens.length) {
      throw new BadRequestException(
        'Formula expression contains unsupported syntax.',
      );
    }

    return result;
  }

  private tokenizeExpression(
    expression: string,
    variables: Record<string, number>,
  ): string[] {
    const tokens: string[] = [];
    let index = 0;

    while (index < expression.length) {
      const char = expression[index];

      if (/\s/.test(char)) {
        index += 1;
        continue;
      }

      if ('+-*/()'.includes(char)) {
        tokens.push(char);
        index += 1;
        continue;
      }

      const numberMatch = expression.slice(index).match(/^\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push(numberMatch[0]);
        index += numberMatch[0].length;
        continue;
      }

      const variableMatch = expression
        .slice(index)
        .match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (variableMatch) {
        const variableName = variableMatch[0];
        const variableValue = variables[variableName];
        if (variableValue === undefined) {
          throw new BadRequestException(
            `Formula variable ${variableName} was not provided.`,
          );
        }
        tokens.push(String(variableValue));
        index += variableName.length;
        continue;
      }

      throw new BadRequestException(
        'Formula expression contains unsupported characters.',
      );
    }

    return tokens;
  }

  private readLineOrder(
    data: WritePayload,
  ): Array<{ id: number; sortOrder: number }> {
    const rawLines = data.lines;

    if (!Array.isArray(rawLines) || rawLines.length === 0) {
      throw new BadRequestException('lines must be a non-empty array.');
    }

    return rawLines.map((line, index) => {
      if (!line || typeof line !== 'object' || Array.isArray(line)) {
        throw new BadRequestException('Each line must be an object.');
      }

      const record = line as Record<string, unknown>;
      return {
        id: this.readPositiveInteger(record.id, 'line.id'),
        sortOrder:
          record.sortOrder === undefined
            ? index + 1
            : this.readPositiveInteger(record.sortOrder, 'line.sortOrder'),
      };
    });
  }

  private async clearPrimaryTemplateScopes(
    tx: Prisma.TransactionClient,
    earningTemplateFamilyId: number,
    actorUserId: number,
    exceptId?: number,
  ) {
    await tx.earningTemplateFamilyScope.updateMany({
      where: {
        earningTemplateFamilyId,
        isPrimary: true,
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      data: { isPrimary: false, updatedBy: actorUserId },
    });
  }

  private async setCurrentVersion(
    model: 'formulaVersion' | 'earningTemplateRevision',
    entityType: 'FormulaVersion' | 'EarningTemplateRevision',
    id: number,
    actor: AuthenticatedRequestUser | undefined,
    options: {
      ownerField: 'formulaId' | 'earningTemplateFamilyId';
      eventType: string;
    },
  ) {
    const requestActor = requireActor(actor);

    const record = await this.prisma.$transaction(async (tx) => {
      const delegate = this.getDelegate(tx, model);
      const existing = await delegate.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException(`${entityType} ${id} was not found.`);
      }

      const ownerId = (existing as Record<string, unknown>)[options.ownerField];
      await delegate.updateMany({
        where: { [options.ownerField]: ownerId, isCurrent: true },
        data: { isCurrent: false, updatedBy: requestActor.backendUserId },
      });
      const saved = await delegate.update({
        where: { id },
        data: { isCurrent: true, updatedBy: requestActor.backendUserId },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        entityType,
        id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
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
      if (options.beforeCreate) {
        await options.beforeCreate(tx, payload, requestActor);
      }

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
      const existing = await delegate.findUnique({ where: { id } });

      if (options.beforeUpdate) {
        await options.beforeUpdate(tx, payload, requestActor, existing);
      }

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
  readonly beforeCreate?: (
    tx: Prisma.TransactionClient,
    payload: WritePayload,
    actor: AuthenticatedRequestUser,
  ) => Promise<void>;
  readonly beforeUpdate?: (
    tx: Prisma.TransactionClient,
    payload: WritePayload,
    actor: AuthenticatedRequestUser,
    existing: unknown,
  ) => Promise<void>;
}
