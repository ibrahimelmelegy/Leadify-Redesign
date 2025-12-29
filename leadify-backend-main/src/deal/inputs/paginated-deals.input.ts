import { Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { ContractTypeEnums, DealSortByEnum, DealStageEnums } from '../dealEnum';

export class GetPaginatedDealsInput {
  @Expose()
  @IsOptional()
  @IsString()
  page?: number;

  @Expose()
  @IsOptional()
  @IsString()
  limit?: number;

  @Expose()
  @IsOptional()
  @IsString()
  searchKey?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Stage must be an array' })
  @ArrayNotEmpty({ message: 'Stage array must not be empty' })
  @ArrayUnique({ message: 'Stage array must not contain duplicate values' })
  @IsIn(Object.values(DealStageEnums), {
    each: true,
    message: `Each Stage must be one of: ${Object.values(DealStageEnums).join(', ')}`
  })
  stage?: DealStageEnums[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Contract type must be an array' })
  @ArrayNotEmpty({ message: 'Contract type array must not be empty' })
  @ArrayUnique({ message: 'Contract type array must not contain duplicate values' })
  @IsIn(Object.values(ContractTypeEnums), {
    each: true,
    message: `Each Contract type must be one of: ${Object.values(ContractTypeEnums).join(', ')}`
  })
  contractType?: ContractTypeEnums[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? +value : value))
  @IsInt({ message: 'Assigned user must be an integer' })
  userId?: number;

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
  fromPrice?: string;

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
  @IsIn(Object.values(DealSortByEnum), {
    message: `sortBy must be one of: ${Object.values(DealSortByEnum).join(', ')}`
  })
  readonly sortBy?: DealSortByEnum;
}
