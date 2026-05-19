import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { EmployeePayProfilesController } from './employee-pay-profiles.controller';
import { EmployeePayProfilesService } from './employee-pay-profiles.service';
import { PayStructureReadController } from './pay-structure-read.controller';
import { PayStructureReadService } from './pay-structure-read.service';

@Module({
  controllers: [EmployeePayProfilesController, PayStructureReadController],
  providers: [
    EmployeePayProfilesService,
    PayStructureReadService,
    ReadResourceService,
  ],
})
export class PayStructureModule {}
