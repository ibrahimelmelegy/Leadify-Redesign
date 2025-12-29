import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'services',
  modelName: 'Service',
  timestamps: true
})
class Service extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  public type!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  public price!: number;
}

export default Service;
