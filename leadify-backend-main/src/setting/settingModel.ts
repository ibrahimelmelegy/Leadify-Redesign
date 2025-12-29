import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'settings',
  modelName: 'Setting',
  timestamps: true
})
class Setting extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true
  // })
  // public secretKey?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public emailApiKey?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public logo?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public favIcon?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public primaryColor?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public secondaryColor?: string;
}

export default Setting;
