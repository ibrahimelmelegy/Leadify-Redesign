import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApplicationStatusEnum, ContractTypeEnum, ProposalStatusEnum } from '../projectEnum';
import Project from './projectModel';

@Table({
  tableName: 'etimad_projects',
  modelName: 'EtimadProject',
  timestamps: true
})
class EtimadProject extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  public abbreviation!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  public organizationName!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  public rfpName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ContractTypeEnum)),
    allowNull: false
  })
  public contractType!: ContractTypeEnum;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      isDecimal: true
    }
  })
  public tenderPrice?: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  public businessLine?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true
  })
  public estimatedBudget?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  })
  public companyMargin?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  public submissionDate?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ProposalStatusEnum)),
    allowNull: false
  })
  public proposalStatus!: ProposalStatusEnum;

  @Column({
    type: DataType.ENUM(...Object.values(ApplicationStatusEnum)),
    allowNull: false
  })
  public applicationStatus!: ApplicationStatusEnum;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public projectId!: string;

  @BelongsTo(() => Project, { as: 'project' })
  public project!: Project

}

export default EtimadProject;
