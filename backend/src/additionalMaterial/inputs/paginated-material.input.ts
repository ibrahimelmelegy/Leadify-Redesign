import { Expose } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { MaterialSortByEnum } from '../material.enum';

export class GetPaginatedAdditionalMaterialInput {
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
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(MaterialSortByEnum), {
    message: `sortBy must be one of: ${Object.values(MaterialSortByEnum).join(', ')}`
  })
  readonly sortBy?: MaterialSortByEnum;
}
