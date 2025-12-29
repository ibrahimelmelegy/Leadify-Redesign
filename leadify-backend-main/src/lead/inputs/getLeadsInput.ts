import { IsOptional, IsInt, IsString, IsIn, IsISO8601, Min, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { LeadSourceEnums, LeadStatusEnums, SortByEnum, SortEnum } from '../leadEnum';
import { Expose, Transform } from 'class-transformer';

export class GetLeadsInput {
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
  @IsIn(Object.values(LeadStatusEnums), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(LeadStatusEnums).join(', ')}`
  })
  status?: LeadStatusEnums[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Source must be an array' }) // Validate that it's an array
  @ArrayUnique({ message: 'Source array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(LeadSourceEnums), {
    each: true, 
    message: `Each leadSource must be one of: ${Object.values(LeadSourceEnums).join(', ')}`
  })
  leadSource?: LeadSourceEnums[];

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
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date' })
  fromDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date' })
  toDate?: string;

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

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'From lastContactDate must be a valid ISO 8601 date' })
  fromLastContactDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To lastContactDate must be a valid ISO 8601 date' })
  toLastContactDate?: string;
}
