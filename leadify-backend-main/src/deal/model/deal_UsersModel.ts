import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Deal from './dealModel';
import User from '../../user/userModel';

@Table({
  tableName: 'dealUsers',
  timestamps: true
})
class DealUsers extends Model {
  @ForeignKey(() => Deal)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public dealId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId!: string;
}

export default DealUsers;
