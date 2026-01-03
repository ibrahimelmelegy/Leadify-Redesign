import { Table, Column, Model, DataType } from 'sequelize-typescript';

// Define attributes for PasswordResetLog model
interface PasswordResetLogAttributes {
  id?: number;
  userId: number;
  email: string;
  status: string;
  timestamp?: Date;
}

@Table({
  tableName: 'PasswordResetLogs',
  timestamps: false // Disable Sequelize's automatic timestamps
})
class PasswordResetLog extends Model<PasswordResetLogAttributes> implements PasswordResetLogAttributes {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  public timestamp!: Date;
}

export default PasswordResetLog;
