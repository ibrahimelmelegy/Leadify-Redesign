import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import User from '../userModel';

@Table({
  tableName: 'ResetTokens',
  timestamps: false // Disable automatic `createdAt` and `updatedAt` columns
})
class ResetToken extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @ForeignKey(() => User) // Assuming you have a User model related to userId
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiresAt!: Date;
}

export default ResetToken;
