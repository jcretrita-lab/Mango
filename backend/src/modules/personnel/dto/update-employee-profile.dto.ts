import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeProfileDto {
  @IsOptional()
  @IsString()
  civilStatus?: string;

  @IsOptional()
  @IsString()
  residentialAddress?: string;

  @IsOptional()
  @IsString()
  bankName?: string;
}
