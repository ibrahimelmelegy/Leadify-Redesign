import { Includeable, Op, WhereOptions } from 'sequelize';
import Manpower from './manpowerModel';
import { UpdateManpowerInput } from './inputs/updateManpowerInput';
import { CreateManpowerInput } from './inputs/createManpowerInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { ManpowerSortByEnum } from './manpowerEnum';
import { SortEnum } from '../lead/leadEnum';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class ManpowerService {
  private calculateCosts(data: {
    salary: number;
    variableAllowance?: number;
    transportationAllowance: number;
    iqamaCost: number;
    endOfServiceBenefit: number;
    saudization?: number;
    visaFees?: number;
    incomingFlightTicket?: number;
    healthInsurance?: number;
    generalOrganizationForSocialInsurance?: number;
  }): { totalCost: number; dailyCost: number } {
    const {
      salary,
      variableAllowance = 0,
      transportationAllowance,
      iqamaCost,
      endOfServiceBenefit,
      saudization = 0,
      visaFees = 0,
      incomingFlightTicket = 0,
      healthInsurance = 0,
      generalOrganizationForSocialInsurance = 0
    } = data;

    const totalCost =
      ((salary * 12 +
        variableAllowance +
        transportationAllowance +
        iqamaCost +
        endOfServiceBenefit +
        saudization +
        visaFees +
        incomingFlightTicket +
        healthInsurance +
        generalOrganizationForSocialInsurance) *
        1.12) /
      12;

    const dailyCost = totalCost / 30;

    return { totalCost: parseFloat(totalCost.toFixed(2)), dailyCost: parseFloat(dailyCost.toFixed(2)) };
  }

  public async createManpower(data: CreateManpowerInput): Promise<Manpower> {
    const costs = this.calculateCosts(data);
    const manpowerData = {
      ...data,
      totalCost: costs.totalCost,
      dailyCost: costs.dailyCost
    };
    if (data.email) await this.errorIfManpowerWithExistEmail(data.email);
    if (data.phone) await this.errorIfManpowerWithExistPhone(data.phone);
    await this.errorIfManpowerWithExistName(data.name);
    return Manpower.create(manpowerData);
  }

  public async updateManpower(id: string, data: UpdateManpowerInput): Promise<Manpower> {
    const manpower = await this.manpowerOrError({ id });

    const updatedData = {
      ...manpower.get(),
      ...data
    };

    const costs = this.calculateCosts(updatedData);
    updatedData.totalCost = costs.totalCost;
    updatedData.dailyCost = costs.dailyCost;
    if (data.email) await this.errorIfManpowerWithExistEmail(data.email, manpower.id);
    if (data.phone) await this.errorIfManpowerWithExistPhone(data.phone, manpower.id);
    if (data.name) await this.errorIfManpowerWithExistName(data.name);

    await manpower.update(updatedData);
    return manpower;
  }

  public async getManpowers(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const { rows: manpowers, count: totalItems } = await Manpower.findAndCountAll({
      where: {
        ...(query.searchKey && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query.searchKey}%` } },
            { email: { [Op.iLike]: `%${query.searchKey}%` } },
            { phone: { [Op.iLike]: `%${query.searchKey}%` } }
          ]
        }),
        ...(query.availabilityStatus && {
          availabilityStatus: query.availabilityStatus
        }),
        ...(query.role?.length && {
          role: {
            [Op.overlap]: query.role
          }
        }),
        ...((query.fromDate || query.toDate) && {
          createdAt: {
            ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
            ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
          }
        }),
        ...((query.fromSalary || query.toSalary) && {
          salary: {
            ...(query.fromSalary && { [Op.gte]: query.fromSalary }),
            ...(query.toSalary && { [Op.lte]: query.toSalary })
          }
        }),
        ...((query.fromVariableAllowance || query.toVariableAllowance) && {
          variableAllowance: {
            ...(query.fromVariableAllowance && { [Op.gte]: query.fromVariableAllowance }),
            ...(query.toVariableAllowance && { [Op.lte]: query.toVariableAllowance })
          }
        }),
        ...((query.fromTransportationAllowance || query.toTransportationAllowance) && {
          transportationAllowance: {
            ...(query.fromTransportationAllowance && { [Op.gte]: query.fromTransportationAllowance }),
            ...(query.toTransportationAllowance && { [Op.lte]: query.toTransportationAllowance })
          }
        }),
        ...((query.fromIqamaCost || query.toIqamaCost) && {
          iqamaCost: {
            ...(query.fromIqamaCost && { [Op.gte]: query.fromIqamaCost }),
            ...(query.toIqamaCost && { [Op.lte]: query.toIqamaCost })
          }
        }),
        ...((query.fromTotalCost || query.toTotalCost) && {
          totalCost: {
            ...(query.fromTotalCost && { [Op.gte]: query.fromTotalCost }),
            ...(query.toTotalCost && { [Op.lte]: query.toTotalCost })
          }
        }),
        ...((query.fromDailyCost || query.toDailyCost) && {
          dailyCost: {
            ...(query.fromDailyCost && { [Op.gte]: query.fromDailyCost }),
            ...(query.toDailyCost && { [Op.lte]: query.toDailyCost })
          }
        })
      },
      limit: Number(limit),
      offset,
      order: [
        [
          query.sortBy && Object.keys(ManpowerSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: manpowers,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async manpowerById(id: string): Promise<Manpower> {
    const manpower = await this.manpowerOrError({ id });
    return manpower;
  }

  async errorIfManpowerWithExistEmail(email: string, id?: string): Promise<void> {
    const leadWithEmail = await Manpower.findOne({ where: { email, ...(id && { id: { [Op.ne]: id } }) } });
    if (leadWithEmail) throw new BaseError(ERRORS.EMAIL_ALREADY_EXISTS);
  }

  async errorIfManpowerWithExistPhone(phone: string, id?: string): Promise<void> {
    const leadWithPhone = await Manpower.findOne({ where: { phone, ...(id && { id: { [Op.ne]: id } }) } });
    if (leadWithPhone) throw new BaseError(ERRORS.PHONE_ALREADY_EXISTS);
  }

  async errorIfManpowerWithExistName(name: string, id?: string): Promise<void> {
    const leadWithName = await Manpower.findOne({ where: { name, ...(id && { id: { [Op.ne]: id } }) } });
    if (leadWithName) throw new BaseError(ERRORS.NAME_ALREADY_EXISTS);
  }

  async manpowerOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Manpower> {
    const manpower = await Manpower.findOne({ where: filter, include: joinedTables || [] });
    if (!manpower) throw new BaseError(ERRORS.MANPOWER_NOT_FOUND);
    return manpower;
  }

  public async sendManpowerExcelByEmail(query: any, email: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Manpower');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Nationality', key: 'nationality', width: 20 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Salary', key: 'salary', width: 15 },
      { header: 'Daily Cost', key: 'dailyCost', width: 15 },
      { header: 'Total Cost', key: 'totalCost', width: 15 },
      { header: 'Availability', key: 'availabilityStatus', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const manpowers = await Manpower.findAll({
        where: {
          ...(query.searchKey && {
            [Op.or]: [
              { name: { [Op.iLike]: `%${query.searchKey}%` } },
              { email: { [Op.iLike]: `%${query.searchKey}%` } },
              { phone: { [Op.iLike]: `%${query.searchKey}%` } }
            ]
          }),
          ...(query.availabilityStatus && {
            availabilityStatus: query.availabilityStatus
          }),
          ...(query.role?.length && {
            role: {
              [Op.overlap]: query.role
            }
          }),
          ...((query.fromDate || query.toDate) && {
            createdAt: {
              ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
              ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
            }
          }),
          ...((query.fromSalary || query.toSalary) && {
            salary: {
              ...(query.fromSalary && { [Op.gte]: query.fromSalary }),
              ...(query.toSalary && { [Op.lte]: query.toSalary })
            }
          }),
          ...((query.fromVariableAllowance || query.toVariableAllowance) && {
            variableAllowance: {
              ...(query.fromVariableAllowance && { [Op.gte]: query.fromVariableAllowance }),
              ...(query.toVariableAllowance && { [Op.lte]: query.toVariableAllowance })
            }
          }),
          ...((query.fromTransportationAllowance || query.toTransportationAllowance) && {
            transportationAllowance: {
              ...(query.fromTransportationAllowance && { [Op.gte]: query.fromTransportationAllowance }),
              ...(query.toTransportationAllowance && { [Op.lte]: query.toTransportationAllowance })
            }
          }),
          ...((query.fromIqamaCost || query.toIqamaCost) && {
            iqamaCost: {
              ...(query.fromIqamaCost && { [Op.gte]: query.fromIqamaCost }),
              ...(query.toIqamaCost && { [Op.lte]: query.toIqamaCost })
            }
          }),
          ...((query.fromTotalCost || query.toTotalCost) && {
            totalCost: {
              ...(query.fromTotalCost && { [Op.gte]: query.fromTotalCost }),
              ...(query.toTotalCost && { [Op.lte]: query.toTotalCost })
            }
          }),
          ...((query.fromDailyCost || query.toDailyCost) && {
            dailyCost: {
              ...(query.fromDailyCost && { [Op.gte]: query.fromDailyCost }),
              ...(query.toDailyCost && { [Op.lte]: query.toDailyCost })
            }
          })
        },
        raw: true,
        limit: batchSize,
        offset,
        order: [
          [
            query.sortBy && Object.keys(ManpowerSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
            query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
          ]
        ]
      });

      for (const manpower of manpowers) {
        worksheet.addRow({
          name: manpower.name,
          email: manpower.email,
          phone: manpower.phone,
          nationality: manpower.nationality,
          role: manpower.role,
          salary: manpower.salary,
          dailyCost: manpower.dailyCost,
          availabilityStatus: manpower.availabilityStatus,
          totalCost: manpower.totalCost,
          createdAt: manpower.createdAt
        });
      }

      hasMore = manpowers.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Manpowers Report',
      text: 'Please find attached the Excel file containing the manpower data.',
      attachment: {
        name: 'manpowers.xlsx',
        content: attachment
      }
    });
  }
}

export default new ManpowerService();
