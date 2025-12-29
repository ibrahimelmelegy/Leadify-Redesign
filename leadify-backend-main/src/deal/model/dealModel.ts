import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import Lead from '../../lead/leadModel';
import Opportunity from '../../opportunity/opportunityModel';
import User from '../../user/userModel';
import { ContractTypeEnums, DealStageEnums } from '../dealEnum';
import DealDelivery from './dealDeliveryMode copy';
import Invoice from './invoiceMode';
import Client from '../../client/clientModel';
import DealUsers from './deal_UsersModel';

@Table({
  tableName: 'deals',
  modelName: 'Deal',
  timestamps: true
})
class Deal extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public companyName?: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public price!: number;

  @Column({ type: DataType.ENUM(...Object.values(ContractTypeEnums)), allowNull: false })
  public contractType!: ContractTypeEnums;

  @Column({ type: DataType.DATE, allowNull: true })
  signatureDate!: Date;

  @Column({ type: DataType.ENUM(...Object.values(DealStageEnums)), allowNull: true })
  stage!: DealStageEnums;

  @Column({ type: DataType.STRING, allowNull: true })
  cancelledReason?: string;

  @BelongsToMany(() => User, {
    through: () => DealUsers, // Join table
    as: 'users' // Alias for association
  })
  public users!: User[];

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
  public clientId?: string;

  @BelongsTo(() => Client, { as: 'client' })
  public client!: Client;

  @ForeignKey(() => Opportunity)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public opportunityId?: string;

  @BelongsTo(() => Opportunity, { as: 'opportunity' })
  public opportunity!: Opportunity;

  @HasMany(() => Invoice, { as: 'invoice', onDelete: 'CASCADE' })
  public invoice?: Invoice[];
  @HasMany(() => DealDelivery, { as: 'deliveryDetails', onDelete: 'CASCADE' })
  public deliveryDetails?: DealDelivery[];
}

export default Deal;
