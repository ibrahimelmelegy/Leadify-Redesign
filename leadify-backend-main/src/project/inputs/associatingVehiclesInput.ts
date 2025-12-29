import { Expose } from 'class-transformer';
import { ArrayMinSize, IsInt, IsOptional } from 'class-validator';

export class AssociatingVehiclesToProjectInput {
  @Expose()
  @IsOptional()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  vehiclesIds?: number[];
}
