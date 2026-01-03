import { Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min, ValidateNested } from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';

export class createAdditionalMaterialItemsInput {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotBlank()
  name!: string;

  @Expose()
  @Min(0)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Item Price must be a positive number with a maximum of 2 decimal places.'
    }
  )
  @Max(100000000000000)
  price!: number;
}
export class CreateAdditionalMaterialInput {
  @Expose()
  @IsNotBlank()
  name!: string;

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => createAdditionalMaterialItemsInput)
  @ValidateNested()
  items!: createAdditionalMaterialItemsInput[];
}

export class UpdateAdditionalMaterialInput extends CreateAdditionalMaterialInput {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  materialId!: number;
}
