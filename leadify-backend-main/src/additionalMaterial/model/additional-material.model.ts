import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import Project from '../../project/models/projectModel';
import ProjectAdditionalMaterialItem from '../../project/models/projectAdditionalMaterialItem';
import { Material } from '../../material/material.model';

@Table({
  tableName: 'MaterialsAdditionalMaterialItems',
  timestamps: false
})
export class MaterialsAdditionalMaterialItem extends Model {
  @ForeignKey(() => Material)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  materialId!: number;

  @ForeignKey(() => AdditionalMaterialItem)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  additionalMaterialItemId!: number;
}

@Table({
  tableName: 'additional_materials',
  modelName: 'additionalMaterial',
  timestamps: true
})
export class AdditionalMaterial extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({})
  name!: string;

  @HasMany(() => AdditionalMaterialItem, { as: 'materialItem', onDelete: 'CASCADE' })
  public items!: AdditionalMaterialItem[];
}

@Table({
  tableName: 'additional_material_items',
  modelName: 'additionalMaterialItem',
  timestamps: true
})
export class AdditionalMaterialItem extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.DECIMAL })
  price!: number;

  @ForeignKey(() => AdditionalMaterial)
  @Column({ type: DataType.INTEGER })
  additionalMaterialId!: number;

  @BelongsTo(() => AdditionalMaterial)
  additionalMaterial!: AdditionalMaterial;

  @BelongsToMany(() => Material, () => MaterialsAdditionalMaterialItem)
  materials!: Material[];

  @BelongsToMany(() => Project, () => ProjectAdditionalMaterialItem)
  public projects!: Project[];
}
