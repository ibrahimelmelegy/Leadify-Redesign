import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from './projectModel';
import { AdditionalMaterialItem } from '../../additionalMaterial/model/additional-material.model';

@Table({
  tableName: 'project_additional_material_items',
  modelName: 'ProjectAdditionalMaterialItem',
  timestamps: true
})
class ProjectAdditionalMaterialItem extends Model {
  @Column({
    type: DataType.INTEGER
  })
  public quantity!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public projectId!: string;

  @BelongsTo(() => Project, { as: 'project' })
  public project!: Project;

  @ForeignKey(() => AdditionalMaterialItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public additionalMaterialItemId!: number;

  @BelongsTo(() => AdditionalMaterialItem)
  public AdditionalMaterialItem!: AdditionalMaterialItem;
}

export default ProjectAdditionalMaterialItem;
