import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, IsNumber, Min } from 'class-validator';

export class UpdateAssetInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Asset Name must not exceed 100 characters.' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Rent Price must be a number' })
  @Min(0, { message: 'Rent Price must be greater than or equal to 0' })
  rentPrice?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Buy Price must be a number' })
  @Min(0, { message: 'Buy Price must be greater than or equal to 0' })
  buyPrice?: number;
}