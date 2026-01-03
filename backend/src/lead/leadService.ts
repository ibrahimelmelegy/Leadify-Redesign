import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import notificationService from '../notification/notificationService';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { LeadStatusEnums, SortByEnum, SortEnum } from './leadEnum';
import Lead from './leadModel';
import { createActivityLog } from '../activity-logs/activityService';
import xlsx from 'xlsx';
import { LeadPermissionsEnum } from '../role/roleEnum';
import LeadUsers from './model/lead_UsersModel';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class LeadService {
  async createLead(input: any, adminId: number, t?: Transaction): Promise<Lead> {
    const { users: inputUsers, ...leadData } = input;

    if (input.email) await this.errorIfLeadWithExistEmail(input.email);
    if (input.phone) await this.errorIfLeadWithExistPhone(input.phone);

    let users = inputUsers;
    if (!users || !Array.isArray(users)) {
      users = [adminId];
    } else if (!users.includes(adminId)) {
      users.push(adminId);
    }

    const foundUsers = await User.findAll({
      where: { id: { [Op.in]: users } }
    });
    if (!foundUsers.length) throw new BaseError(ERRORS.USER_NOT_FOUND);

    const lead = await Lead.create(leadData, {
      ...(t && { transaction: t })
    });

    if (users && Array.isArray(users)) {
      await lead.$set('users', users, { transaction: t });
    }

    if (!t) {
      await createActivityLog('lead', 'create', lead.id, adminId, undefined, 'Lead created successfully');
    }

    if (foundUsers.length !== 1) {
      await notificationService.sendAssignLeadNotificatiom({
        userId: adminId,
        target: lead.id
      });
    }

    return lead;
  }

  async errorIfLeadWithExistEmail(email: string, id?: string): Promise<void> {
    const leadWithEmail = await Lead.findOne({ where: { email, ...(id && { id: { [Op.ne]: id } }) } });
    if (leadWithEmail) throw new BaseError(ERRORS.EMAIL_ALREADY_EXISTS);
  }

  async errorIfLeadWithExistPhone(phone: string, id?: string): Promise<void> {
    const leadWithPhone = await Lead.findOne({ where: { phone, ...(id && { id: { [Op.ne]: id } }) } });
    if (leadWithPhone) throw new BaseError(ERRORS.PHONE_ALREADY_EXISTS);
  }

  async updateLead(id: string, input: any, user: User): Promise<any> {
    await this.validateLeadAccess(id, user);
    const lead = await this.leadOrError({ id });

    if (input.email) await this.errorIfLeadWithExistEmail(input.email, lead.id);
    if (input.phone) await this.errorIfLeadWithExistPhone(input.phone, lead.id);
    const users = input.users?.filter((item: number) => !lead.users?.map(e => e.id).includes(item));

    if (users?.length) {
      users.forEach(async (item: number) => {
        await notificationService.sendAssignLeadNotificatiom({ userId: item, target: lead.id });
      });
    }
    if (input.users && Array.isArray(input.users)) await lead.$set('users', input.users);
    lead.set(input);
    await createActivityLog('lead', 'update', lead.id, user.id, null, `New updates added suucesfully`);
    users?.length && (await notificationService.sendAssignLeadNotificatiom({ userId: user.id, target: lead.id }));
    return await lead.save();
  }

  async leadOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Lead> {
    const lead = await Lead.findOne({ where: filter, include: joinedTables || [] });
    if (!lead) throw new BaseError(ERRORS.LEAD_NOT_FOUND);
    return lead;
  }

  async getLeads(query: any, user: User): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(LeadPermissionsEnum.VIEW_GLOBAL_LEADS)) query.userId = user.id;

    const { rows: leads, count: totalItems } = await Lead.findAndCountAll({
      where: {
        status: {
          [Op.ne]: LeadStatusEnums.CONVERTED
        },
        ...(query.searchKey && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query.searchKey}%` } },
            { companyName: { [Op.iLike]: `%${query.searchKey}%` } },
            { email: { [Op.iLike]: `%${query.searchKey}%` } },
            { phone: { [Op.iLike]: `%${query.searchKey}%` } },
            { otherSource: { [Op.iLike]: `%${query.searchKey}%` } }
          ]
        }),
        ...(query.status &&
          query.status.length > 0 && {
            status: {
              [Op.in]: query.status // Matches any value in the array
            }
          }),
        ...(query.leadSource &&
          query.leadSource.length > 0 && {
            leadSource: {
              [Op.in]: query.leadSource // Matches any value in the array
            }
          }),
        ...((query.fromDate || query.toDate) && {
          createdAt: {
            ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
            ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
          }
        }),
        ...((query.fromLastContactDate || query.toLastContactDate) && {
          lastContactDate: {
            ...(query.fromLastContactDate && { [Op.gte]: new Date(query.fromLastContactDate) }),
            ...(query.toLastContactDate && { [Op.lte]: new Date(query.toLastContactDate) })
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
      docs: leads,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async leadById(id: string, user: User): Promise<any> {
    await this.validateLeadAccess(id, user);

    const lead = await Lead.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] }
        }
      ]
    });
    if (!lead) throw new BaseError(ERRORS.LEAD_NOT_FOUND);
    return lead;
  }

  public async importFile(file: any): Promise<string> {
    const workbook = xlsx.read(file.data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const data: Omit<Lead, 'id'>[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const leadArray = [];

    for (let index = 1; index < data.length; index++) {
      const [name, companyName, email, phone, otherSource, leadSource, status, userId, notes, lastContactDate] = data[index] as any;
      if (!email && !phone) {
        throw new BaseError(ERRORS.LEAD_ALREADY_FOUND, `Lead must have at least Phone or email in row ${index}`);
      }
      const existingEmailPhone = await Lead.findOne({
        where: {
          [Op.or]: [{ phone: `+${phone}` }, { email: email }]
        }
      });
      if (existingEmailPhone)
        throw new BaseError(
          ERRORS.LEAD_ALREADY_FOUND,
          `Lead ${existingEmailPhone.phone === phone ? 'Phone' : 'email'} in row ${index} already exists in the system `
        );
      const existingUsers = await User.findAll({
        where: {
          email: {
            [Op.in]: userId.split(',')
          }
        },
        attributes: ['id', 'email']
      });
      console.log(existingUsers);

      leadArray.push({
        name: name,
        companyName: companyName,
        email: email,
        phone: phone,
        otherSource: otherSource,
        leadSource: leadSource,
        status: status || LeadStatusEnums.NEW,
        users: existingUsers?.length && existingUsers.map(user => user.id)[0],
        notes: notes,
        lastContactDate: lastContactDate,
        x: 'as'
      });
    }

    await Lead.bulkCreate(leadArray);

    return leadArray.length + ' leads created succesfully';
  }
  streamToBuffer(stream: any) {
    return new Promise((resolve, reject) => {
      const _buf = Array<any>();
      stream.on('data', (chunk: any) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err: any) => reject(err));
    });
  }

  public async validateLeadAccess(leadId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(LeadPermissionsEnum.VIEW_GLOBAL_LEADS)) return;

    const isAssigned = await this.isUserAssignedToLead(leadId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToLead(leadId: string, userId: number): Promise<boolean> {
    const assignment = await LeadUsers.findOne({ where: { leadId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  async sendLeadsExcelByEmail(query: any, user: User, email: string): Promise<void> {
    const where: any = {
      status: { [Op.ne]: LeadStatusEnums.CONVERTED },
      ...(query.searchKey && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query.searchKey}%` } },
          { companyName: { [Op.iLike]: `%${query.searchKey}%` } },
          { email: { [Op.iLike]: `%${query.searchKey}%` } },
          { phone: { [Op.iLike]: `%${query.searchKey}%` } },
          { otherSource: { [Op.iLike]: `%${query.searchKey}%` } }
        ]
      }),
      ...(query.status?.length && { status: { [Op.in]: query.status } }),
      ...(query.leadSource?.length && { leadSource: { [Op.in]: query.leadSource } }),
      ...((query.fromDate || query.toDate) && {
        createdAt: {
          ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
          ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
        }
      }),
      ...((query.fromLastContactDate || query.toLastContactDate) && {
        lastContactDate: {
          ...(query.fromLastContactDate && { [Op.gte]: new Date(query.fromLastContactDate) }),
          ...(query.toLastContactDate && { [Op.lte]: new Date(query.toLastContactDate) })
        }
      })
    };

    if (!user.role.permissions.includes(LeadPermissionsEnum.VIEW_GLOBAL_LEADS)) {
      where['$users.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Company', key: 'companyName', width: 30 },
      { header: 'Source', key: 'leadSource', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Users', key: 'users', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const leadsBatch = await Lead.findAll({
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

      for (const lead of leadsBatch) {
        const userNames = (lead.users || []).map(u => u.name).join(', ');
        worksheet.addRow({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          companyName: lead.companyName,
          leadSource: lead.leadSource,
          status: lead.status,
          users: userNames,
          createdAt: lead.createdAt
        });
      }

      hasMore = leadsBatch.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Leads Report',
      text: 'Attached is the Excel file with all leads.',
      attachment: {
        name: 'leads.xlsx',
        content: attachment
      }
    });
  }
}

export default new LeadService();
