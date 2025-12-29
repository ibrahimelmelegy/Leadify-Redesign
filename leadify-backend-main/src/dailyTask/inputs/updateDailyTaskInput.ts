import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, MaxLength, IsIn, IsDate, IsNumber } from 'class-validator';
import { DailyTaskPriorityEnum, DailyTaskStatusEnum } from '../dailyTaskEnum';

export class UpdateDailyTaskInput {
  @Expose()
  @IsOptional()
  @IsUUID('4', { message: 'Invalid task ID' })
  id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Task name must not exceed 255 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(DailyTaskPriorityEnum), {
    message: `priority must be one of: ${Object.values(DailyTaskPriorityEnum).join(', ')}`
  })
  priority?: DailyTaskPriorityEnum;

  @Expose()
  @IsOptional()
  salesRepresentativeId?: number;

  @Expose()
  @IsOptional()
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
  @IsOptional()
  @IsNumber({}, { message: 'Cost must be a number' })
  cost?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Down payment must be a number' })
  downPayment?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Total paid must be a number' })
  totalPaid?: number;

  @Expose()
  @IsOptional()
  @IsString()
  notes?: string;
}
