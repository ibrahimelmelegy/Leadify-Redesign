import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Manpower from '../manpower/manpowerModel';
import Project from '../project/models/projectModel';
import { MissionEnum } from './projectManpowerEnum';

@Table({
  tableName: 'project_manpower',
  modelName: 'ProjectManpower',
  timestamps: true
})
class ProjectManpower extends Model {
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

  @BelongsTo(() => Project)
  public project!: Project;

  @ForeignKey(() => Manpower)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public manpowerId!: string;

  @BelongsTo(() => Manpower)
  public manpower!: Manpower;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  public estimatedWorkDays!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  public actualWorkDays!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('mission');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value: string[]) {
      this.setDataValue('mission', value.join(','));
    }
  })
  public mission!: (keyof typeof MissionEnum)[];

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public durationCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public foodAllowanceCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public accommodationCostPerManpower!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public carRentPerManpower!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public otherCosts!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  public otherCostsReason?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  public totalCost!: number;
}

export default ProjectManpower;
