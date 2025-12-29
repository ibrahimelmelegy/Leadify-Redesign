import { IsOptional, IsString, IsEmail, IsInt, IsIn, MaxLength, Matches, IsDateString } from 'class-validator';
import { LeadSourceEnums, LeadStatusEnums } from '../leadEnum';
import { Expose } from 'class-transformer';

export class UpdateLeadInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Lead name must not exceed 100 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email?: string;

  @Expose()
  @IsOptional()
  @Matches(/^\+?[0-9]{1,15}$/, {
    message: 'Phone number must be a valid international phone number format'
  })
  @MaxLength(15, { message: 'Phone number must not exceed 15 characters' })
  readonly phone?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(LeadSourceEnums), {
    message: `LeadSource must be one of: ${Object.values(LeadSourceEnums).join(', ')}`
  })
  leadSource?: LeadSourceEnums;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'otherSource must not exceed 100 characters' })
  otherSource?: string;

  @Expose()
  @IsOptional()
  @IsInt({ message: 'Assigned user must be an integer', each: true })
  users?: number[];

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Notes must not exceed 2000 characters' })
  notes?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(LeadStatusEnums), {
    message: `Status must be one of: ${Object.values(LeadStatusEnums).join(', ')}`
  })
  status?: LeadStatusEnums;

  @Expose()
  @IsOptional()
  @IsDateString()
  lastContactDate?: string;
}
