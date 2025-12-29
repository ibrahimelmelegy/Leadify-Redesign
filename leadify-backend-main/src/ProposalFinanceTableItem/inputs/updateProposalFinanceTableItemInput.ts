import { Expose } from 'class-transformer';
import { IsOptional, IsUUID, IsNumber, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomColumnInput } from './customColumnInput';

export class UpdateProposalFinanceTableItemInput {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Max(999999, { message: 'Quantity cannot exceed 999999' })
  public qty?: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomColumnInput)
  public customColumns?: CustomColumnInput[];
}
