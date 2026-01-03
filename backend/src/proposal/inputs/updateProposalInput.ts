import { Expose } from 'class-transformer';
import { IsString, MaxLength, IsOptional, IsEnum, IsArray, IsUUID, IsDateString, IsIn } from 'class-validator';
import { ProposalModelEnum, ProposalStatusEnum, ProposalTypeEnum } from '../proposalEnum';

export class UpdateProposalInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ProposalModelEnum), { message: `Invalid relatedEntityType. Must be one of  ${Object.values(ProposalModelEnum).join(', ')}` })
  relatedEntityType?: ProposalModelEnum;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Proposal Title must not exceed 255 characters.' })
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  version?: string;

  @Expose()
  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid date string.' })
  date?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ProposalTypeEnum))
  type?: ProposalTypeEnum;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Reference must not exceed 50 characters.' })
  reference?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Proposal For must not exceed 100 characters.' })
  proposalFor?: string;

  @Expose()
  @IsOptional()
  @IsString()
  companyLogo?: string; // Assuming a file path or base64 string

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'notes must not exceed 500 characters.' })
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
