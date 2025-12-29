import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { ActivityModelClass } from './activities';
import Lead from '../../lead/leadModel';

@Table({
  tableName: 'leadActivities',
  modelName: 'LeadActivity',
  timestamps: true
})
export class LeadActivity extends ActivityModelClass {
  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public leadId!: string;

  @BelongsTo(() => Lead, { as: 'lead' })
  public Lead!: Lead;
}
