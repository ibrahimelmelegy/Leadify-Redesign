import { Expose } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProposalFinanceTableInput {
  @Expose()
  @IsOptional()
  @IsNumber()
  public discount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  public marginPercentage?: number;
}
