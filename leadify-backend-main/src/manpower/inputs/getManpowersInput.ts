import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn, IsISO8601 } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { ManpowerSortByEnum } from '../manpowerEnum';

export class GetManpowersInput {
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1), { toClassOnly: true }) // Default to 1 if not provided
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @Transform(({ value }) => (value ? parseInt(value, 10) : 10), { toClassOnly: true }) // Default to 10 if not provided
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit: number = 10;

  @Expose()
  @IsOptional()
  public availabilityStatus?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  public role?: string[];

  @Expose()
  @IsOptional()
  fromSalary?: number;

  @Expose()
  @IsOptional()
  toSalary?: number;

  @Expose()
  @IsOptional()
  fromVariableAllowance?: number;

  @Expose()
  @IsOptional()
  toVariableAllowance?: number;

  @Expose()
  @IsOptional()
  fromTransportationAllowance?: number;

  @Expose()
  @IsOptional()
  toTransportationAllowance?: number;

  @Expose()
  @IsOptional()
  fromIqamaCost?: number;

  @Expose()
  @IsOptional()
  toIqamaCost?: number;

  @Expose()
  @IsOptional()
  fromTotalCost?: number;

  @Expose()
  @IsOptional()
  toTotalCost?: number;

  @Expose()
  @IsOptional()
  fromDailyCost?: number;

  @Expose()
  @IsOptional()
  toDailyCost?: number;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date' })
  fromDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date' })
  toDate?: string;

  @Expose()
  @IsOptional()
  searchKey?: string;

  @Expose()
  @IsOptional()
  toPrice?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ManpowerSortByEnum), {
    message: `sortBy must be one of: ${Object.values(ManpowerSortByEnum).join(', ')}`
  })
  readonly sortBy?: ManpowerSortByEnum;
}
