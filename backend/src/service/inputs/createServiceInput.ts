import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsNumber, Min } from 'class-validator';

export class CreateServiceInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Service Type must not exceed 100 characters.' })
  type!: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber({}, { message: 'Service Price must be a number' })
  @Min(0, { message: 'Service Price must be greater than or equal to 0' })
  price!: number;
}
