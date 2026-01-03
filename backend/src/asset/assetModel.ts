import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'assets',
  modelName: 'Asset',
  timestamps: true
})
class Asset extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  })
  public name!: string;

  @AllowNull(true)
  @Column({
    type: DataType.FLOAT
  })
  public rentPrice?: number;

  @AllowNull(true)
  @Column({
    type: DataType.FLOAT
  })
  public buyPrice?: number;
}

export default Asset;
