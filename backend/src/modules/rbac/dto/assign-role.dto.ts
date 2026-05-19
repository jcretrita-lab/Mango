import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class AssignRoleDto {
  @IsInt()
  roleId!: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
