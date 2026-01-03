import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Lead from '../lead/leadModel';
import User from '../user/userModel';
import { ClientIndustryEnums, ClientStatusEnums } from './clientEnum';
import ClientUsers from './client_UsersModel';

@Table({
  tableName: 'clients',
  modelName: 'client',
  timestamps: true
})
class Client extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public clientName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public phoneNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public companyName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public clientType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public streetAddress?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public city?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'ACTIVE'
  })
  public state?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public zipCode?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ClientIndustryEnums)),
    allowNull: true
  })
  public industry?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ClientStatusEnums)),
    allowNull: false,
    defaultValue: ClientStatusEnums.ACTIVE
  })
  public clientStatus!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true
  })
  public fileUpload?: string[];

  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public leadId?: string;

  @BelongsTo(() => Lead, { as: 'lead' })
  public lead?: Lead;

  @BelongsToMany(() => User, {
    through: () => ClientUsers, // Join table
    as: 'users' // Alias for association
  })
  public users!: User[];
}

export default Client;
