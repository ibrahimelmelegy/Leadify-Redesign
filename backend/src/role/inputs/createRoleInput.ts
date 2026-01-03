import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';
import { ValidPermissions } from '../../utils/custom-validators/valid-permissions';

export class CreateRoleInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Role name must not exceed 255 characters' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsNotEmpty({ message: 'Permissions cannot be empty' })
  @IsArray({ message: 'Permissions must be an array' })
  @ArrayNotEmpty({ message: 'Permissions array must have at least one permission' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  @ValidPermissions()
  permissions!: string[];
}
