import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { buildReadOptions } from '../../common/api/read-resource.service';
import type { ApiQuery } from '../../common/api/read-resource.types';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import {
  PersonnelReadService,
  type PersonnelResourceKey,
} from './personnel-read.service';

type PersonnelReadRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('personnel')
export class PersonnelReadController {
  constructor(private readonly personnelReadService: PersonnelReadService) {}

  private findAll(
    resourceKey: PersonnelResourceKey,
    request: PersonnelReadRequest,
    query: ApiQuery,
  ) {
    return this.personnelReadService.findAll(
      resourceKey,
      buildReadOptions(query),
      request.user,
    );
  }

  private findOne(
    resourceKey: PersonnelResourceKey,
    id: number,
    request: PersonnelReadRequest,
  ) {
    return this.personnelReadService.findOne(resourceKey, id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employees')
  findEmployees(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employees', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employees/:id')
  findEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employees', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employments')
  findEmployments(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employments', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employments/:id')
  findEmployment(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employments', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-profiles')
  findEmployeeProfiles(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeProfiles', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-profiles/:id')
  findEmployeeProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeProfiles', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('education-records')
  findEducationRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('educationRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('education-records/:id')
  findEducationRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('educationRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('exam-records')
  findExamRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('examRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('exam-records/:id')
  findExamRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('examRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employment-history-records')
  findEmploymentHistoryRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employmentHistoryRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employment-history-records/:id')
  findEmploymentHistoryRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employmentHistoryRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('reference-contacts')
  findReferenceContacts(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('referenceContacts', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('reference-contacts/:id')
  findReferenceContact(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('referenceContacts', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('family-members')
  findFamilyMembers(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('familyMembers', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('family-members/:id')
  findFamilyMember(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('familyMembers', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('emergency-contacts')
  findEmergencyContacts(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('emergencyContacts', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('emergency-contacts/:id')
  findEmergencyContact(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('emergencyContacts', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-tabs')
  findPisTabs(@Req() request: PersonnelReadRequest, @Query() query: ApiQuery) {
    return this.findAll('pisTabs', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-tabs/:id')
  findPisTab(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('pisTabs', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-fields')
  findPisFields(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('pisFields', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-fields/:id')
  findPisField(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('pisFields', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-field-options')
  findPisFieldOptions(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('pisFieldOptions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-field-options/:id')
  findPisFieldOption(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('pisFieldOptions', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-field-policies')
  findPisFieldPolicies(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('pisFieldPolicies', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get('pis-field-policies/:id')
  findPisFieldPolicy(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('pisFieldPolicies', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-field-values')
  findEmployeeFieldValues(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeFieldValues', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-field-values/:id')
  findEmployeeFieldValue(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeFieldValues', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get(['employee-field-value-histories', 'employee-field-value-history'])
  findEmployeeFieldValueHistories(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeFieldValueHistories', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_READ)
  @Get([
    'employee-field-value-histories/:id',
    'employee-field-value-history/:id',
  ])
  findEmployeeFieldValueHistory(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeFieldValueHistories', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-onboarding-records')
  findEmployeeOnboardingRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeOnboardingRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-onboarding-records/:id')
  findEmployeeOnboardingRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeOnboardingRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-offboarding-records')
  findEmployeeOffboardingRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeOffboardingRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-offboarding-records/:id')
  findEmployeeOffboardingRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeOffboardingRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-loa-records')
  findEmployeeLoaRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeLoaRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employee-loa-records/:id')
  findEmployeeLoaRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeLoaRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('paf-records')
  findPafRecords(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('pafRecords', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('paf-records/:id')
  findPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('pafRecords', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get(['employee-profile-histories', 'employee-profile-history'])
  findEmployeeProfileHistories(
    @Req() request: PersonnelReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeeProfileHistories', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get(['employee-profile-histories/:id', 'employee-profile-history/:id'])
  findEmployeeProfileHistory(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelReadRequest,
  ) {
    return this.findOne('employeeProfileHistories', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':resourcePath')
  createResource(@Param('resourcePath') resourcePath: string) {
    return this.personnelReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch(':resourcePath/:id')
  updateResource(@Param('resourcePath') resourcePath: string) {
    return this.personnelReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Delete(':resourcePath/:id')
  deleteResource(@Param('resourcePath') resourcePath: string) {
    return this.personnelReadService.rejectGenericMutationByPath(resourcePath);
  }
}
