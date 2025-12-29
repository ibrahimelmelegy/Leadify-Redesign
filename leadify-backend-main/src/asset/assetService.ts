import { Op } from 'sequelize';
import Asset from './assetModel';
import { UpdateAssetInput } from './inputs/updateAssetInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { AssetSortByEnum } from './assets,enum';
import { SortEnum } from '../lead/leadEnum';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class AssetService {
  public async createAsset(data: any): Promise<Asset> {
    if (data.name) await this.errorIfAssetWithExistName(data.name);
    return Asset.create(data);
  }

  public async updateAsset(id: string, data: UpdateAssetInput): Promise<Asset> {
    const asset = await Asset.findByPk(id);
    if (!asset) throw new BaseError(ERRORS.ASSET_NOT_FOUND);

    if (data.name) await this.errorIfAssetWithExistName(data.name, asset.id);
    await asset.update(data);
    return asset;
  }

  public async getAssets(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: assets, count: totalItems } = await Asset.findAndCountAll({
      where: {
        ...(query.searchKey && {
          [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }]
        }),
        ...((query.fromRentPrice || query.toRentPrice) && {
          rentPrice: {
            ...(query.fromRentPrice && { [Op.gte]: query.fromRentPrice }),
            ...(query.toRentPrice && { [Op.lte]: query.toRentPrice })
          }
        }),
        ...((query.fromBuyPrice || query.toBuyPrice) && {
          buyPrice: {
            ...(query.fromBuyPrice && { [Op.gte]: query.fromBuyPrice }),
            ...(query.toBuyPrice && { [Op.lte]: query.toBuyPrice })
          }
        })
      },
      limit: Number(limit),
      offset,
      order: [
        [
          query.sortBy && Object.keys(AssetSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: assets,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async assetById(id: string): Promise<Asset> {
    const asset = await Asset.findByPk(id);
    if (!asset) throw new BaseError(ERRORS.ASSET_NOT_FOUND);

    return asset;
  }

  private async errorIfAssetWithExistName(name: string, id?: string): Promise<void> {
    const assetWithName = await Asset.findOne({ where: { name, ...(id && { id: { [Op.ne]: id } }) } });
    if (assetWithName) throw new BaseError(ERRORS.NAME_ALREADY_EXISTS);
  }

  public async sendAssetsExcelByEmail(query: any, email: string): Promise<void> {
    const where: any = {
      ...(query.searchKey && {
        [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }]
      }),
      ...((query.fromRentPrice || query.toRentPrice) && {
        rentPrice: {
          ...(query.fromRentPrice && { [Op.gte]: query.fromRentPrice }),
          ...(query.toRentPrice && { [Op.lte]: query.toRentPrice })
        }
      }),
      ...((query.fromBuyPrice || query.toBuyPrice) && {
        buyPrice: {
          ...(query.fromBuyPrice && { [Op.gte]: query.fromBuyPrice }),
          ...(query.toBuyPrice && { [Op.lte]: query.toBuyPrice })
        }
      })
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assets');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Rent Price', key: 'rentPrice', width: 15 },
      { header: 'Buy Price', key: 'buyPrice', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await Asset.findAll({
        where,
        raw: true,
        limit: batchSize,
        offset,
        order: [
          [
            query.sortBy && Object.keys(AssetSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
            query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
          ]
        ]
      });

      for (const asset of batch) {
        worksheet.addRow({
          name: asset.name,
          rentPrice: asset.rentPrice,
          buyPrice: asset.buyPrice,
          createdAt: asset.createdAt
        });
      }

      hasMore = batch.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Assets Export',
      text: 'Attached is the Excel file with all filtered assets.',
      attachment: {
        name: 'assets.xlsx',
        content: attachment
      }
    });
  }
}

export default new AssetService();
