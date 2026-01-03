import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Deal from './dealModel';

@Table({
  tableName: 'invoices',
  modelName: 'Invoice',
  timestamps: true
})
class Invoice extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public invoiceNumber!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public amount!: number;

  @Column({ type: DataType.DATE, allowNull: true })
  invoiceDate?: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  collected?: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  collectedDate?: Date;

  @ForeignKey(() => Deal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public dealId!: string;

  @BelongsTo(() => Deal, { as: 'deal' })
  public deal!: Deal;
}

export default Invoice;
