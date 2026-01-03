import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Deal from './dealModel';

@Table({
  tableName: 'deals_deliveries',
  modelName: 'DealDelivery',
  timestamps: true
})
class DealDelivery extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public deliveryDetails!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public deliveryDate!: Date;

  @ForeignKey(() => Deal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public dealId!: string;

  @BelongsTo(() => Deal, { as: 'deal' })
  public deal!: Deal;
}

export default DealDelivery;
