import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { UpdateEmployeeFieldValueDto } from './dto/update-employee-field-value.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeesService } from './employees.service';

type WriteBody = Record<string, unknown>;

type PersonnelRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('personnel/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post()
  createEmployee(@Body() body: WriteBody, @Req() request: PersonnelRequest) {
    return this.employeesService.createEmployee(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch(':id')
  updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateEmployee(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch(':id/profile')
  updateProfile(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: UpdateEmployeeProfileDto,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateProfile(employeeId, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch(':id/field-values/:fieldId')
  updateFieldValue(
    @Param('id', ParseIntPipe) employeeId: number,
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() body: UpdateEmployeeFieldValueDto,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateFieldValue(
      employeeId,
      fieldId,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/employments')
  createEmployment(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createEmployment(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('employments/:recordId')
  updateEmployment(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateEmployment(recordId, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/education-records')
  createEducationRecord(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createEducationRecord(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('education-records/:recordId')
  updateEducationRecord(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateEducationRecord(
      recordId,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/exam-records')
  createExamRecord(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createExamRecord(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('exam-records/:recordId')
  updateExamRecord(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateExamRecord(recordId, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/family-members')
  createFamilyMember(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createFamilyMember(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('family-members/:recordId')
  updateFamilyMember(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateFamilyMember(
      recordId,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/emergency-contacts')
  createEmergencyContact(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createEmergencyContact(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('emergency-contacts/:recordId')
  updateEmergencyContact(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateEmergencyContact(
      recordId,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post(':id/reference-contacts')
  createReferenceContact(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.createReferenceContact(
      { ...body, employeeId },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('reference-contacts/:recordId')
  updateReferenceContact(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updateReferenceContact(
      recordId,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('pis-fields')
  createPisField(@Body() body: WriteBody, @Req() request: PersonnelRequest) {
    return this.employeesService.createPisField(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('pis-fields/:fieldId')
  updatePisField(
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.employeesService.updatePisField(fieldId, body, request.user);
  }
}
