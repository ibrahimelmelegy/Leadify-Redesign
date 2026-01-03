import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  IsUUID,
  IsEmail,
  Matches,
  ValidateNested,
  Min
} from 'class-validator';
import { OpportunityStageEnums, OpportunityPriorityEnums } from '../opportunityEnum';
import { Expose, Type } from 'class-transformer';
export class LeadInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Lead name must not exceed 100 characters' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  companyName?: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email!: string;

  @Expose()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{1,15}$/, {
    message: 'Phone number must be a valid international phone number format'
  })
  @MaxLength(15, { message: 'Phone number must not exceed 15 characters' })
  readonly phone!: string;

  @Expose()
  @IsNotEmpty()
  @IsInt({ message: 'Assigned user must be an integer', each: true })
  users!: number[];
}

export class OpportunityInput {
  @Expose()
  @IsNotEmpty()
  @IsInt({ message: 'Assigned user must be an integer', each: true })
  users!: number[];

  @Expose()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  interestedIn?: string;

  @Expose()
  @IsNotEmpty({ message: 'Opportunity Stage is required' })
  @IsIn(Object.values(OpportunityStageEnums), {
    message: `Opportunity Stage must be one of: ${Object.values(OpportunityStageEnums).join(', ')}`
  })
  stage!: OpportunityStageEnums;

  @Expose()
  @IsOptional()
  @Min(0, { message: 'Estimated Value must be a positive number' })
  @IsInt({ message: 'Estimated Value must be a number' })
  estimatedValue?: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(OpportunityPriorityEnums), {
    message: `Priority must be one of: ${Object.values(OpportunityPriorityEnums).join(', ')}`
  })
  priority?: OpportunityPriorityEnums;

  @Expose()
  @IsOptional()
  @IsArray({ message: 'Next Steps must be an array' })
  nextSteps?: string[];

  @Expose()
  @IsOptional()
  @IsString()
  reasonOfLose?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Notes must not exceed 2000 characters' })
  notes?: string;

  @Expose()
  @IsOptional()
  @Min(0, { message: 'Profit must be a positive number' })
  @IsInt({ message: 'Profit must be a number' })
  profit?: number;
}

export class CreateLeadAndOpportunityInput {
  @Expose()
  @IsOptional()
  @Type(() => LeadInput)
  @ValidateNested()
  lead?: LeadInput;

  @Expose()
  @Type(() => OpportunityInput)
  @ValidateNested()
  opportunity!: OpportunityInput;

  @IsOptional()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  clientId?: string;
}
