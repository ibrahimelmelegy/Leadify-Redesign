import { Expose, Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { manufacturerVehicle, VehicleSortByEnum } from '../vehivle.enum';

export class GetPaginatedVehicleInput {
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
  @IsArray({ message: 'manufacturer must be an array' }) // Validate that it's an array
  @ArrayUnique({ message: 'manufacturer array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(manufacturerVehicle), {
    each: true,
    message: `Each manufacturer must be one of: ${Object.values(manufacturerVehicle).join(', ')}`
  })
  manufacturer?: manufacturerVehicle[];

  @Expose()
  @IsOptional()
  fromRentCost?: number;

  @Expose()
  @IsOptional()
  toRentCost?: number;

  @Expose()
  @IsOptional()
  fromGasCost?: number;

  @Expose()
  @IsOptional()
  toGasCost?: number;

  @Expose()
  @IsOptional()
  fromOilCost?: number;

  @Expose()
  @IsOptional()
  toOilCost?: number;

  @Expose()
  @IsOptional()
  fromRegularMaintenanceCost?: number;

  @Expose()
  @IsOptional()
  toRegularMaintenanceCost?: number;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(VehicleSortByEnum), {
    message: `sortBy must be one of: ${Object.values(VehicleSortByEnum).join(', ')}`
  })
  readonly sortBy?: VehicleSortByEnum;
}
