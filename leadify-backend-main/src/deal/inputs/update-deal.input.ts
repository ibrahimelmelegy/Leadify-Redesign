import { Expose } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';
import { CustomValidateNested } from '../../utils/custom-validators/validate-nested.decorator';
import { ContractTypeEnums, DealStageEnums } from '../dealEnum';
import { CreateDealInvoiceInput, CreateDeliveryDetailsInput } from './creteDealInput';
import { FindDealInput } from './find-deal.input';

export class UpdateDealInput extends FindDealInput {
  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Deal Stage is required' })
  @IsIn(Object.values(DealStageEnums), {
    message: `Deal Stage must be one of: ${Object.values(DealStageEnums).join(', ')}`
  })
  stage?: DealStageEnums;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsInt({ message: 'Assigned user must be an integer', each: true })
  users?: number[];

  @Expose()
  @IsOptional()
  @IsNotBlank({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank({ message: 'Company Name is required' })
  @IsString({ message: 'Company Name must be a string' })
  @MaxLength(100, { message: 'Company Name must not exceed 100 characters' })
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price!: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Contract Type is required' })
  @IsIn(Object.values(ContractTypeEnums), {
    message: `Contract Type must be one of: ${Object.values(ContractTypeEnums).join(', ')}`
  })
  contractType!: ContractTypeEnums;

  @Expose()
  @IsOptional()
  @ValidateIf(o => o.stage === DealStageEnums.CANCELLED)
  @IsNotBlank({
    message: 'Cancelled Reason is required'
  })
  @IsString({ message: 'Cancelled Reason must be a string' })
  @MaxLength(250, { message: 'Cancelled Reason must not exceed 250 characters' })
  cancelledReason?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  signatureDate!: Date;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  deletedInvoiceIds?: number[];

  @Expose()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  deletedDeliveryIds?: number[];

  @Expose()
  @IsOptional()
  @IsArray()
  @CustomValidateNested(CreateDeliveryDetailsInput)
  deliveryDetails?: CreateDeliveryDetailsInput[];

  @Expose()
  @IsOptional()
  @IsArray()
  @CustomValidateNested(CreateDealInvoiceInput)
  invoiceDetails?: CreateDealInvoiceInput[];

  @IsOptional()
  @Expose()
  @IsUUID()
  clientId?: string;
}
