import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn, IsArray, ArrayNotEmpty, ArrayUnique, IsISO8601, IsUUID, IsString } from 'class-validator';
import { SortEnum } from '../../lead/leadEnum';
import { ProposalSortByEnum, ProposalStatusEnum, ProposalTypeEnum } from '../proposalEnum';

export class GetProposalsInput {
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
  @IsIn(Object.values(ProposalSortByEnum), {
    message: `sortBy must be one of: ${Object.values(ProposalSortByEnum).join(', ')}`
  })
  readonly sortBy?: ProposalSortByEnum;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Status must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Status array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Status array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ProposalStatusEnum), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(ProposalStatusEnum).join(', ')}`
  })
  status?: ProposalStatusEnum[];

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray({ message: 'Type must be an array' }) // Validate the field is an array
  @ArrayNotEmpty({ message: 'Type array must not be empty' }) // Ensure the array is not empty
  @ArrayUnique({ message: 'Type array must not contain duplicate values' }) // Ensure no duplicates
  @IsIn(Object.values(ProposalTypeEnum), {
    each: true, // Validate each element in the array
    message: `Each status must be one of: ${Object.values(ProposalStatusEnum).join(', ')}`
  })
  type?: ProposalTypeEnum[];

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
  @IsUUID()
  readonly relatedEntityId?: string;
}
