import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';
import { FileModel } from './uploader.enum';

export class UploaderInput {
  @Expose()
  @IsIn(Object.values(FileModel))
  model!: FileModel;
}
