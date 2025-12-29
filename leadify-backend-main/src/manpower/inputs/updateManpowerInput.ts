import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, IsEmail, Matches, IsIn, IsNumber, Min, IsArray, ArrayNotEmpty } from 'class-validator';
import { ManpowerRoleEnums, ManpowerAvailabilityStatusEnums, ManpowerNationalityEnums } from '../manpowerEnum';

export class UpdateManpowerInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full Name must not exceed 100 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ManpowerNationalityEnums), {
    message: `nationality must be one of: ${Object.values(ManpowerNationalityEnums).join(', ')}`
  })
  nationality?: ManpowerNationalityEnums;

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
  phone?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(Object.values(ManpowerRoleEnums), {
    each: true,
    message: `Each role must be one of: ${Object.values(ManpowerRoleEnums).join(', ')}`
  })
  role?: string[];

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ManpowerAvailabilityStatusEnums), {
    message: `Availability Status must be one of: ${Object.values(ManpowerAvailabilityStatusEnums).join(', ')}`
  })
  availabilityStatus?: ManpowerAvailabilityStatusEnums;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Salary must be a number' })
  @Min(0, { message: 'Salary must be greater than or equal to 0' })
  salary?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Variable Allowance must be a number' })
  @Min(0, { message: 'Variable Allowance must be greater than or equal to 0' })
  variableAllowance?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Transportation Allowance must be a number' })
  @Min(0, { message: 'Transportation Allowance must be greater than or equal to 0' })
  transportationAllowance?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Iqama Cost must be a number' })
  @Min(0, { message: 'Iqama Cost must be greater than or equal to 0' })
  iqamaCost?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'EOF must be a number' })
  @Min(0, { message: 'EOF must be greater than or equal to 0' })
  endOfServiceBenefit?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Saudization must be a number' })
  @Min(0, { message: 'Saudization must be greater than or equal to 0' })
  saudization?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Visa Fees must be a number' })
  @Min(0, { message: 'Visa Fees must be greater than or equal to 0' })
  visaFees?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Incoming Flight Ticket must be a number' })
  @Min(0, { message: 'Incoming Flight Ticket must be greater than or equal to 0' })
  incomingFlightTicket?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Health Insurance must be a number' })
  @Min(0, { message: 'Health Insurance must be greater than or equal to 0' })
  healthInsurance?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'General Organization for Social Insurance must be a number' })
  @Min(0, { message: 'General Organization for Social Insurance must be greater than or equal to 0' })
  generalOrganizationForSocialInsurance?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
