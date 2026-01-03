import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, IsArray, ArrayNotEmpty } from 'class-validator';
import { ValidPermissions } from '../../utils/custom-validators/valid-permissions';

export class UpdateRoleInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Role name must not exceed 255 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  @ArrayNotEmpty({ message: 'Permissions array must have at least one permission' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  @ValidPermissions()
  permissions?: string[];
}
