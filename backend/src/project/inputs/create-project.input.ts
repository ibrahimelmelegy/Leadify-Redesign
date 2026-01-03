import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { AdditionalMaterialItemInputDto, CreateMaterialInput } from '../../material/input/create-material.input';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';
import { ApplicationStatusEnum, ContractTypeEnum, ProjectCategoryEnum, ProjectStatusEnum, ProposalStatusEnum } from '../projectEnum';

export class CreateEtimadProjectInput {
  @IsNotEmpty()
  @MaxLength(255)
  abbreviation!: string;

  @IsNotEmpty()
  @MaxLength(255)
  organizationName!: string;

  @IsNotEmpty()
  @MaxLength(255)
  rfpName!: string;

  @IsNotEmpty()
  @IsEnum(ContractTypeEnum)
  contractType!: ContractTypeEnum;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNumber()
  tenderPrice?: number;

  @IsOptional()
  @MaxLength(255)
  businessLine?: string;

  @IsOptional()
  @IsNumber()
  estimatedBudget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  companyMargin?: number;

  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @IsNotEmpty()
  @IsEnum(ProposalStatusEnum)
  proposalStatus!: ProposalStatusEnum;

  @IsNotEmpty()
  @IsEnum(ApplicationStatusEnum)
  applicationStatus!: ApplicationStatusEnum;
}

export class FileInput {
  @Expose()
  @IsNotBlank()
  @MaxLength(255)
  name!: string;

  @Expose()
  @ArrayMinSize(1)
  refs!: string[];
}

export class CreateProjectInfoInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  dealId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  opportunityId?: string;

  @Expose()
  @IsNotBlank()
  @MaxLength(255)
  name!: string;

  @Expose()
  @IsNotBlank()
  type!: string;

  @Expose()
  @IsIn(Object.values(ProjectCategoryEnum))
  category!: ProjectCategoryEnum;

  @Expose()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsInt()
  @IsPositive()
  duration!: number;

  @Expose()
  @IsIn(Object.values(ProjectStatusEnum))
  status!: ProjectStatusEnum;

  @Expose()
  @ValidateIf((o: CreateProjectInfoInput) => o.status === ProjectStatusEnum.CANCELLED)
  @IsNotBlank()
  @MaxLength(255)
  cancelledReason?: string;

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  assignedUsersIds!: number[];

  @Expose()
  @IsNotBlank()
  @MaxLength(500)
  description?: string;

  @Expose()
  @IsOptional()
  @ArrayMinSize(1)
  @Type(() => FileInput)
  @ValidateNested()
  files?: FileInput[];

  @Expose()
  @ValidateIf((o: CreateProjectInfoInput) => o.category === ProjectCategoryEnum.Etimad)
  @Type(() => CreateEtimadProjectInput)
  @ValidateNested()
  etimadInfo!: CreateEtimadProjectInput;
}

export class CreateProjectInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @Expose()
  @Type(() => CreateProjectInfoInput)
  @ValidateNested()
  basicInfo!: CreateProjectInfoInput;

  // @Expose()
  // @ArrayMinSize(1)
  // @Type(() => CreateMaterialInput)
  // @ValidateNested()
  // materials!: CreateMaterialInput[];

  // @Expose()
  // @IsNotEmpty()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => AdditionalMaterialItemInputDto)
  // public additionalMaterialItems!: AdditionalMaterialItemInputDto[];
}
