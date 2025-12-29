import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from './projectModel';
import { Material } from '../../material/material.model';

@Table({
  tableName: 'project_materials',
  modelName: 'ProjectMaterial',
  timestamps: true
})
class ProjectMaterial extends Model {
  @Column({
    type: DataType.FLOAT
  })
  public marginCommission!: number;
  @Column({
    type: DataType.FLOAT
  })
  public materialCost!: number;

  @Column({
    type: DataType.FLOAT
  })
  public additionalMaterialPrice!: number;

  @Column({
    type: DataType.FLOAT
  })
  public totalMaterialCost!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public projectId!: string;

  @BelongsTo(() => Project, { as: 'project' })
  public project!: Project;

  @ForeignKey(() => Material)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public materialId!: string;

  @BelongsTo(() => Material, { as: 'material' })
  public Material!: Material;
}

export default ProjectMaterial;
