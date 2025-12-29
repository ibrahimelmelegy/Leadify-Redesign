import { Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ClientStatusEnums, ClientTypeEnums, SortByEnum, SortEnum } from '../clientEnum';

export class GetClientsInput {
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
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Status must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Status array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Status array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ClientStatusEnums), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(ClientStatusEnums).join(', ')}`
  })
  status?: ClientStatusEnums[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Type must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Type array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Type array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ClientTypeEnums), {
    each: true, // Validate each element in the array
    message: `Each Type must be one of: ${Object.values(ClientTypeEnums).join(', ')}`
  })
  type?: ClientTypeEnums[];

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
  @IsIn(Object.values(SortEnum), {
    message: `sort must be one of: ${Object.values(SortEnum).join(', ')}`
  })
  readonly sort?: SortEnum;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(SortByEnum), {
    message: `sortBy must be one of: ${Object.values(SortByEnum).join(', ')}`
  })
  readonly sortBy?: SortByEnum;
}
