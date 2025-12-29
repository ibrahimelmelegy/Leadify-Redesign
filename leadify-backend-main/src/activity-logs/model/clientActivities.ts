import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { ActivityModelClass } from './activities';
import Client from '../../client/clientModel';

@Table({
  tableName: 'clientActivities',
  modelName: 'ClientActivity',
  timestamps: true
})
export class ClientActivity extends ActivityModelClass {
  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public clientId!: string;

  @BelongsTo(() => Client, { as: 'client'})
  public client!: Client;
}
