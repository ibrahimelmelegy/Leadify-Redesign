import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomColumnInput {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public key!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public value!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  public index?: string;
}
