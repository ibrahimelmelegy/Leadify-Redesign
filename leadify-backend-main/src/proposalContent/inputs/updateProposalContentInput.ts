import { Expose } from 'class-transformer';
import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';

export class UpdateProposalContentInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  readonly parentId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Title must not exceed 255 characters.' })
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Subtitle must not exceed 255 characters.' })
  subtitle?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsString()
  image?: string;
}
