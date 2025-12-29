import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo, HasOne, Default, HasMany } from 'sequelize-typescript';
import Proposal from '../proposal/models/proposalModel';
import ProposalFinanceTable from '../proposalFinanceTable/proposalFinanceTableModel';

@Table({
  tableName: 'proposal_contents',
  modelName: 'ProposalContent',
  timestamps: true
})
class ProposalContent extends Model {
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

  @BelongsTo(() => Proposal)
  public proposal!: Proposal;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public title?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public subtitle?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  public description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  public image?: string;

  // @HasOne(() => ProposalFinanceTable)
  // public financeTable?: ProposalFinanceTable;

  @AllowNull(true)
  @ForeignKey(() => ProposalContent)
  @Column({ type: DataType.UUID })
  parentId?: string;

  @BelongsTo(() => ProposalContent, { onDelete: 'CASCADE' })
  parent?: ProposalContent;

  @HasMany(() => ProposalContent, { foreignKey: 'parentId', as: 'children', onDelete: 'CASCADE' })
  public children!: ProposalContent[];
}

export default ProposalContent;
