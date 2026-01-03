import { Op } from 'sequelize';
import { AdditionalMaterial } from '../additionalMaterial/model/additional-material.model';
import { SortEnum } from '../lead/leadEnum';
import Service from '../service/serviceModel';
import { IPaginationRes } from '../types';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { CreateMaterialInput } from './input/create-material.input';
import { GetMaterialsInput } from './input/getMaterialsInput';
import { Material } from './material.model';

class MaterialService {
  public async createMaterial(input: CreateMaterialInput): Promise<Material> {
    if (input.materialCategoryId) {
      const additionalMaterial = await AdditionalMaterial.findOne({
        where: {
          id: input.materialCategoryId
        }
      });
      if (!additionalMaterial) {
        throw new BaseError(ERRORS.ADDITIONAL_MATERIAL_NOT_FOUND);
      }
    }
    if (input.serviceId) {
      const services = await Service.findOne({
        where: {
          id: input.serviceId
        }
      });
      if (!services) {
        throw new BaseError(ERRORS.SERVICE_NOT_FOUND);
      }
    }

    let material = null;
    if (input.materialId) {
      const existingMaterial = await Material.findByPk(input.materialId);
      if (!existingMaterial) throw new BaseError(ERRORS.MATERIAL_NOT_FOUND);

      existingMaterial?.set({
        ...input,
        additionalMaterialId: input.materialCategoryId
      });
      existingMaterial?.save();
      material = existingMaterial;
    } else {
      material = await Material.create({
        ...input,
        additionalMaterialId: input.materialCategoryId
      });
    }

    return material;
  }

  public async getMaterials(input: any): Promise<IPaginationRes<Material>> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    const { rows: materials, count: totalItems } = await Material.findAndCountAll({
      where: {
        ...(input.searchKey && { [Op.or]: [{ description: { [Op.iLike]: `%${input.searchKey}%` } }] })
      },
      limit,
      offset,
      order: [['createdAt', SortEnum.DESC]]
    });

    return {
      docs: materials,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async getMaterial(id: number): Promise<Material> {
    const material = await Material.findByPk(id);
    if (!material) throw new BaseError(ERRORS.MATERIAL_NOT_FOUND);

    return material;
  }
}

export default new MaterialService();
