import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Opportunity from '../opportunityModel';
import User from '../../user/userModel';

@Table({
  tableName: 'opportunityUsers',
  timestamps: true
})
class OpportunityUsers extends Model {
  @ForeignKey(() => Opportunity)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public opportunityId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default OpportunityUsers;
