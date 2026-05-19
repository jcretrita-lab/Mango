import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeFieldValueDto {
  @IsDefined()
  valueJson!: unknown;

  @IsOptional()
  @IsString()
  changeReason?: string;
}
