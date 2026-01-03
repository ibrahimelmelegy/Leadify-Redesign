import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn, IsUUID } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { UserSortByEnum, UserStatusEnum } from '../userEnum';

export class GetUsersInput {
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
  @IsIn(Object.values(UserSortByEnum), {
    message: `sortBy must be one of: ${Object.values(UserSortByEnum).join(', ')}`
  })
  readonly sortBy?: UserSortByEnum;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Invalid status value.' })
  @IsIn(Object.values(UserStatusEnum), {
    message: `Status must be one of: ${Object.values(UserStatusEnum).join(', ')}`
  })
  readonly status?: UserStatusEnum;

  @Expose()
  @IsOptional()
  @IsUUID('4', { message: 'Invalid role ID format.' })
  readonly roleId?: string;
}
