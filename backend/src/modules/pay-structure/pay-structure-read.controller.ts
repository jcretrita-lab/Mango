import {
  Body,
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
  PayStructureReadService,
  type PayStructureResourceKey,
} from './pay-structure-read.service';
import { EmployeePayProfilesService } from './employee-pay-profiles.service';

type WriteBody = Record<string, unknown>;

type PayStructureReadRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('pay-structure')
export class PayStructureReadController {
  constructor(
    private readonly payStructureReadService: PayStructureReadService,
    private readonly employeePayProfilesService: EmployeePayProfilesService,
  ) {}

  private findAll(
    resourceKey: PayStructureResourceKey,
    request: PayStructureReadRequest,
    query: ApiQuery,
  ) {
    return this.payStructureReadService.findAll(
      resourceKey,
      buildReadOptions(query),
      request.user,
    );
  }

  private findOne(
    resourceKey: PayStructureResourceKey,
    id: number,
    request: PayStructureReadRequest,
  ) {
    return this.payStructureReadService.findOne(resourceKey, id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('salary-grades')
  findSalaryGrades(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('salaryGrades', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('salary-grades/:id/steps')
  findSalaryGradeStepsByGrade(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.findSalaryGradeStepsByGrade(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('salary-grades/:id')
  findSalaryGrade(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('salaryGrades', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('salary-grade-steps')
  findSalaryGradeSteps(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('salaryGradeSteps', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('salary-grade-steps/:id')
  findSalaryGradeStep(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('salaryGradeSteps', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-families')
  findEarningTemplateFamilies(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('earningTemplateFamilies', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-families/:id')
  findEarningTemplateFamily(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('earningTemplateFamilies', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-families/:id/current-revision')
  findCurrentEarningTemplateRevision(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.findCurrentEarningTemplateRevision(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-family-scopes')
  findEarningTemplateFamilyScopes(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('earningTemplateFamilyScopes', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-family-scopes/:id')
  findEarningTemplateFamilyScope(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('earningTemplateFamilyScopes', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-revisions')
  findEarningTemplateRevisions(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('earningTemplateRevisions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-revisions/:id')
  findEarningTemplateRevision(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('earningTemplateRevisions', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-revision-lines')
  findEarningTemplateRevisionLines(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('earningTemplateRevisionLines', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-template-revision-lines/:id')
  findEarningTemplateRevisionLine(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('earningTemplateRevisionLines', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-components')
  findEarningComponents(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('earningComponents', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('earning-components/:id')
  findEarningComponent(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('earningComponents', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-components/:id/resolve')
  resolveEarningComponent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.resolveEarningComponent(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('formulas')
  findFormulas(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('formulas', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('formulas/:id/as-of')
  findFormulaAsOf(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string | undefined,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.findFormulaAsOf(
      id,
      date,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('formulas/:id')
  findFormula(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('formulas', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('formula-versions')
  findFormulaVersions(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('formulaVersions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_READ)
  @Get('formula-versions/:id')
  findFormulaVersion(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('formulaVersions', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.PAY_STRUCTURE_READ,
    PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
  )
  @Get('employees/:employeeId/pay-profile/current')
  findCurrentEmployeePayProfile(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('date') date: string | undefined,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.findCurrentEmployeePayProfile(
      employeeId,
      date,
      request.user,
    );
  }

  @RequirePermissions(
    PERMISSION_CODES.PAY_STRUCTURE_READ,
    PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
  )
  @Get('employee-pay-profiles')
  findEmployeePayProfiles(
    @Req() request: PayStructureReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('employeePayProfiles', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.PAY_STRUCTURE_READ,
    PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
  )
  @Get('employee-pay-profiles/:id')
  findEmployeePayProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.findOne('employeePayProfiles', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('salary-grades')
  createSalaryGrade(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createSalaryGrade(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('salary-grades/:id')
  updateSalaryGrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateSalaryGrade(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('salary-grades/:id/status')
  updateSalaryGradeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateSalaryGradeStatus(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Delete('salary-grades/:id')
  deleteSalaryGrade(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.deleteSalaryGrade(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('salary-grade-steps')
  createSalaryGradeStep(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createSalaryGradeStep(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('salary-grade-steps/:id')
  updateSalaryGradeStep(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateSalaryGradeStep(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Delete('salary-grade-steps/:id')
  deleteSalaryGradeStep(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.deleteSalaryGradeStep(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('formulas')
  createFormula(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createFormula(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('formulas/:id')
  updateFormula(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateFormula(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('formulas/:id/status')
  updateFormulaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateFormulaStatus(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('formula-versions')
  createFormulaVersion(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createFormulaVersion(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('formula-versions/:id/set-current')
  setCurrentFormulaVersion(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.setCurrentFormulaVersion(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-components')
  createEarningComponent(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningComponent(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-components/:id')
  updateEarningComponent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningComponent(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-components/:id/status')
  updateEarningComponentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningComponentStatus(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-families')
  createEarningTemplateFamily(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningTemplateFamily(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-template-families/:id')
  updateEarningTemplateFamily(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningTemplateFamily(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-template-families/:id/status')
  updateEarningTemplateFamilyStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningTemplateFamilyStatus(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-families/:id/variants')
  createEarningTemplateFamilyVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningTemplateFamilyVariant(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-family-scopes')
  createEarningTemplateFamilyScope(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningTemplateFamilyScope(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-template-family-scopes/:id')
  updateEarningTemplateFamilyScope(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningTemplateFamilyScope(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-family-scopes/:id/set-primary')
  setPrimaryEarningTemplateFamilyScope(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.setPrimaryEarningTemplateFamilyScope(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-revisions')
  createEarningTemplateRevision(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningTemplateRevision(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-revisions/:id/set-current')
  setCurrentEarningTemplateRevision(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.setCurrentEarningTemplateRevision(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-revisions/:id/reorder-lines')
  reorderEarningTemplateRevisionLines(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.reorderEarningTemplateRevisionLines(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('earning-template-revision-lines')
  createEarningTemplateRevisionLine(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createEarningTemplateRevisionLine(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch('earning-template-revision-lines/:id')
  updateEarningTemplateRevisionLine(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.updateEarningTemplateRevisionLine(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Delete('earning-template-revision-lines/:id')
  deleteEarningTemplateRevisionLine(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.deleteEarningTemplateRevisionLine(
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post('employee-pay-profiles')
  createEmployeePayProfile(
    @Body() body: WriteBody,
    @Req() request: PayStructureReadRequest,
  ) {
    return this.employeePayProfilesService.createPayProfile(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Post(':resourcePath')
  createResource(@Param('resourcePath') resourcePath: string) {
    return this.payStructureReadService.rejectGenericMutationByPath(
      resourcePath,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch(':resourcePath/:id')
  updateResource(@Param('resourcePath') resourcePath: string) {
    return this.payStructureReadService.rejectGenericMutationByPath(
      resourcePath,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Delete(':resourcePath/:id')
  deleteResource(@Param('resourcePath') resourcePath: string) {
    return this.payStructureReadService.rejectGenericMutationByPath(
      resourcePath,
    );
  }
}
