import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { FileModel } from './uploader.enum';

@Table({
  tableName: 'uploader',
  timestamps: true
})
export class Uploader extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  path!: string;

  @Column({
    type: DataType.ENUM(...Object.keys(FileModel)),
    allowNull: false
  })
  model!: FileModel;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  hasReference!: boolean;
}
