import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, Table, Index } from 'sequelize-typescript';
import User from '../user/userModel';
import { LeadSourceEnums, LeadStatusEnums } from './leadEnum';
import LeadUsers from './model/lead_UsersModel';

@Table({
  tableName: 'leads',
  modelName: 'Lead',
  timestamps: true
})
class Lead extends Model {
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

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: { isNumeric: true }
  })
  public phone?: string;

  @Default(LeadSourceEnums.EMAIL)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(LeadSourceEnums))
  })
  public leadSource!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  public otherSource?: string;


  @BelongsToMany(() => User, {
    through: () => LeadUsers, // Join table
    as: 'users' // Alias for association
  })
  public users!: User[];

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  public notes?: string;

  @Default(LeadStatusEnums.NEW)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(LeadStatusEnums))
  })
  public status!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  lastContactDate?: Date;
}

export default Lead;
