import { Table, Column, Model, DataType, Default, AllowNull } from 'sequelize-typescript';
import { ManpowerAvailabilityStatusEnums, ManpowerNationalityEnums, ManpowerRoleEnums } from './manpowerEnum';

@Table({
  tableName: 'manpowers',
  modelName: 'Manpower',
  timestamps: true
})
class Manpower extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true
  })
  public name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ManpowerNationalityEnums)),
    allowNull: false
  })
  public nationality!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public phone?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  public role!: string[];

  @Column({
    type: DataType.ENUM(...Object.values(ManpowerAvailabilityStatusEnums)),
    allowNull: false
  })
  public availabilityStatus!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public salary!: number;

  @Default(0)
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public variableAllowance!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public transportationAllowance!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public iqamaCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public endOfServiceBenefit!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public saudization!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public visaFees!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public incomingFlightTicket!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public healthInsurance!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public generalOrganizationForSocialInsurance?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public totalCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public dailyCost!: number;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  public notes?: string;
}

export default Manpower;
