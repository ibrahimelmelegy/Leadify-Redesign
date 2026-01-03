import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import User from '../user/userModel';
import Lead from '../lead/leadModel';
import { OpportunityPriorityEnums, OpportunityStageEnums } from './opportunityEnum';
import Client from '../client/clientModel';
import OpportunityUsers from './model/oppotyunity_UsersModel';

@Table({
  tableName: 'opportunities',
  modelName: 'Opportunity',
  timestamps: true
})
class Opportunity extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public leadId?: string;

  @BelongsTo(() => Lead, { as: 'lead' })
  public lead!: Lead;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public clientId!: string;

  @BelongsTo(() => Client, { as: 'client' })
  public client?: Client;

  @BelongsToMany(() => User, {
    through: () => OpportunityUsers, // Join table
    as: 'users' // Alias for association
  })
  public users!: User[];

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public interestedIn?: string;

  @Column({
    type: DataType.ENUM(...Object.values(OpportunityStageEnums))
  })
  public stage!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  public estimatedValue?: number;

  @Column({ type: DataType.DATE, allowNull: true })
  expectedCloseDate?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(OpportunityPriorityEnums)),
    allowNull: true
  })
  public priority?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true
  })
  public nextSteps?: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  public reasonOfLose?: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  public notes?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  })
  public profit?: number;
}

export default Opportunity;
