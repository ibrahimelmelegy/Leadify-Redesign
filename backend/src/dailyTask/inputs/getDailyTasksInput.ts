import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsArray, ArrayNotEmpty, ArrayUnique, IsIn } from 'class-validator';
import { DailyTaskStatusEnum } from '../dailyTaskEnum';

export class GetDailyTasksInput {
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
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Status must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Status array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Status array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(DailyTaskStatusEnum), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(DailyTaskStatusEnum).join(', ')}`
  })
  status?: DailyTaskStatusEnum[];
}
