import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Lead from '../leadModel';
import User from '../../user/userModel';

@Table({
  tableName: 'leadUsers',
  timestamps: true
})
class LeadUsers extends Model {
  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public leadId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default LeadUsers;
