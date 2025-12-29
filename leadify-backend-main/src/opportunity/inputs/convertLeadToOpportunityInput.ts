import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsDateString, MaxLength, IsUUID, Min } from 'class-validator';
import { OpportunityStageEnums, OpportunityPriorityEnums } from '../opportunityEnum';
import { Expose } from 'class-transformer';

export class ConvertLeadToOpportunityInput {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  leadId!: string;

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
