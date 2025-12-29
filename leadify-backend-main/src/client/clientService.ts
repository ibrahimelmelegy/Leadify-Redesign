import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { LeadStatusEnums } from '../lead/leadEnum';
import Lead from '../lead/leadModel';
import uploaderService from '../uploader/uploader.service';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { SortByEnum, SortEnum } from './clientEnum';
import Client from './clientModel';
import { CreateClientInput } from './inputs/createClientInput';
import { createActivityLog } from '../activity-logs/activityService';
import leadService from '../lead/leadService';
import { ClientPermissionsEnum } from '../role/roleEnum';
import ClientUsers from './client_UsersModel';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import notificationService from '../notification/notificationService';

class ClientService {
  async createClient(input: CreateClientInput, admin: User, t?: Transaction): Promise<Client> {
    if (input?.leadId) {
      await leadService.leadOrError({ id: input.leadId });
      Lead.update(
        {
          status: LeadStatusEnums.CONVERTED
        },
        {
          where: { id: input.leadId },
          ...(t && { transaction: t })
        }
      );
    }

    if (input?.fileUpload?.length) {
      await uploaderService.setFileReferences(input.fileUpload);
    }
    if (input.email) await this.errorIfClientWithExistEmail(input.email);
    if (input.phoneNumber) await this.errorIfClientWithExistPhone(input.phoneNumber);
    const client = await Client.create(
      { ...input },
      {
        ...(t && { transaction: t })
      }
    );
    // Associate users
    if (input.users && Array.isArray(input.users)) {
      await client.$set('users', input.users, { ...(t && { transaction: t }) });
    }

    if (input.users?.length) {
      input.users.forEach(async (item: number) => {
        await notificationService.sendAssignClientNotification({ userId: item, target: client.id }, client, admin);
      });
    }
    await createActivityLog('client', 'create', client.id, admin.id, null, 'Client created succesfully');

    return client;
  }

  async errorIfClientWithExistEmail(email: string, id?: string): Promise<void> {
    const clientWithEmail = await Client.findOne({ where: { email, ...(id && { id: { [Op.ne]: id } }) } });
    if (clientWithEmail) throw new BaseError(ERRORS.EMAIL_ALREADY_EXISTS);
  }

  async errorIfClientWithExistPhone(phone: string, id?: string): Promise<void> {
    const clientWithPhone = await Client.findOne({ where: { phoneNumber: phone, ...(id && { id: { [Op.ne]: id } }) } });
    if (clientWithPhone) throw new BaseError(ERRORS.PHONE_ALREADY_EXISTS);
  }

  async updateClient(id: string, input: any, user: User): Promise<any> {
    await this.validateClientAccess(id, user);
    const client = await this.clientOrError({ id });
    if (input.email) await this.errorIfClientWithExistEmail(input.email, id);
    if (input.phoneNumber) await this.errorIfClientWithExistPhone(input.phoneNumber, id);
    client.set(input);
    await createActivityLog('client', 'update', client.id, user.id, null, `New updates added suucesfully`);
    if (input.users && Array.isArray(input.users)) await client.$set('users', input.users);
    if (input.users?.length) {
      input.users.forEach(async (item: number) => {
        await notificationService.sendAssignClientNotification({ userId: item, target: client.id }, client, user);
      });
    }

    return await client.save();
  }

  async clientOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Client> {
    const client = await Client.findOne({ where: filter, include: joinedTables || [] });
    if (!client) throw new BaseError(ERRORS.CLIENT_NOT_FOUND);
    return client;
  }

  async getClients(query: any, user: User): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS)) query.userId = user.id;

    const { rows: clients, count: totalItems } = await Client.findAndCountAll({
      where: {
        ...(query.searchKey && {
          [Op.or]: [
            { clientName: { [Op.iLike]: `%${query.searchKey}%` } },
            { companyName: { [Op.iLike]: `%${query.searchKey}%` } },
            { email: { [Op.iLike]: `%${query.searchKey}%` } },
            { phoneNumber: { [Op.iLike]: `%${query.searchKey}%` } }
          ]
        }),
        ...(query?.status &&
          query?.status?.length > 0 && {
            clientStatus: {
              [Op.in]: query.status // Matches any value in the array
            }
          }),
        ...(query?.type &&
          query?.type?.length > 0 && {
            clientType: {
              [Op.in]: query.type // Matches any value in the array
            }
          })
      },
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] }, // Exclude join table attributes
          ...(query.userId && {
            required: true, // <-- THIS is crucial to apply WHERE in count query
            where: { id: query.userId }
          })
        }
      ],
      limit,
      offset,
      distinct: true, // <-- THIS is crucial so count is not duplicated due to joins
      order: [
        [
          query.sortBy && Object.keys(SortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: clients,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async clientById(id: string, user: User): Promise<any> {
    await this.validateClientAccess(id, user);
    const client = await this.clientOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] }
      }
    ]);
    return client;
  }

  async getClientsArray(): Promise<any> {
    const clients = await Client.findAll({
      attributes: ['id', 'clientName', 'companyName']
    });
    return clients;
  }

  public async validateClientAccess(leadId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS)) return;

    const isAssigned = await this.isUserAssignedToClient(leadId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToClient(leadId: string, userId: number): Promise<boolean> {
    const assignment = await ClientUsers.findOne({ where: { leadId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  public async sendClientsExcelByEmail(query: any, user: User, email: string): Promise<void> {
    const where: any = {
      ...(query.searchKey && {
        [Op.or]: [
          { clientName: { [Op.iLike]: `%${query.searchKey}%` } },
          { companyName: { [Op.iLike]: `%${query.searchKey}%` } },
          { email: { [Op.iLike]: `%${query.searchKey}%` } },
          { phoneNumber: { [Op.iLike]: `%${query.searchKey}%` } }
        ]
      }),
      ...(query.status?.length && {
        clientStatus: { [Op.in]: query.status }
      }),
      ...(query.type?.length && {
        clientType: { [Op.in]: query.type }
      })
    };

    if (!user.role.permissions.includes(ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS)) {
      where['$users.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clients');

    worksheet.columns = [
      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Status', key: 'clientStatus', width: 15 },
      { header: 'Type', key: 'clientType', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const clients = await Client.findAll({
        where,
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name'],
            through: { attributes: [] }, // Exclude join table attributes
            required: query.userId ? true : false, // Ensure filtering only when assignedUserId exists
            where: query.userId ? { id: query.userId } : undefined
          }
        ],
        limit: batchSize,
        offset
      });

      for (const client of clients) {
        worksheet.addRow({
          clientName: client.clientName,
          companyName: client.companyName,
          email: client.email,
          phoneNumber: client.phoneNumber,
          clientStatus: client.clientStatus,
          clientType: client.clientType,
          createdAt: client.createdAt
        });
      }

      hasMore = clients.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Clients Export',
      text: 'Please find attached the Excel file containing the filtered clients.',
      attachment: {
        name: 'clients.xlsx',
        content: attachment
      }
    });
  }
}

export default new ClientService();
