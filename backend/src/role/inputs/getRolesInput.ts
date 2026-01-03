import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class GetRolesInput {
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
}
