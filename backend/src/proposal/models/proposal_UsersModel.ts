import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Proposal from './proposalModel';
import User from '../../user/userModel';

@Table({
  tableName: 'proposalUsers',
  timestamps: true
})
class ProposalUsers extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @ForeignKey(() => Proposal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public proposalId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default ProposalUsers;
