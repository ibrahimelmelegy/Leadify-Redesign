import { Expose } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { IsNotBlank } from '../../utils/custom-validators/not-bank.validator';

export class CreateOrUpdateSettingInput {
  // @Expose()
  // @IsOptional()
  // @IsNotBlank()
  // public secretKey?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public emailApiKey?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public name?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  @IsEmail()
  public email?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public logo?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public favIcon?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public primaryColor?: string;

  @Expose()
  @IsOptional()
  @IsNotBlank()
  public secondaryColor?: string;
}
