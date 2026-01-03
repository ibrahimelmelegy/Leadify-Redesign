import { Table, Column, Model, DataType, AllowNull, HasMany } from 'sequelize-typescript';
import User from '../user/userModel';

@Table({
  tableName: 'roles',
  modelName: 'Role',
  timestamps: true
})
class Role extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  public name!: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  description?: string;

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  permissions!: string[];

  @HasMany(() => User, 'roleId')
  public users!: User[];

}

export default Role;
