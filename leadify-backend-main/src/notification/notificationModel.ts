import { BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from '../user/userModel';
import { NotificationReadEnums, NotificationTypeEnums } from './notificationEnum';

@Table({
  tableName: 'notifications',
  modelName: 'Notification',
  timestamps: true
})
class Notification extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public body_en!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public body_ar!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public userId!: number;

  @BelongsTo(() => User, { as: 'user' })
  public user!: User;

  @Default(NotificationReadEnums.UN_READ)
  @Column({
    type: DataType.ENUM(...Object.values(NotificationReadEnums))
  })
  public read!: string;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationTypeEnums))
  })
  public type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public target?: string;
}

export default Notification;
