import { IsInt, IsOptional, Min } from 'class-validator';

export class completeProjectCreationInput {
  @IsOptional()
  @IsInt()
  @Min(0)
  discount: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  marginPercentage: number = 0;
}
