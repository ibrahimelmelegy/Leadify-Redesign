import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignUserToProposalInput {
  @Expose()
  @IsNotEmpty()
  @IsArray()
  users!: string[];
}
