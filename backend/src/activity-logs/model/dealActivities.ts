import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import Deal from '../../deal/model/dealModel';
import { ActivityModelClass } from './activities';

@Table({
  tableName: 'dealActivities',
  modelName: 'DealActivity',
  timestamps: true
})
export class DealActivity extends ActivityModelClass {
  @ForeignKey(() => Deal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public dealId!: string;

  @BelongsTo(() => Deal, { as: 'deal' })
  public deal!: Deal;
}
