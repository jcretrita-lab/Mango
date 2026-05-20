import { Module } from '@nestjs/common';
import { EmployeePayProfileCurrentController } from './employee-pay-profile-current.controller';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { EmployeePayProfilesController } from './employee-pay-profiles.controller';
import { EmployeePayProfilesService } from './employee-pay-profiles.service';
import { PayStructureReadController } from './pay-structure-read.controller';
import { PayStructureReadService } from './pay-structure-read.service';

@Module({
  controllers: [
    EmployeePayProfileCurrentController,
    EmployeePayProfilesController,
    PayStructureReadController,
  ],
  providers: [
    EmployeePayProfilesService,
    PayStructureReadService,
    ReadResourceService,
  ],
})
export class PayStructureModule {}
