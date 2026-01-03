import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, IsInt, Min, IsOptional, IsNumber, IsIn, IsArray, ArrayNotEmpty } from 'class-validator';
import { MissionEnum } from '../projectManpowerEnum';

export class CreateProjectManpowerInput {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  public projectId!: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  public manpowerId!: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Estimated work days must be at least 1' })
  public estimatedWorkDays!: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Actual work days must be at least 1' })
  public actualWorkDays?: number;

  @Expose()
  @IsNotEmpty()
  @IsArray() // Ensures mission is an array
  @ArrayNotEmpty() // Ensures it's not an empty array
  @IsIn(Object.keys(MissionEnum) as string[], {
    each: true, // Apply validation to each array element
    message: `mission must be one of: ${Object.keys(MissionEnum)
      .filter(key => isNaN(Number(key)))
      .join(', ')}`
  })
  public mission!: string[];

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
