import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import type { ReadModelName } from './read-resource.types';

export type WritePayload = Record<string, unknown>;

export interface WriteDelegate {
  create(args: { data: WritePayload }): Promise<unknown>;
  update(args: { where: { id: number }; data: WritePayload }): Promise<unknown>;
  updateMany(args: {
    where: Record<string, unknown>;
    data: WritePayload;
  }): Promise<{ count: number }>;
  findUnique(args: { where: { id: number } }): Promise<unknown>;
}

export interface AuditDelegate {
  create(args: {
    data: {
      actorUserId: number;
      eventType: string;
      entityType: string;
      entityId: string;
      metadataJson?: Prisma.InputJsonValue;
    };
  }): Promise<unknown>;
}

export function requireActor(
  actor: AuthenticatedRequestUser | undefined,
): AuthenticatedRequestUser {
  if (!actor) {
    throw new UnauthorizedException('No authenticated session provided.');
  }

  return actor;
}

export function pickDefinedFields(
  source: WritePayload,
  allowedFields: readonly string[],
): WritePayload {
  return Object.fromEntries(
    allowedFields
      .map((field) => [field, source[field]] as const)
      .filter((entry) => entry[1] !== undefined),
  );
}

export function assertRequiredFields(
  payload: WritePayload,
  requiredFields: readonly string[],
  label: string,
): void {
  const missingFields = requiredFields.filter(
    (field) => payload[field] === undefined || payload[field] === null,
  );

  if (missingFields.length > 0) {
    throw new BadRequestException(
      `${label} requires: ${missingFields.join(', ')}.`,
    );
  }
}

export function assertNonEmptyPayload(
  payload: WritePayload,
  message = 'No supported fields provided.',
): void {
  if (Object.keys(payload).length === 0) {
    throw new BadRequestException(message);
  }
}

export function assertDateOrder(
  payload: WritePayload,
  startField: string,
  endField: string,
): void {
  const startValue = payload[startField];
  const endValue = payload[endField];

  if (!startValue || !endValue) {
    return;
  }

  const startDate = toDate(startValue);
  const endDate = toDate(endValue);

  if (!startDate || !endDate || endDate < startDate) {
    throw new BadRequestException(
      `${endField} must be on or after ${startField}.`,
    );
  }
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
}

export async function auditWrite(
  auditDelegate: AuditDelegate,
  actorUserId: number,
  eventType: string,
  entityType: string,
  entityId: number,
  metadataJson?: Prisma.InputJsonValue,
): Promise<void> {
  await auditDelegate.create({
    data: {
      actorUserId,
      eventType,
      entityType,
      entityId: String(entityId),
      metadataJson,
    },
  });
}

export async function assertRecordExists(
  delegate: WriteDelegate,
  id: number,
  label: string,
): Promise<void> {
  const record = await delegate.findUnique({ where: { id } });

  if (!record) {
    throw new NotFoundException(`${label} ${id} was not found.`);
  }
}

export function readModelLabel(model: ReadModelName): string {
  return model.charAt(0).toUpperCase() + model.slice(1);
}
