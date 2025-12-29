import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import User from '../user/userModel';
import Client from './clientModel';

@Table({
  tableName: 'clientUsers',
  timestamps: true
})
class ClientUsers extends Model {
  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public clientId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default ClientUsers;
