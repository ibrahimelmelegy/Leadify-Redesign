import bcrypt from 'bcryptjs';
import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from '../project/models/projectModel';
import Role from '../role/roleModel';
import { UserStatusEnum } from './userEnum';

@Table({
  tableName: 'Users',
  modelName: 'User',
  timestamps: true
})
class User extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public password!: string;

  @Default(UserStatusEnum.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(UserStatusEnum)),
    allowNull: true
  })
  public status!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  profilePicture?: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  public roleId!: string;

  @BelongsTo(() => Role)
  public role!: Role;

  // @BelongsToMany(() => Project, 'userProjects', 'projectId', 'userId')
  // public projects!: Project[];

  // Method to compare password for authentication
  public async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Override toJSON to exclude the password field
  public toJSON(): Record<string, unknown> {
    const userInstance = { ...this.get() };
    delete userInstance.password; // Remove password before returning JSON
    return userInstance;
  }
}

export default User;
