import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model } from 'sequelize-typescript';
import User from '../../user/userModel';
export type ActivityActionType = 'create' | 'update' | 'assign' | 'export';

export abstract class ActivityModelClass extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true
  })
  public id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  descripion!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  status!: ActivityActionType;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public userId!: number;

  @BelongsTo(() => User, { as: 'user' })
  public user!: User;
}
