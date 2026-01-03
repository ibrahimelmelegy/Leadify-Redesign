import { BelongsToMany, Column, DataType, Default, Model, Table } from 'sequelize-typescript';
import Project from '../project/models/projectModel';
import { manufacturerVehicle } from './vehivle.enum';

@Table({
  tableName: 'vehicles',
  modelName: 'vehicle',
  timestamps: true
})
export class Vehicle extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.DECIMAL })
  rentCost!: number;

  @Column({ type: DataType.DECIMAL })
  gasCost!: number;

  @Column({ type: DataType.DECIMAL })
  oilCost!: number;

  @Column({
    type: DataType.ENUM(...Object.values(manufacturerVehicle))
  })
  manufacturer!: manufacturerVehicle;

  @Column({ unique: true })
  plate!: string;

  @Default(0)
  @Column({ type: DataType.DECIMAL })
  regularMaintenanceCost!: number;

  @BelongsToMany(() => Project, 'ProjectVehicles', 'vehicleId', 'projectId')
  public projects!: Project[];
}
