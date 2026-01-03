import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DailyTaskPriorityEnum, DailyTaskStatusEnum } from './dailyTaskEnum';
import User from '../user/userModel';
import Client from '../client/clientModel';

@Table({
  tableName: 'dailyTasks',
  modelName: 'dailyTask',
  timestamps: true
})
class DailyTask extends Model {
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
    type: DataType.ENUM(...Object.values(DailyTaskPriorityEnum)),
    allowNull: false
  })
  public priority!: DailyTaskPriorityEnum;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER, 
    allowNull: false
  })
  public salesRepresentativeId!: number;

  @BelongsTo(() => User, { as: 'salesRepresentative' })
  public salesRepresentative?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER, 
    allowNull: false
  })
  public userId!: number;

  @BelongsTo(() => User, { as: 'user' })
  public user!: User;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  public clientId?: string;

  @BelongsTo(() => Client, { as: 'client' })
  public client?: Client;


  @Column({
    type: DataType.ENUM(...Object.values(DailyTaskStatusEnum)),
    allowNull: true
  })
  public status!: DailyTaskStatusEnum;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public cost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public downPayment!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public totalPaid!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public remainingAmount!: number;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  public notes?: string;
}

export default DailyTask;
