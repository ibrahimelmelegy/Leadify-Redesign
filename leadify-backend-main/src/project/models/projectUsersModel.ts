import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import User from '../../user/userModel';
import Project from './projectModel';

@Table({
  tableName: 'userProjects',
  timestamps: true
})
class UserProjects extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  public id!: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public projectId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default UserProjects;
