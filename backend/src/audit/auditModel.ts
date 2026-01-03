import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'auditLogs',
  modelName: 'AuditLog',
  timestamps: true,
  updatedAt: false,
})
class AuditLog extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  public action!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  public entityType!: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public entityId?: number;

  @Column({ type: DataType.JSON, allowNull: true })
  public oldValues?: object;

  @Column({ type: DataType.JSON, allowNull: true })
  public newValues?: object;

  @Column({ type: DataType.STRING(45), allowNull: true })
  public ipAddress?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public userAgent?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  public metadata?: object;
}

export default AuditLog;
