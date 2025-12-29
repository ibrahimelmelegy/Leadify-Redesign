import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf
} from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';
import { CustomValidateNested } from '../../utils/custom-validators/validate-nested.decorator';
import { ContractTypeEnums, DealStageEnums } from '../dealEnum';

export class CreateDealInvoiceInput {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsInt({ message: 'Id must be an integer' })
  id?: number;

  @Expose()
  @IsNotBlank({ message: 'Invoice Number is required' })
  @IsString({ message: 'Invoice Number must be a string' })
  @MaxLength(50, { message: 'Invoice Number must not exceed 50 characters' })
  invoiceNumber!: string;

  @Expose()
  @IsNotEmpty({ message: 'Invoice Amount is required' })
  @IsNumber()
  amount!: number;

  @Expose()
  @IsDateString()
  invoiceDate?: Date;

  @Expose()
  @IsOptional()
  @IsBoolean()
  collected?: boolean;

  @Expose()
  @IsOptional()
  @IsDateString()
  collectedDate?: Date;
}

export class CreateDeliveryDetailsInput {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsInt({ message: 'Id must be an integer' })
  id?: number;

  @Expose()
  @IsNotBlank({ message: 'Delivery Details is required' })
  @IsString({ message: 'Delivery Details must be a string' })
  @MaxLength(500, { message: 'Delivery Details must not exceed 500 characters' })
  deliveryDetails!: string;

  @Expose()
  @IsDateString()
  deliveryDate!: Date;
}

export class CreateDealInput {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsInt({ message: 'Assigned user must be an integer',each: true })
  users?: number[];

  @Expose()
  @IsNotBlank({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @Expose()
  @IsOptional()
  @IsNotBlank({ message: 'Company Name is required' })
  @IsString({ message: 'Company Name must be a string' })
  @MaxLength(100, { message: 'Company Name must not exceed 100 characters' })
  companyName?: string;

  @Expose()
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price!: string;

  @Expose()
  @IsNotEmpty({ message: 'Contract Type is required' })
  @IsIn(Object.values(ContractTypeEnums), {
    message: `Contract Type must be one of: ${Object.values(ContractTypeEnums).join(', ')}`
  })
  contractType!: ContractTypeEnums;

  @Expose()
  @IsNotEmpty({ message: 'Deal Stage is required' })
  @IsIn(Object.values(DealStageEnums), {
    message: `Deal Stage must be one of: ${Object.values(DealStageEnums).join(', ')}`
  })
  stage!: DealStageEnums;

  @Expose()
  @ValidateIf(o => o.stage === DealStageEnums.CANCELLED)
  @IsNotBlank({
    message: 'Cancelled Reason is required'
  })
  @IsString({ message: 'Cancelled Reason must be a string' })
  @MaxLength(250, { message: 'Cancelled Reason must not exceed 250 characters' })
  cancelledReason?: string;

  @Expose()
  @IsDateString()
  signatureDate!: Date;
}

export class CreateInvoiceInput {
  @Expose()
  @IsArray()
  @CustomValidateNested(CreateDealInvoiceInput)
  invoiceDetails?: CreateDealInvoiceInput[];

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  dealId!: string;
}
export class CreateDeliveryInput {
  @Expose()
  @IsArray()
  @CustomValidateNested(CreateDeliveryDetailsInput)
  deliveryDetails?: CreateDeliveryDetailsInput[];

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  dealId!: string;
}
