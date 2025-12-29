import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDate, IsNumber, MaxLength, IsIn } from 'class-validator';
import { DailyTaskPriorityEnum, DailyTaskStatusEnum } from '../dailyTaskEnum';

export class CreateDailyTaskInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Task name must not exceed 255 characters' })
  name!: string;

  @Expose()
  @IsNotEmpty()
  @IsIn(Object.values(DailyTaskPriorityEnum), {
    message: `priority must be one of: ${Object.values(DailyTaskPriorityEnum).join(', ')}`
  })
  priority!: DailyTaskPriorityEnum;

  @Expose()
  @IsNotEmpty()
  salesRepresentativeId?: number;

  @Expose()
  @IsNotEmpty()
  userId?: number;

  @Expose()
  @IsOptional()
  @IsUUID('4', { message: 'Invalid clientId' })
  clientId?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(DailyTaskStatusEnum), {
    message: `status must be one of: ${Object.values(DailyTaskStatusEnum).join(', ')}`
  })
  status?: DailyTaskStatusEnum;

  @Expose()
  @IsNotEmpty()
  @IsNumber({}, { message: 'Cost must be a number' })
  cost!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber({}, { message: 'Down payment must be a number' })
  downPayment!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber({}, { message: 'Total paid must be a number' })
  totalPaid!: number;

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;
}
