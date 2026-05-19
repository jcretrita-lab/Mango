import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { PersonnelReadController } from './personnel-read.controller';
import { PersonnelReadService } from './personnel-read.service';

@Module({
  controllers: [EmployeesController, PersonnelReadController],
  providers: [EmployeesService, PersonnelReadService, ReadResourceService],
})
export class PersonnelModule {}
