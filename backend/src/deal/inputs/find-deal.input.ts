import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';

export class FindDealInput {
  @Expose()
  @IsNotBlank({ message: 'Deal ID is required' })
  @IsUUID('4', { message: 'Deal ID must be a valid UUID' })
  dealId!: string;
}
