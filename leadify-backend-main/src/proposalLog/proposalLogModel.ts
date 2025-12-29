import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Proposal from '../proposal/models/proposalModel';
import User from '../user/userModel';
import { ProposalActionEnum } from './proposalLogEnum';

@Table({ tableName: 'proposalLogs', modelName: 'proposalLog', timestamps: true })
class ProposalLog extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @ForeignKey(() => Proposal)
  @Column({ type: DataType.UUID, allowNull: false })
  public proposalId!: string;

  @BelongsTo(() => Proposal)
  public proposal!: Proposal;

  @Column({ type: DataType.ENUM(...Object.values(ProposalActionEnum)) })
  public action!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @BelongsTo(() => User, { as: 'user' })
  public user!: User;
}
export default ProposalLog;
