import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import User from '../userModel';

@Table({
  tableName: 'Sessions',
  timestamps: false // Disable Sequelize's automatic timestamps
})
class Session extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @ForeignKey(() => User) // Assuming a User model exists
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  public expiresAt!: Date;
}

export default Session;
