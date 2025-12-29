import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import ProposalFinanceTable from '../proposalFinanceTable/proposalFinanceTableModel';
import { Material } from '../material/material.model';

@Table({
  tableName: 'proposal_finance_table_items',
  modelName: 'ProposalFinanceTableItem',
  timestamps: true
})
class ProposalFinanceTableItem extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @ForeignKey(() => ProposalFinanceTable)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public financeTableId!: string;

  @BelongsTo(() => ProposalFinanceTable)
  public financeTable!: ProposalFinanceTable;

  @ForeignKey(() => Material)
  @Column({ type: DataType.INTEGER, allowNull: false })
  materialId!: number;

  @BelongsTo(() => Material)
  material!: Material;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  public description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { max: 999999 }
  })
  public qty!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  public unitPrice!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public marginAmount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  public totalPrice!: number; // Calculated as Qty * Unit Price

  @Column({
    type: DataType.JSONB, // Change JSON to JSONB
    allowNull: true
  })
  public customColumns?: { key: string; value: string; index: number }[];
}

export default ProposalFinanceTableItem;
