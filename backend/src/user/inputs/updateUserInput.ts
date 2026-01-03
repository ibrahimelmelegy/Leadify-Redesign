import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, IsUUID, IsIn } from 'class-validator';
import { UserStatusEnum } from '../userEnum';

export class UpdateUserInput {
  @Expose()
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters.' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format.' })
  email?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters.' })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Invalid status value.' })
  @IsIn(Object.values(UserStatusEnum), {
    message: `Status must be one of: ${Object.values(UserStatusEnum).join(', ')}`
  })
  status?: UserStatusEnum;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Profile picture must be a valid URL or file path.' })
  profilePicture?: string;

  @Expose()
  @IsOptional()
  @IsUUID('4', { message: 'Invalid role ID format.' })
  roleId?: string;
}
