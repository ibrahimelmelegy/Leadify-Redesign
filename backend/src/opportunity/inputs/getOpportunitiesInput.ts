import { IsArray, IsIn, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { OpportunityPriorityEnums, OpportunitySortByEnum, OpportunityStageEnums } from '../opportunityEnum';
import { SortEnum } from '../../lead/leadEnum';
import { Expose, Transform } from 'class-transformer';

export class GetOpportunitiesInput {
  @Expose()
  @IsOptional()
  @IsString()
  page?: string;

  @Expose()
  @IsOptional()
  @IsString()
  limit?: string;

  @Expose()
  @IsOptional()
  @IsString()
  searchKey?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(OpportunitySortByEnum), {
    message: `sortBy must be one of: ${Object.values(OpportunitySortByEnum).join(', ')}`
  })
  readonly sortBy?: OpportunitySortByEnum;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'stage must be an array' })
  @IsIn(Object.values(OpportunityStageEnums), {
    each: true,
    message: `Each stage must be one of: ${Object.values(OpportunityStageEnums).join(', ')}`
  })
  readonly stage?: OpportunityStageEnums[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => Number(v.trim()));
    }
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    return value;
  })
  @IsArray({ message: 'userId must be an array' })
  @IsInt({ each: true, message: 'Each userId must be an integer' })
  userId?: number[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'priority must be an array' })
  @IsIn(Object.values(OpportunityPriorityEnums), {
    each: true,
    message: `Each priority must be one of: ${Object.values(OpportunityPriorityEnums).join(', ')}`
  })
  readonly priority?: OpportunityPriorityEnums[];

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'From expectedCloseDate must be a valid ISO 8601 date' })
  readonly fromExpectedCloseDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To expectedCloseDate must be a valid ISO 8601 date' })
  readonly toExpectedCloseDate?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value), { toClassOnly: true })
  @IsInt({ message: 'fromEstimatedValue must be a number' })
  readonly fromEstimatedValue?: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value), { toClassOnly: true })
  @IsInt({ message: 'toEstimatedValue must be a number' })
  readonly toEstimatedValue?: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value), { toClassOnly: true })
  @IsInt({ message: 'fromProfit must be a number' })
  readonly fromProfit?: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value), { toClassOnly: true })
  @IsInt({ message: 'toProfit must be a number' })
  readonly toProfit?: number;
}
