import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { OrgStructureController } from './org-structure.controller';
import { OrgStructureService } from './org-structure.service';

@Module({
  controllers: [OrgStructureController],
  providers: [OrgStructureService, ReadResourceService],
})
export class OrgStructureModule {}
