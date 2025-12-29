import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn, IsString, IsArray, ArrayNotEmpty, ArrayUnique, IsISO8601 } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { ProjectCategoryEnum, ProjectSortByEnum, ProjectStatusEnum, ProjectTypeEnum } from '../projectEnum';

export class GetProjectsInput {
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
  @IsIn(Object.values(ProjectSortByEnum), {
    message: `sortBy must be one of: ${Object.values(ProjectSortByEnum).join(', ')}`
  })
  readonly sortBy?: ProjectSortByEnum;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Status must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Status array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Status array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ProjectStatusEnum), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(ProjectStatusEnum).join(', ')}`
  })
  status?: ProjectStatusEnum[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Type must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Type array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Type array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ProjectTypeEnum), {
    each: true, // Validate each element in the array
    message: `Each Type must be one of: ${Object.values(ProjectTypeEnum).join(', ')}`
  })
  type?: ProjectTypeEnum[];

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date' })
  fromStartDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date' })
  toStartDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date' })
  fromEndDate?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date' })
  toEndDate?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'category must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'category array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'category array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ProjectCategoryEnum), {
    each: true, // Validate each element in the array
    message: `Each category must be one of: ${Object.values(ProjectCategoryEnum).join(', ')}`
  })
  category?: ProjectCategoryEnum[];
}
