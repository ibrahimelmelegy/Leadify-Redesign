import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { ActivityModelClass } from './activities';
import Project from '../../project/models/projectModel';

@Table({
  tableName: 'projectActivities',
  modelName: 'ProjectActivity',
  timestamps: true
})
export class ProjectActivity extends ActivityModelClass {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public projectId!: string;

  @BelongsTo(() => Project, {
    as: 'project',
    onDelete: 'CASCADE'
  })
  public project!: Project;
}
