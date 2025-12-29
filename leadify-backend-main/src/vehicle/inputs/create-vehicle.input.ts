import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, MaxLength, Min } from 'class-validator';
import { manufacturerVehicle } from '../vehivle.enum';

export class CreateVehicleInput {
  @Expose()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Rent Cost must be a positive number with a maximum of 2 decimal places.'
    }
  )
  @Max(100000000000000)
  rentCost!: number;

  @Expose()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Gas Cost must be a positive number with a maximum of 2 decimal places.'
    }
  )
  @Max(100000000000000)
  gasCost!: number;

  @Expose()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Oil Cost must be a positive number with a maximum of 2 decimal places.'
    }
  )
  @Max(100000000000000)
  oilCost!: number;

  @Expose()
  @IsEnum(manufacturerVehicle)
  manufacturer!: manufacturerVehicle;

  @Expose()
  @IsNotEmpty()
  @MaxLength(20)
  plate!: string;

  @Expose()
  @IsNotEmpty()
  @Min(0)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Regular Maintenance Cost must be a positive number with a maximum of 2 decimal places.'
    }
  )
  @Max(100000000000000)
  regularMaintenanceCost: number = 0;
}

export class UpdateVehicleInput extends CreateVehicleInput {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  vehicleId!: number;
}
