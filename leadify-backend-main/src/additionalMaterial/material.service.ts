import { Includeable, Op, WhereOptions } from 'sequelize';
import { SortEnum } from '../lead/leadEnum';
import { IPaginationRes } from '../types';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import {
  CreateAdditionalMaterialInput,
  createAdditionalMaterialItemsInput,
  UpdateAdditionalMaterialInput
} from './inputs/create-additional-material.input';
import { GetPaginatedAdditionalMaterialInput } from './inputs/paginated-material.input';
import { AdditionalMaterial, AdditionalMaterialItem } from './model/additional-material.model';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import { MaterialSortByEnum } from './material.enum';
import { Material } from '../material/material.model';

class MaterialService {
  public async createAdditionalMaterial(input: CreateAdditionalMaterialInput): Promise<AdditionalMaterial> {
    const existingMaterial = await AdditionalMaterial.findOne({
      where: {
        name: input.name
      }
    });
    if (existingMaterial) {
      throw new BaseError(ERRORS.MATERIAL_ALREADY_EXIST);
    }
    if (new Set(input.items.map(e => e.name)).size !== input.items.length) {
      throw new BaseError(ERRORS.MATERIAL_ITEM_NAME_EXIST);
    }

    const material = await AdditionalMaterial.create({ ...input });
    material.items = await AdditionalMaterialItem.bulkCreate(
      input.items.map(e => ({ name: e.name, price: e.price, additionalMaterialId: material.id }))
    );

    return await this.getMaterial(material.id);
  }
  
  public async getMaterials(input: GetPaginatedAdditionalMaterialInput): Promise<IPaginationRes<AdditionalMaterial>> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    const { rows: materials, count: totalItems } = await AdditionalMaterial.findAndCountAll({
      where: {},
      include: [AdditionalMaterialItem],
      limit,
      offset,
      order: [
        [
          input.sortBy && Object.keys(MaterialSortByEnum).includes(input.sortBy) ? input.sortBy : 'createdAt',
          input.sort && Object.values(SortEnum).includes(input.sort) ? input.sort : SortEnum.DESC
        ]
      ]
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

  public async getMaterial(id: number): Promise<AdditionalMaterial> {
    const material = await AdditionalMaterial.findByPk(id, { include: [AdditionalMaterialItem] });
    if (!material) throw new BaseError(ERRORS.ADDITIONAL_MATERIAL_NOT_FOUND);

    return material;
  }

  public async updateMaterial(input: UpdateAdditionalMaterialInput): Promise<AdditionalMaterial> {
    const { materialId, ...payload } = input;
    const material = await AdditionalMaterial.findByPk(materialId, { include: [AdditionalMaterialItem] });
    if (!material) throw new BaseError(ERRORS.ADDITIONAL_MATERIAL_NOT_FOUND);
    const existingMaterial = await AdditionalMaterial.findOne({
      where: {
        id: {
          [Op.ne]: materialId
        },
        name: payload.name
      }
    });
    if (existingMaterial) throw new BaseError(ERRORS.MATERIAL_ALREADY_EXIST);

    await this.updateMaterialItems(material, input.items);
    material.set({ ...payload });

    await material.save();
    return await this.getMaterial(material.id);
  }

  private async updateMaterialItems(material: any, items: createAdditionalMaterialItemsInput[]) {
    const deletedIds = material.materialItem.filter((e: any) => !items.find(f => f.id === e.id)).map((e: any) => e.id);
    const newMaterialItem: Partial<AdditionalMaterialItem>[] = [];
    const updateMaterialItem: Partial<AdditionalMaterialItem>[] = [];

    items!.forEach(e => (e.id ? updateMaterialItem.push(e) : newMaterialItem.push({ ...e, additionalMaterialId: material.id })));
    await AdditionalMaterialItem.bulkCreate(newMaterialItem as []);

    await Promise.all(updateMaterialItem.map(async e => await AdditionalMaterialItem.update(e, { where: { id: e.id } })));
    deletedIds?.length && (await AdditionalMaterialItem.destroy({ where: { id: { [Op.in]: deletedIds } } }));
  }

  async materialOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Material> {
    const material = await Material.findOne({ where: filter, include: joinedTables || [] });
    if (!material) throw new BaseError(ERRORS.MATERIAL_NOT_FOUND);
    return material;
  }

  public async sendMaterialsExcelByEmail(input: GetPaginatedAdditionalMaterialInput, email: string): Promise<void> {
    const where: any = {}; // You can add filters here if needed

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Materials');

    worksheet.columns = [
      { header: 'Material ID', key: 'id', width: 15 },
      { header: 'Reference', key: 'reference', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 },
      { header: 'Item Name', key: 'itemName', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Unit', key: 'unit', width: 15 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const materials = await AdditionalMaterial.findAll({
        where,
        include: [
          {
            model: AdditionalMaterialItem,
            as: 'additionalMaterialItems' // make sure this alias matches your association
          }
        ],
        limit: batchSize,
        offset,
        order: [
          [
            input.sortBy && Object.keys(MaterialSortByEnum).includes(input.sortBy) ? input.sortBy : 'createdAt',
            input.sort && Object.values(SortEnum).includes(input.sort) ? input.sort : SortEnum.DESC
          ]
        ],
        raw: false,
        nest: true
      });

      for (const material of materials) {
        // if (Array.isArray(material.additionalMaterialItems)) {
        //   for (const item of material.additionalMaterialItems) {
        //     worksheet.addRow({
        //       id: material.id,
        //       reference: material.reference || '',
        //       createdAt: material.createdAt,
        //       itemName: item.name || '',
        //       quantity: item.quantity || 0,
        //       unit: item.unit || ''
        //     });
        //   }
        // } else {
        worksheet.addRow({
          id: material.id,
          // reference: material. || '',
          createdAt: material.createdAt,
          itemName: '',
          quantity: '',
          unit: ''
        });
        // }
      }

      hasMore = materials.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Additional Materials Export',
      text: 'Please find attached the Excel file containing the additional materials.',
      attachment: {
        name: 'additional-materials.xlsx',
        content: attachment
      }
    });
  }
}

export default new MaterialService();
