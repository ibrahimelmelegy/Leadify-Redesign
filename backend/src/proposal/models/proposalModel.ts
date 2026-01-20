import { Table, Column, Model, DataType, AllowNull, Default, HasMany, BelongsTo, ForeignKey, BelongsToMany, HasOne, Index } from 'sequelize-typescript';
import Opportunity from '../../opportunity/opportunityModel';
import Deal from '../../deal/model/dealModel';
import { ProposalModelEnum, ProposalStatusEnum, ProposalTypeEnum } from '../proposalEnum';
import ProposalContent from '../../proposalContent/proposalContentModel';
import User from '../../user/userModel';
import Project from '../../project/models/projectModel';
import ProposalLog from '../../proposalLog/proposalLogModel';
import ProposalUsers from './proposal_UsersModel';
import ProposalFinanceTable from '../../proposalFinanceTable/proposalFinanceTableModel';
@Table({
  tableName: 'proposals',
  modelName: 'Proposal',
  timestamps: true
})
class Proposal extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public relatedEntityId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProposalModelEnum)),
    allowNull: true
  })
  public relatedEntityType!: ProposalModelEnum;

  @BelongsTo(() => Opportunity, { foreignKey: 'relatedEntityId', constraints: false })
  public opportunity?: Opportunity;

  @BelongsTo(() => Deal, { foreignKey: 'relatedEntityId', constraints: false })
  public deal?: Deal;

  @BelongsTo(() => Project, { foreignKey: 'relatedEntityId', constraints: false })
  public project?: Project;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  public title!: string;

  @Default('1.0')
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public version!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  public proposalDate!: Date;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(ProposalTypeEnum)),
    allowNull: false
  })
  public type!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  public reference!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  public proposalFor!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public companyLogo!: string;

  @BelongsToMany(() => User, {
    through: () => ProposalUsers, // Join table
    as: 'users' // Alias for association
  })
  public users!: User[];

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  public notes?: string;

  @AllowNull(true)
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true
  })
  public fileAttachments?: string[];

  @Default(ProposalStatusEnum.WAITING_APPROVAL)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(ProposalStatusEnum)),
    allowNull: true
  })
  public status!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500)
  })
  public rejectionReason?: string;

  // @HasMany(() => ProposalContent)
  // public contents!: ProposalContent[];

  @HasOne(() => ProposalFinanceTable)
  public financeTable!: ProposalFinanceTable;

  @HasMany(() => ProposalLog)
  public logs!: ProposalLog[];

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  public content?: string;

  // Custom getter to return the related entity based on its type
  public getRelatedEntity(): Opportunity | Deal | Project | null {
    switch (this.relatedEntityType) {
      case ProposalModelEnum.Opportunity:
        return this.opportunity || null;
      case ProposalModelEnum.Deal:
        return this.deal || null;
      case ProposalModelEnum.Project:
        return this.project || null;
      default:
        return null;
    }
  }
}
export default Proposal;
