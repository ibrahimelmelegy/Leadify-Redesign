import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Asset from '../asset/assetModel';
import Project from '../project/models/projectModel';

@Table({
  tableName: 'project_assets',
  modelName: 'ProjectAsset',
  timestamps: true
})
class ProjectAsset extends Model {
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

  @ForeignKey(() => Asset)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public assetId!: string;

  @BelongsTo(() => Asset)
  public asset!: Asset;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  public rentPrice!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  public buyPrice!: number;
}

export default ProjectAsset;
