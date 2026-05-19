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

interface EmployeeProfileUpdatePayload {
  civilStatus?: string;
  residentialAddress?: string;
  bankName?: string;
}

interface EmployeeFieldValueUpdatePayload {
  valueJson: unknown;
  changeReason?: string;
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  createEmployee(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('employee', 'Employee', data, actor, {
      eventType: 'PERSONNEL_EMPLOYEE_CREATED',
      allowedFields: [
        'employeeNumber',
        'firstName',
        'lastName',
        'displayName',
        'orgUnitJson',
        'roleTitle',
        'email',
        'phone',
        'status',
        'jobType',
        'avatarUrl',
        'primaryPositionAssignmentId',
      ],
      requiredFields: [
        'employeeNumber',
        'firstName',
        'lastName',
        'displayName',
        'email',
        'status',
        'jobType',
      ],
    });
  }

  updateEmployee(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('employee', 'Employee', id, data, actor, {
      eventType: 'PERSONNEL_EMPLOYEE_UPDATED',
      allowedFields: [
        'firstName',
        'lastName',
        'displayName',
        'orgUnitJson',
        'roleTitle',
        'email',
        'phone',
        'status',
        'jobType',
        'avatarUrl',
        'primaryPositionAssignmentId',
      ],
    });
  }

  createEmployment(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

    return this.createRecord('employment', 'Employment', data, actor, {
      eventType: 'PERSONNEL_EMPLOYMENT_CREATED',
      allowedFields: [
        'employeeId',
        'positionAssignmentId',
        'status',
        'jobType',
        'payScheduleId',
        'startDate',
        'endDate',
        'remarks',
      ],
      requiredFields: ['employeeId', 'status', 'jobType', 'startDate'],
    });
  }

  updateEmployment(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

    return this.updateRecord('employment', 'Employment', id, data, actor, {
      eventType: 'PERSONNEL_EMPLOYMENT_UPDATED',
      allowedFields: [
        'positionAssignmentId',
        'status',
        'jobType',
        'payScheduleId',
        'startDate',
        'endDate',
        'remarks',
      ],
    });
  }

