import { Expose } from 'class-transformer';
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class RejectProposalInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'rejectionReason must not exceed 500 characters.' })
  rejectionReason!: string;
}
