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
import { OrgStructureService } from './org-structure.service';

type WriteBody = Record<string, unknown>;

type OrgStructureRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('org-structure')
export class OrgStructureController {
  constructor(private readonly orgStructureService: OrgStructureService) {}

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get(['company-profiles', 'company-profile'])
  findCompanyProfiles(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'companyProfiles',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get(['company-profiles/:id', 'company-profile/:id'])
  findCompanyProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'companyProfiles',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('hierarchy-levels')
  findHierarchyLevels(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'hierarchyLevels',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('hierarchy-levels/:id')
  findHierarchyLevel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'hierarchyLevels',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('org-units')
  findOrgUnits(@Req() request: OrgStructureRequest, @Query() query: ApiQuery) {
    return this.orgStructureService.findAll(
      'orgUnits',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('org-units/:id')
  findOrgUnit(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne('orgUnits', id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get(['org-unit-closures', 'org-unit-closure'])
  findOrgUnitClosures(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'orgUnitClosures',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get(['org-unit-closures/:id', 'org-unit-closure/:id'])
  findOrgUnitClosure(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'orgUnitClosures',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('org-unit-versions')
  findOrgUnitVersions(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'orgUnitVersions',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('org-unit-versions/:id')
  findOrgUnitVersion(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'orgUnitVersions',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('sites')
  findSites(@Req() request: OrgStructureRequest, @Query() query: ApiQuery) {
    return this.orgStructureService.findAll(
      'sites',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('sites/:id')
  findSite(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne('sites', id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('ranks')
  findRanks(@Req() request: OrgStructureRequest, @Query() query: ApiQuery) {
    return this.orgStructureService.findAll(
      'ranks',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('ranks/:id')
  findRank(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne('ranks', id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('rank-levels')
  findRankLevels(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'rankLevels',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('rank-levels/:id')
  findRankLevel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne('rankLevels', id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-templates')
  findPositionTemplates(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'positionTemplates',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-templates/:id')
  findPositionTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'positionTemplates',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-profiles')
  findPositionProfiles(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'positionProfiles',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-profiles/:id')
  findPositionProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'positionProfiles',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-sub-levels')
  findPositionSubLevels(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'positionSubLevels',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-sub-levels/:id')
  findPositionSubLevel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'positionSubLevels',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('positions')
  findPositions(@Req() request: OrgStructureRequest, @Query() query: ApiQuery) {
    return this.orgStructureService.findAll(
      'positions',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('positions/:id')
  findPosition(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne('positions', id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-assignments')
  findPositionAssignments(
    @Req() request: OrgStructureRequest,
    @Query() query: ApiQuery,
  ) {
    return this.orgStructureService.findAll(
      'positionAssignments',
      buildReadOptions(query),
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('position-assignments/:id')
  findPositionAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.findOne(
      'positionAssignments',
      id,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('hierarchy-levels')
  createHierarchyLevel(
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.createHierarchyLevel(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('hierarchy-levels/:id')
  updateHierarchyLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updateHierarchyLevel(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('sites')
  createSite(@Body() body: WriteBody, @Req() request: OrgStructureRequest) {
    return this.orgStructureService.createSite(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('sites/:id')
  updateSite(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updateSite(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('org-units')
  createOrgUnit(@Body() body: WriteBody, @Req() request: OrgStructureRequest) {
    return this.orgStructureService.createOrgUnit(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('org-units/:id')
  updateOrgUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updateOrgUnit(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('org-units/:id/move')
  moveOrgUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.moveOrgUnit(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('ranks')
  createRank(@Body() body: WriteBody, @Req() request: OrgStructureRequest) {
    return this.orgStructureService.createRank(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('ranks/:id')
  updateRank(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updateRank(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('rank-levels')
  createRankLevel(
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.createRankLevel(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('rank-levels/:id')
  updateRankLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updateRankLevel(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('position-templates')
  createPositionTemplate(
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.createPositionTemplate(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('position-templates/:id')
  updatePositionTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updatePositionTemplate(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('position-profiles')
  createPositionProfile(
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.createPositionProfile(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('position-profiles/:id')
  updatePositionProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updatePositionProfile(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('positions')
  createPosition(@Body() body: WriteBody, @Req() request: OrgStructureRequest) {
    return this.orgStructureService.createPosition(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('positions/:id')
  updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updatePosition(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('position-assignments')
  createPositionAssignment(
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.createPositionAssignment(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('position-assignments/:id')
  updatePositionAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.updatePositionAssignment(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post('position-assignments/:id/end')
  endPositionAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: OrgStructureRequest,
  ) {
    return this.orgStructureService.endPositionAssignment(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Post(':resourcePath')
  createResource(@Param('resourcePath') resourcePath: string) {
    return this.orgStructureService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch(':resourcePath/:id')
  updateResource(@Param('resourcePath') resourcePath: string) {
    return this.orgStructureService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Delete(':resourcePath/:id')
  deleteResource(@Param('resourcePath') resourcePath: string) {
    return this.orgStructureService.rejectGenericMutationByPath(resourcePath);
  }
}
