import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateApprovalRequestDto {
  @IsInt()
  approvalSetupId!: number;

  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsInt()
  referenceId?: number;

  @IsOptional()
  @IsObject()
  payloadJson?: Record<string, unknown>;
}
