import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { AdditionalMaterial } from '../additionalMaterial/model/additional-material.model';
import Service from '../service/serviceModel';
import Project from '../project/models/projectModel';
import ProjectMaterial from '../project/models/peojectMaterial';


@Table({
  tableName: 'materials',
  modelName: 'Material',
  timestamps: true
})
export class Material extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  public id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  public description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      isInt: true,
      min: 0 // Quantity must be zero or positive
    }
  })
  public quantity!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      isDecimal: true,
      min: 0 // Price must be zero or positive
    }
  })
  public unitPrice!: number;

  @ForeignKey(() => AdditionalMaterial)
  @Column({ type: DataType.INTEGER, allowNull: true })
  additionalMaterialId!: number;

  @BelongsTo(() => AdditionalMaterial)
  additionalMaterial!: AdditionalMaterial;

  @ForeignKey(() => Service)
  @Column({ type: DataType.UUID, allowNull: true })
  serviceId?: string;

  @BelongsTo(() => Service)
  service?: Service;

  @BelongsToMany(() => Project, () => ProjectMaterial)
  projects?: Project[];
}
