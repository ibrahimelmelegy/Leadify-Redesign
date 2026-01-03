import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class GetNotificationsInput {
  @Expose()
  @IsOptional()
  @IsString()
  page?: string;

  @Expose()
  @IsOptional()
  @IsString()
  limit?: string;
}
