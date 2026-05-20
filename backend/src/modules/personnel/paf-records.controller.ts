import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PafRecordsService } from './paf-records.service';

type PersonnelRequest = Request & {
  user?: AuthenticatedRequestUser;
};

type WriteBody = Record<string, unknown>;
type PafQuery = Record<string, string | string[] | undefined>;

@Controller()
export class PafRecordsController {
  constructor(private readonly pafRecordsService: PafRecordsService) {}

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records')
  findPafRecords(@Query() query: PafQuery, @Req() request: PersonnelRequest) {
    return this.pafRecordsService.findAll(query, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records/:id')
  findPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.findOne(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records')
  createPafRecord(@Body() body: WriteBody, @Req() request: PersonnelRequest) {
    return this.pafRecordsService.create(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('personnel/paf-records/:id')
  updatePafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.update(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Delete('personnel/paf-records/:id')
  deletePafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.delete(id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('employees/:employeeId/paf-records')
  findEmployeePafRecords(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query() query: PafQuery,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.findAll(query, request.user, employeeId);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('me/paf-records')
  findMyPafRecords(@Query() query: PafQuery, @Req() request: PersonnelRequest) {
    return this.pafRecordsService.findMine(query, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/submit')
  submitPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.submit(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/cancel')
  cancelPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.cancel(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/verify')
  verifyPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.verify(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/apply')
  applyPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.apply(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('personnel/paf-records/:id/approval-setup')
  linkApprovalSetup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.linkApprovalSetup(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/approval-request')
  createApprovalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.createApprovalRequest(id, body, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records/:id/approval-trail')
  getApprovalTrail(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.getApprovalTrail(id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records/:id/payload')
  getPayload(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.getPayload(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Patch('personnel/paf-records/:id/payload')
  updatePayload(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.updatePayload(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/validate')
  validatePayload(@Body() body: WriteBody) {
    return this.pafRecordsService.validatePayload(body);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records/:id/profile-histories')
  getProfileHistories(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.getProfileHistories(id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Get('personnel/paf-records/:id/loa-records')
  getLoaRecords(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.getLoaRecords(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/profile-history')
  generateProfileHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.generateProfileHistory(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PERSONNEL_MANAGE)
  @Post('personnel/paf-records/:id/loa-record')
  generateLoaRecord(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.generateLoaRecord(id, body, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Get('personnel/paf-records/:id/print')
  printPafRecord(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.renderPrintDocument(id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.PERSONNEL_READ,
    PERMISSION_CODES.PERSONNEL_SELF_READ,
  )
  @Header('Content-Type', 'application/pdf')
  @Get('personnel/paf-records/:id/pdf')
  downloadPafPdf(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: PersonnelRequest,
  ) {
    return this.pafRecordsService.renderPdfDocument(id, request.user);
  }
}
