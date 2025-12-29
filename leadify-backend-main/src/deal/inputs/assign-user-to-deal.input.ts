import { IsInt } from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';
import { FindDealInput } from './find-deal.input';

export class AssignUserToDealInput extends FindDealInput {
  @IsNotBlank()
  @IsInt({ message: 'Assigned user must be an integer' })
  userId!: number;
}
