import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class AdditionalMaterialItemInputDto {
  @Expose()
  @IsNotEmpty()
  @IsInt()
  public itemId!: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public quantity!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  public price!: number;
}

export class CreateMaterialInput {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  materialId?: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public description!: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public quantity!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  public unitPrice!: number;

  @IsOptional()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public materialCategoryId?: number;

  @Expose()
  @IsOptional()
  @IsUUID()
  public serviceId?: string;
}
