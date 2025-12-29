import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { LeadInput } from '../../opportunity/inputs/createOpportunityInput';
import { CustomValidateNested } from '../../utils/custom-validators/validate-nested.decorator';
import { CreateDealInput, CreateDealInvoiceInput, CreateDeliveryDetailsInput } from './creteDealInput';

export class ConvertLeadToDealInput extends CreateDealInput {
  @IsOptional()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  leadId?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @CustomValidateNested(CreateDeliveryDetailsInput)
  deliveryDetails?: CreateDeliveryDetailsInput[];

  @IsOptional()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  opportunityId?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @CustomValidateNested(CreateDealInvoiceInput)
  invoiceDetails?: CreateDealInvoiceInput[];
}

export class CreateLeadAndDealInput {
  @IsOptional()
  @Expose()
  @Type(() => LeadInput)
  @IsOptional()
  @ValidateNested()
  lead?: LeadInput;

  @IsOptional()
  @Expose()
  @IsUUID()
  opportunityId?: string;

  @IsOptional()
  @Expose()
  @IsUUID()
  clientId?: string;

  @Expose()
  @Type(() => CreateDealInput)
  @ValidateNested()
  deal!: CreateDealInput;

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
}
