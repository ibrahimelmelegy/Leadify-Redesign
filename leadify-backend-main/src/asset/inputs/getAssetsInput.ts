import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { AssetSortByEnum } from '../assets,enum';

export class GetAssetsInput {
  @Expose()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1), { toClassOnly: true }) // Default to 1 if not provided
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @Expose()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10), { toClassOnly: true }) // Default to 10 if not provided
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit: number = 10;

  @Expose()
  @IsOptional()
  searchKey?: string;

  @Expose()
  @IsOptional()
  fromRentPrice?: number;

  @Expose()
  @IsOptional()
  toRentPrice?: number;

  @Expose()
  @IsOptional()
  fromBuyPrice?: number;

  @Expose()
  @IsOptional()
  toBuyPrice?: number;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(AssetSortByEnum), {
    message: `sortBy must be one of: ${Object.values(AssetSortByEnum).join(', ')}`
  })
  readonly sortBy?: AssetSortByEnum;
}
