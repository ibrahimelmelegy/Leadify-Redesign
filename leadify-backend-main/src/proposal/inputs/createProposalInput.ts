import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEnum, IsArray, IsUUID, IsDateString, IsIn } from 'class-validator';
import { ProposalModelEnum, ProposalTypeEnum } from '../proposalEnum';

export class CreateProposalInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ProposalModelEnum), { message: `Invalid relatedEntityType. Must be one of  ${Object.values(ProposalModelEnum).join(', ')}` })
  relatedEntityType?: ProposalModelEnum;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Proposal Title must not exceed 255 characters.' })
  title!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  version!: string; // Auto-generated but can be validated

  @Expose()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Date must be a valid date string.' })
  date!: string;

  @Expose()
  @IsNotEmpty()
  @IsIn(Object.values(ProposalTypeEnum))
  type!: ProposalTypeEnum;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Reference must not exceed 50 characters.' })
  reference!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Proposal For must not exceed 100 characters.' })
  proposalFor!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  companyLogo!: string;

  @Expose()
  @IsNotEmpty()
  @IsArray()
  users!: string[];

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each path must be a string.' })
  fileAttachments?: string[];

  @Expose()
  @IsOptional()
  @IsString()
  content?: string;
}
