import { Expose } from 'class-transformer';
import { IsString, MaxLength, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateServiceInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Service Type must not exceed 100 characters.' })
  type?: string;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Service Price must be a number' })
  @Min(0, { message: 'Service Price must be greater than or equal to 0' })
  price?: number;
}
