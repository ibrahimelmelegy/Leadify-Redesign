import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { ActivityModelClass } from './activities';
import Opportunity from '../../opportunity/opportunityModel';

@Table({
  tableName: 'opportunityActivities',
  modelName: 'OpportunityActivity',
  timestamps: true
})
export class OpportunityActivity extends ActivityModelClass {
  @ForeignKey(() => Opportunity)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public opportunityId!: string;

  @BelongsTo(() => Opportunity, { as: 'opportunity' })
  public opportunity!: Opportunity;
}
