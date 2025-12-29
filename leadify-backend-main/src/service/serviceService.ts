import { Op } from 'sequelize';
import Service from './serviceModel';
import { UpdateServiceInput } from './inputs/updateServiceInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class ServiceService {
  public async createService(data: any): Promise<Service> {
    if (data.type) await this.errorIfServiceWithExistType(data.type);
    return await Service.create(data);
  }

  public async updateService(id: string, data: UpdateServiceInput): Promise<Service> {
    const service = await Service.findByPk(id);
    if (!service) throw new BaseError(ERRORS.SERVICE_NOT_FOUND);

    if (data.type) await this.errorIfServiceWithExistType(data.type, service.id);
    await service.update(data);
    return service;
  }

  public async getServices(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: services, count: totalItems } = await Service.findAndCountAll({
      where: {
        ...(query.searchKey && {
          [Op.or]: [{ type: { [Op.iLike]: `%${query.searchKey}%` } }]
        }),
        ...((query.fromPrice || query.toPrice) && {
          price: {
            ...(query.fromPrice && { [Op.gte]: query.fromPrice }),
            ...(query.toPrice && { [Op.lte]: query.toPrice })
          }
        })
      },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      docs: services,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async serviceById(id: string): Promise<Service> {
    const service = await Service.findByPk(id);
    if (!service) throw new BaseError(ERRORS.SERVICE_NOT_FOUND);

    return service;
  }

  async errorIfServiceWithExistType(type: string, id?: string): Promise<void> {
    const serviceWithType = await Service.findOne({ where: { type, ...(id && { id: { [Op.ne]: id } }) } });
    if (serviceWithType) throw new BaseError(ERRORS.TYPE_ALREADY_EXISTS);
  }

  public async sendServicesExcelByEmail(query: any, email: string): Promise<void> {
    const where: any = {
      ...(query.searchKey && {
        [Op.or]: [{ type: { [Op.iLike]: `%${query.searchKey}%` } }]
      }),
      ...((query.fromPrice || query.toPrice) && {
        price: {
          ...(query.fromPrice && { [Op.gte]: query.fromPrice }),
          ...(query.toPrice && { [Op.lte]: query.toPrice })
        }
      })
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Services');

    worksheet.columns = [
      { header: 'Service ID', key: 'id', width: 15 },
      { header: 'Type', key: 'type', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const services = await Service.findAll({
        where,
        raw: true,
        limit: batchSize,
        offset,
        order: [['createdAt', 'DESC']]
      });

      for (const service of services) {
        worksheet.addRow({
          id: service.id,
          type: service.type,
          createdAt: service.createdAt
        });
      }

      hasMore = services.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Services Export',
      text: 'Attached is the Excel file containing the filtered services.',
      attachment: {
        name: 'services.xlsx',
        content: attachment
      }
    });
  }
}

export default new ServiceService();
