import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreateUserInput {
  @Expose()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters.' })
  name!: string;

  @Expose()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters.' })
  phone?: string;

  @Expose()
  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Profile picture must be a valid URL or file path.' })
  profilePicture?: string;

  @Expose()
  @IsNotEmpty({ message: 'Role ID is required.' })
  @IsUUID('4', { message: 'Invalid role ID format.' })
  roleId!: string;
}
