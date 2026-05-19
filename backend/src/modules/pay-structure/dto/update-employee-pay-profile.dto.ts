import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeePayProfileDto {
  @IsOptional()
  @IsInt()
  earningTemplateFamilyId?: number;

  @IsOptional()
  @IsString()
  payBasis?: string;

  @IsOptional()
  @IsDateString()
  effectiveStartDate?: string;

  @IsOptional()
  @IsDateString()
  effectiveEndDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
