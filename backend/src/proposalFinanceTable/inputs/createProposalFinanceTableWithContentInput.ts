import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsInt, Max, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { CustomColumnInput } from '../../ProposalFinanceTableItem/inputs/customColumnInput';

export class CreateProposalFinanceTableWithContentInput {
  @Expose()
  @IsOptional()
  @IsNumber()
  public discount?: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  public marginPercentage!: number;

  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProposalFinanceTableItemInput)
  public items!: CreateProposalFinanceTableItemInput[];
}

export class CreateProposalFinanceTableItemInput {
  @Expose()
  @IsNotEmpty()
  @IsInt({ message: 'materialId must be an integer' })
  materialId!: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Max(999999)
  public qty!: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomColumnInput)
  public customColumns?: CustomColumnInput[];
}
