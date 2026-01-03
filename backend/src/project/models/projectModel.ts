import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import Opportunity from '../../opportunity/opportunityModel';
import ProjectAsset from '../../projectAsset/projectAssetModel';
import ProjectManpower from '../../projectManpower/projectManpowerModel';
import User from '../../user/userModel';
import { Vehicle } from '../../vehicle/vahicle.model';
import { ProjectCategoryEnum, ProjectStatusEnum } from '../projectEnum';
import EtimadProject from './etimadProjectModel';
import ProjectMaterial from './peojectMaterial';
import ProjectAdditionalMaterialItem from './projectAdditionalMaterialItem';
import Client from '../../client/clientModel';
import UserProjects from './projectUsersModel';
import Lead from '../../lead/leadModel';
import Deal from '../../deal/model/dealModel';
import { Material } from '../../material/material.model';

@Table({
  tableName: 'projects',
  modelName: 'Project',
  timestamps: true
})
class Project extends Model {
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
  public name!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  public isCompleted!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  public type!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectCategoryEnum)),
    allowNull: true
  })
  public category!: ProjectCategoryEnum;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public clientId?: string;

  @BelongsTo(() => Client, { as: 'client' })
  public client?: Client;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  public startDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  public endDate?: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public duration!: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatusEnum)),
    allowNull: true
  })
  public status!: ProjectStatusEnum;

  @BelongsToMany(() => User, {
    through: () => UserProjects, // Join table
    as: 'assignedUsers' // Alias for association
  })
  public assignedUsers!: User[];

  @Column({
    type: DataType.STRING(500),
    allowNull: true
  })
  public description?: string;

  @BelongsToMany(() => Vehicle, 'ProjectVehicles', 'projectId', 'vehicleId')
  public vehicles!: Vehicle[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  public materialMargin!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  public materialMarginCommission!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public totalMaterialCost!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  public files?: {
    name: string;
    refs: string[];
  }[];

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public totalCarRent!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public totalCarRentPerDuration!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public accommodationCost!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0
  })
  public resourceCount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public foodCostPerDay!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public managementAdditionPercentage!: number;

  @HasMany(() => ProjectManpower)
  public projectManpowerResources!: ProjectManpower[];

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public manpowerTotalCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public finalManpowerTotalCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public totalAssetRentPrice!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public totalAssetBuyPrice!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public totalAssetsCost!: number;

  @HasMany(() => ProjectAsset)
  public projectAssets!: ProjectAsset[];

  @HasMany(() => ProjectAdditionalMaterialItem)
  public additionalMaterialItem?: ProjectAdditionalMaterialItem[];

  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public leadId!: string | null;

  @BelongsTo(() => Lead, { as: 'lead' })
  public lead?: Lead;

  @ForeignKey(() => Deal)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public dealId!: string | null;

  @BelongsTo(() => Deal, { as: 'deal' })
  public deal?: Deal;

  @ForeignKey(() => Opportunity)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public opportunityId?: string;

  @BelongsTo(() => Opportunity, { as: 'opportunity' })
  public opportunity?: Opportunity;

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
  public grandTotal!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public vat!: number;

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
  public marginAmount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public totalCost!: number;

  @HasOne(() => EtimadProject)
  public etimadProject?: EtimadProject;

  @BelongsToMany(() => Material, () => ProjectMaterial)
  materials?: Material[];
}

export default Project;
