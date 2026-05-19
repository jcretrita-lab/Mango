import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './core/health/health.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaModule } from './core/prisma/prisma.module';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrgStructureModule } from './modules/org-structure/org-structure.module';
import { PayStructureModule } from './modules/pay-structure/pay-structure.module';
import { PersonnelModule } from './modules/personnel/personnel.module';
import { RbacModule } from './modules/rbac/rbac.module';

const phaseOneMountedModules = [
  RbacModule,
  OrgStructureModule,
  PersonnelModule,
  PayStructureModule,
  ApprovalsModule,
] as const;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ...phaseOneMountedModules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