  createEducationRecord(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'educationRecord',
      'EducationRecord',
      data,
      actor,
      {
        eventType: 'PERSONNEL_EDUCATION_RECORD_CREATED',
        allowedFields: [
          'employeeId',
          'attainment',
          'course',
          'school',
          'dateGraduated',
        ],
        requiredFields: ['employeeId', 'attainment', 'school'],
      },
    );
  }

  updateEducationRecord(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'educationRecord',
      'EducationRecord',
      id,
      data,
      actor,
      {
        eventType: 'PERSONNEL_EDUCATION_RECORD_UPDATED',
        allowedFields: ['attainment', 'course', 'school', 'dateGraduated'],
      },
    );
  }

  createExamRecord(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('examRecord', 'ExamRecord', data, actor, {
      eventType: 'PERSONNEL_EXAM_RECORD_CREATED',
      allowedFields: [
        'employeeId',
        'dateTaken',
        'name',
        'rating',
        'description',
      ],
      requiredFields: ['employeeId', 'name'],
    });
  }

  updateExamRecord(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('examRecord', 'ExamRecord', id, data, actor, {
      eventType: 'PERSONNEL_EXAM_RECORD_UPDATED',
      allowedFields: ['dateTaken', 'name', 'rating', 'description'],
    });
  }

  createFamilyMember(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('familyMember', 'FamilyMember', data, actor, {
      eventType: 'PERSONNEL_FAMILY_MEMBER_CREATED',
      allowedFields: [
        'employeeId',
        'relationship',
        'firstName',
        'lastName',
        'birthday',
        'occupation',
        'address',
      ],
      requiredFields: ['employeeId', 'relationship', 'firstName', 'lastName'],
    });
  }

  updateFamilyMember(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('familyMember', 'FamilyMember', id, data, actor, {
      eventType: 'PERSONNEL_FAMILY_MEMBER_UPDATED',
      allowedFields: [
        'relationship',
        'firstName',
        'lastName',
        'birthday',
        'occupation',
        'address',
      ],
    });
  }

  createEmergencyContact(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'emergencyContact',
      'EmergencyContact',
      data,
      actor,
      {
        eventType: 'PERSONNEL_EMERGENCY_CONTACT_CREATED',
        allowedFields: [
          'employeeId',
          'relationship',
          'firstName',
          'lastName',
          'contactNo',
          'email',
        ],
        requiredFields: ['employeeId', 'relationship', 'firstName', 'lastName'],
      },
    );
  }

  updateEmergencyContact(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'emergencyContact',
      'EmergencyContact',
      id,
      data,
      actor,
      {
        eventType: 'PERSONNEL_EMERGENCY_CONTACT_UPDATED',
        allowedFields: [
          'relationship',
          'firstName',
          'lastName',
          'contactNo',
          'email',
        ],
      },
    );
  }

  createReferenceContact(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'referenceContact',
      'ReferenceContact',
      data,
      actor,
      {
        eventType: 'PERSONNEL_REFERENCE_CONTACT_CREATED',
        allowedFields: [
          'employeeId',
          'firstName',
          'lastName',
          'position',
          'contactNo',
          'business',
          'address',
        ],
        requiredFields: ['employeeId', 'firstName', 'lastName'],
      },
    );
  }

  updateReferenceContact(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'referenceContact',
      'ReferenceContact',
      id,
      data,
      actor,
      {
        eventType: 'PERSONNEL_REFERENCE_CONTACT_UPDATED',
        allowedFields: [
          'firstName',
          'lastName',
          'position',
          'contactNo',
          'business',
          'address',
        ],
      },
    );
  }

  createPisField(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('pisField', 'PisField', data, actor, {
      eventType: 'PERSONNEL_PIS_FIELD_CREATED',
      allowedFields: [
        'pisTabId',
        'code',
        'label',
        'dataType',
        'validationRegex',
        'isSensitive',
        'sortOrder',
        'isSystem',
        'sourceTable',
        'sourceColumn',
        'placeholder',
        'helpText',
      ],
      requiredFields: ['pisTabId', 'code', 'label', 'dataType'],
    });
  }

  updatePisField(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('pisField', 'PisField', id, data, actor, {
      eventType: 'PERSONNEL_PIS_FIELD_UPDATED',
      allowedFields: [
        'label',
        'dataType',
        'validationRegex',
        'isSensitive',
        'sortOrder',
        'isSystem',
        'sourceTable',
        'sourceColumn',
        'placeholder',
        'helpText',
      ],
    });
  }

  async updateProfile(
    employeeId: number,
    data: EmployeeProfileUpdatePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const updateData = Object.fromEntries(
      Object.entries(data).filter((entry) => entry[1] !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No supported profile fields provided.');
    }

    const profile = await this.prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.employeeProfile.update({
        where: { employeeId },
        data: {
          ...updateData,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'PERSONNEL_PROFILE_UPDATED',
          entityType: 'EmployeeProfile',
          entityId: String(updatedProfile.id),
          metadataJson: { employeeId },
        },
      });

      return updatedProfile;
    });

    return projectApiRecord('employeeProfile', profile, requestActor);
  }

  async updateFieldValue(
    employeeId: number,
    fieldId: number,
    data: EmployeeFieldValueUpdatePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const valueJson = data.valueJson as Prisma.InputJsonValue;

    const fieldValue = await this.prisma.$transaction(async (tx) => {
      const existingValue = await tx.employeeFieldValue.findUnique({
        where: {
          employeeId_pisFieldId: {
            employeeId,
            pisFieldId: fieldId,
          },
        },
      });
      const savedValue = await tx.employeeFieldValue.upsert({
        where: {
          employeeId_pisFieldId: {
            employeeId,
            pisFieldId: fieldId,
          },
        },
        create: {
          employeeId,
          pisFieldId: fieldId,
          valueJson,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
        update: {
          valueJson,
          updatedBy: requestActor.backendUserId,
        },
      });

      if (existingValue) {
        await tx.employeeFieldValueHistory.create({
          data: {
            employeeFieldValueId: existingValue.id,
            previousValueJson: existingValue.valueJson ?? Prisma.JsonNull,
            changedBy: requestActor.backendUserId,
            changeReason: data.changeReason,
            createdBy: requestActor.backendUserId,
            updatedBy: requestActor.backendUserId,
          },
        });
      }

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'PERSONNEL_FIELD_VALUE_UPDATED',
          entityType: 'EmployeeFieldValue',
          entityId: String(savedValue.id),
          metadataJson: { employeeId, fieldId },
        },
      });

      return savedValue;
    });

    return projectApiRecord('employeeFieldValue', fieldValue, requestActor);
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
