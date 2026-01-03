import { Expose } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsPhoneNumber, IsPositive, IsString, IsUUID, Length, Matches, ValidateIf } from 'class-validator';
import { ClientIndustryEnums, ClientStatusEnums, ClientTypeEnums } from '../clientEnum';

export class CreateClientInput {
  @Expose()
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @Expose()
  @IsString()
  @Length(1, 100, { message: 'Client Name cannot be empty and must be unique.' })
  clientName!: string;

  @Expose()
  @ValidateIf(o => !o.phoneNumber)
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsOptional()
  @Length(0, 50)
  email?: string;

  @Expose()
  @ValidateIf(o => !o.email)
  @IsOptional()
  @IsPhoneNumber()
  @Matches(/^\+\d{1,14}$/, { message: 'Phone Number must follow the format: +123456789.' })
  phoneNumber?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 100)
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ClientTypeEnums), { message: `Client Type must be either ${Object.values(ClientTypeEnums)}.` })
  clientType?: ClientTypeEnums;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 100)
  streetAddress?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 50)
  city?: string;

  @Expose()
  @IsOptional()
  @IsString()
  state?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 10)
  zipCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(Object.values(ClientIndustryEnums), { message: `Industry must be either ${Object.values(ClientIndustryEnums)}.` })
  industry?: string;

  @Expose()
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  users?: number[];

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ClientStatusEnums), { message: `Client Status must be either ${Object.values(ClientStatusEnums)}.` })
  clientStatus?: ClientStatusEnums = ClientStatusEnums.ACTIVE;

  @Expose()
  @IsOptional()
  fileUpload?: string[];
}
