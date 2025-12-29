import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID, IsInt, Min, IsNumber, IsIn, IsArray } from 'class-validator';
import { MissionEnum } from '../projectManpowerEnum';

export class UpdateProjectManpowerInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  public projectId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  public manpowerId?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Estimated work days must be at least 1' })
  public estimatedWorkDays?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Actual work days must be at least 1' })
  public actualWorkDays?: number;

  @Expose()
  @IsOptional()
  @IsArray() // Ensures mission is an array
  @IsIn(Object.keys(MissionEnum).filter(key => isNaN(Number(key))), {
    each: true, // Validate each element in the array
    message: `Each mission must be one of: ${Object.keys(MissionEnum)
      .filter(key => isNaN(Number(key)))
      .join(', ')}`
  })
  public mission?: string[];

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Other costs must be a positive number' })
  public otherCosts?: number;

  @Expose()
  @IsOptional()
  @IsString()
  public otherCostsReason?: string;
}
