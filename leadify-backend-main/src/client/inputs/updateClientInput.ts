import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsPositive, IsString, Length, Matches, MaxLength } from 'class-validator';
import { ClientIndustryEnums, ClientStatusEnums, ClientTypeEnums } from '../clientEnum';

export class UpdateClientInput {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Client name must not exceed 100 characters' })
  clientName?: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email?: string;

  @Expose()
  @IsOptional()
  @Matches(/^\+?[0-9]{1,15}$/, {
    message: 'Phone number must be a valid international phone number format'
  })
  @MaxLength(15, { message: 'Phone number must not exceed 15 characters' })
  readonly phoneNumber?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsIn(Object.values(ClientTypeEnums), {
    message: `Client type must be one of: ${Object.values(ClientTypeEnums).join(', ')}`
  })
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
  @IsIn(Object.values(ClientStatusEnums), {
    message: `Status must be one of: ${Object.values(ClientStatusEnums).join(', ')}`
  })
  clientStatus?: ClientStatusEnums;

  @Expose()
  @IsOptional()
  fileUpload?: string[];
}
