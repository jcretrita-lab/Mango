import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  /**
   * Receives PrismaService so the health indicator can verify the same database connection used by repositories.
   */
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  /**
   * Runs a lightweight SELECT 1 through PrismaService so HealthController can report database availability.
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Database health check failed';

      throw new HealthCheckError(
        'Prisma check failed',
        this.getStatus(key, false, { message }),
      );
    }
  }
}
