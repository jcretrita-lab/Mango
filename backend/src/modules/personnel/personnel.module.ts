import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { PafRecordsController } from './paf-records.controller';
import { PafRecordsService } from './paf-records.service';
import { PersonnelReadController } from './personnel-read.controller';
import { PersonnelReadService } from './personnel-read.service';

@Module({
  controllers: [
    EmployeesController,
    PafRecordsController,
    PersonnelReadController,
  ],
  providers: [
    EmployeesService,
    PafRecordsService,
    PersonnelReadService,
    ReadResourceService,
  ],
})
export class PersonnelModule {}
