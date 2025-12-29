import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class AssociatingManpowerToProjectInput {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Accommodation cost must be a positive number' })
  public accommodationCost!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Food cost per day must be a positive number' })
  public foodCostPerDay!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Management addition percentage must be a positive number' })
  public managementAdditionPercentage?: number;
}
