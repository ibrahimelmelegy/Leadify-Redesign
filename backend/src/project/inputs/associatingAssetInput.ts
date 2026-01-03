import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class AssociatingAssetToProjectInput {
  @Expose()
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each asset ID must be a valid UUID' })
  public assetIds!: string[];
}
