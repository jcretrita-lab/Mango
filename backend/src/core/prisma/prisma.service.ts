import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Opens the database connection when Nest initializes PrismaModule so services can query PostgreSQL.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Closes the Prisma connection when Nest shuts down to avoid dangling database connections.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
