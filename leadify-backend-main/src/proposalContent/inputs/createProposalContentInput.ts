import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateProposalFinanceTableWithContentInput } from '../../proposalFinanceTable/inputs/createProposalFinanceTableWithContentInput';

export class CreateProposalContentInput {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  proposalId!: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  readonly parentId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Title must not exceed 255 characters.' })
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Subtitle must not exceed 255 characters.' })
  subtitle?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsString()
  image?: string;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProposalFinanceTableWithContentInput)
  financeTable?: CreateProposalFinanceTableWithContentInput;
}
