import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

export type WebhookEvent = 
  | 'lead.created' | 'lead.updated' | 'lead.deleted'
  | 'opportunity.created' | 'opportunity.updated' | 'opportunity.deleted'
  | 'deal.created' | 'deal.updated' | 'deal.closed'
  | 'client.created' | 'client.updated'
  | 'project.created' | 'project.updated' | 'project.completed';

@Table({
  tableName: 'webhooks',
  modelName: 'Webhook',
  timestamps: true,
})
class Webhook extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  public url!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  public secret!: string;

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  public events!: WebhookEvent[];

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  public active!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;
}

export default Webhook;
