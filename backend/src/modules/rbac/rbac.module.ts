import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { RbacReadController } from './rbac-read.controller';
import { RbacReadService } from './rbac-read.service';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  controllers: [RbacController, RbacReadController],
  providers: [RbacService, RbacReadService, ReadResourceService],
})
export class RbacModule {}
