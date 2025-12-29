import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { sequelize } from '../../config/db'; // Make sure sequelize is configured with sequelize-typescript

// Define the attributes for the LoginFailure model
interface LoginFailureAttributes {
  id?: number;
  email: string;
  reason: string;
  timestamp?: Date;
}

@Table({
  tableName: 'LoginFailures',
  timestamps: false // Disable Sequelize's automatic timestamps
})
class LoginFailure extends Model<LoginFailureAttributes> implements LoginFailureAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  public id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public reason!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  public timestamp!: Date;
}

// Export the model to be used in other parts of the application
export default LoginFailure;
