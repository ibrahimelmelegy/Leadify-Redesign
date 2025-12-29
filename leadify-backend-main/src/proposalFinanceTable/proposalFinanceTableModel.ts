import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import ProposalContent from '../proposalContent/proposalContentModel';
import ProposalFinanceTableItem from '../ProposalFinanceTableItem/proposalFinanceTableItemModel';
import Proposal from '../proposal/models/proposalModel';

@Table({
  tableName: 'proposal_finance_tables',
  modelName: 'ProposalFinanceTable',
  timestamps: true
})
class ProposalFinanceTable extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  // @ForeignKey(() => ProposalContent)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: false
  // })
  // public proposalContentId!: string;

  // @BelongsTo(() => ProposalContent)
  // public proposalContent!: ProposalContent;

  @ForeignKey(() => Proposal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public proposalId!: string;

  @BelongsTo(() => Proposal)
  public proposal!: Proposal;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public grandTotalPrice!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public discount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public vat!: number; // Calculated as (Grand Total Price - Discount) * 0.15

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public marginPercentage!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public finalTotalPrice!: number; // Calculated as Grand Total Price  - Discount + VAT

  @HasMany(() => ProposalFinanceTableItem)
  public items!: ProposalFinanceTableItem[];
}

export default ProposalFinanceTable;
