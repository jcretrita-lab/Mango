import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import {
  auditWrite,
  requireActor,
  type WritePayload,
} from '../../common/api/domain-write.helpers';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PrismaService } from '../../core/prisma/prisma.service';

const RANK_TERMINOLOGY_KEY = 'rankTerminology';
const DEFAULT_RANK_TERMINOLOGY = {
  rankLabel: 'Rank',
  rankLevelLabel: 'Level',
  positionSubLevelLabel: 'Sub-Level',
};

type RankTerminology = typeof DEFAULT_RANK_TERMINOLOGY;

interface SystemSettingRow {
  id: number;
  value: Prisma.JsonValue;
}

@Injectable()
export class SystemSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRankTerminology() {
    const rows = await this.prisma.$queryRaw<SystemSettingRow[]>(Prisma.sql`
      SELECT "id", "value"
      FROM "SystemSetting"
      WHERE "key" = ${RANK_TERMINOLOGY_KEY}
      LIMIT 1
    `);
    const value = rows[0]?.value;

    return {
      key: RANK_TERMINOLOGY_KEY,
      value: this.mergeRankTerminology(value),
    };
  }

  async updateRankTerminology(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const value = this.mergeRankTerminology(data);

    await this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<SystemSettingRow[]>(Prisma.sql`
        INSERT INTO "SystemSetting" ("key", "value", "createdBy", "updatedBy")
        VALUES (
          ${RANK_TERMINOLOGY_KEY},
          ${JSON.stringify(value)}::jsonb,
          ${requestActor.backendUserId},
          ${requestActor.backendUserId}
        )
        ON CONFLICT ("key") DO UPDATE
        SET "value" = ${JSON.stringify(value)}::jsonb,
            "updatedAt" = now(),
            "updatedBy" = ${requestActor.backendUserId}
        RETURNING "id", "value"
      `);

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'SYSTEM_RANK_TERMINOLOGY_UPDATED',
        'SystemSetting',
        rows[0]?.id ?? 0,
        { key: RANK_TERMINOLOGY_KEY },
      );
    });

    return { key: RANK_TERMINOLOGY_KEY, value };
  }

  private mergeRankTerminology(value: unknown): RankTerminology {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return DEFAULT_RANK_TERMINOLOGY;
    }

    const source = value as Record<string, unknown>;
    const next = {
      rankLabel: source.rankLabel ?? source.rank,
      rankLevelLabel: source.rankLevelLabel ?? source.level,
      positionSubLevelLabel:
        source.positionSubLevelLabel ?? source.subLevel ?? source.step,
    };

    return {
      rankLabel: this.readLabel(
        next.rankLabel,
        DEFAULT_RANK_TERMINOLOGY.rankLabel,
      ),
      rankLevelLabel: this.readLabel(
        next.rankLevelLabel,
        DEFAULT_RANK_TERMINOLOGY.rankLevelLabel,
      ),
      positionSubLevelLabel: this.readLabel(
        next.positionSubLevelLabel,
        DEFAULT_RANK_TERMINOLOGY.positionSubLevelLabel,
      ),
    };
  }

  private readLabel(value: unknown, fallback: string): string {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Rank terminology labels must be strings.');
    }

    return value.trim();
  }
}
