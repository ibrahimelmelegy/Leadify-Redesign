import { isArray } from 'class-validator';
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import Client from '../client/clientModel';
import { sequelize } from '../config/db';
import { LeadStatusEnums, SortEnum } from '../lead/leadEnum';
import Lead from '../lead/leadModel';
import leadService from '../lead/leadService';
import { OpportunityStageEnums } from '../opportunity/opportunityEnum';
import Opportunity from '../opportunity/opportunityModel';
import { IPaginationRes } from '../types';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { DealSortByEnum, DealStageEnums } from './dealEnum';
import { AssignUserToDealInput } from './inputs/assign-user-to-deal.input';
import { ConvertLeadToDealInput, CreateLeadAndDealInput } from './inputs/convert-lead-to-deal.input';
import { CreateDealInvoiceInput, CreateDeliveryDetailsInput } from './inputs/creteDealInput';
import { GetPaginatedDealsInput } from './inputs/paginated-deals.input';
import { UpdateDealInput } from './inputs/update-deal.input';
import DealDelivery from './model/dealDeliveryMode copy';
import Deal from './model/dealModel';
import Invoice from './model/invoiceMode';
import { createActivityLog } from '../activity-logs/activityService';
import notificationService from '../notification/notificationService';
import { DealPermissionsEnum } from '../role/roleEnum';
import DealUsers from './model/deal_UsersModel';
import userService from '../user/userService';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import clientService from '../client/clientService';

class DealService {
  public async convertLeadTODeal(input: ConvertLeadToDealInput & { userId: string }, admin: User): Promise<Deal> {
    let lead: any,
      client: any = null;
    const transaction = await sequelize.transaction();
    try {
      lead = await leadService.leadOrError({ id: input.leadId });
      lead.set({ status: LeadStatusEnums.CONVERTED });
      await lead.save({ transaction });

      client = await Client.findOne({ where: { email: lead.email } });
      if (client) throw new BaseError(ERRORS.CLIENT_ALREADY_FOUND);

      client = await Client.create(
        {
          clientName: lead.name,
          email: lead.email,
          phoneNumber: lead.phone,
          companyName: lead.companyName
        },
        { transaction }
      );

      let opportunity = null;
      if (input.opportunityId) {
        opportunity = await Opportunity.findByPk(input.opportunityId);
        if (!opportunity) throw new BaseError(ERRORS.OPPORTUNITY_NOT_FOUND);
      }
      const exitingDeal = await Deal.findOne({
        where: {
          name: input.name,
          companyName: input.companyName
        },
        attributes: ['name', 'companyName']
      });
      if (exitingDeal) throw new BaseError(ERRORS.DEAL_ALREADY_EXIST);
      if (input.stage !== DealStageEnums.CANCELLED) {
        delete input.cancelledReason;
      }

      if (!input.users || !Array.isArray(input.users)) {
        input.users = [admin.id];
      } else if (!input.users.includes(admin.id)) {
        input.users.push(admin.id);
      }

      const deal = await Deal.create(
        {
          ...input,
          leadId: lead?.id,
          clientId: client?.id
        },
        { transaction }
      );

      if (input.deliveryDetails?.length) {
        await this.createDealDeliveryDetails(deal.id, input.deliveryDetails);
      }
      if (input.invoiceDetails?.length) {
        await this.createDealInvoice(deal.id, input.invoiceDetails);
      }

      if (opportunity) {
        opportunity.set({
          stage: OpportunityStageEnums.CONVERTED
        });
        await opportunity.save({ transaction });
      }
      if (input.users && Array.isArray(input.users))
        await deal.$set('users', input.users, {
          transaction
        });
      if (input.users) {
        input.users.forEach(async (item: number) => {
          await notificationService.sendAssignDealNotification({ userId: item, target: deal.id }, deal, admin);
        });
      }
      transaction.commit();
      await createActivityLog('deal', 'create', deal.id, admin.id, transaction, 'Deal created succesfully from lead conversion');

      return deal;
    } catch (error) {
      console.log(error);
      transaction.rollback();
      throw new BaseError(ERRORS[(error as any)?.message as keyof typeof ERRORS] || ERRORS.SOMETHING_WENT_WRONG);
    }
  }

  public async createDeal(input: CreateLeadAndDealInput, admin: User): Promise<Deal> {
    const users = await User.findAll({
      where: { id: { [Op.in]: input.deal.users } }
    });
    if (!users.length) throw new BaseError(ERRORS.USER_NOT_FOUND);

    const exitingDeal = await Deal.findOne({
      where: {
        name: input.deal.name,
        companyName: input.deal.companyName
      },
      attributes: ['name', 'companyName']
    });
    if (exitingDeal) throw new BaseError(ERRORS.DEAL_ALREADY_EXIST);
    if (input.deal.stage !== DealStageEnums.CANCELLED) delete input.deal.cancelledReason;

    const t = await sequelize.transaction();
    try {
      let lead,
        client = null;

      if (!input.clientId) {
        const existingLead = await Lead.findOne({
          where: {
            email: input.lead?.email
          }
        });

        if (existingLead) throw new BaseError(ERRORS.LEAD_ALREADY_FOUND);
        lead = await leadService.createLead({ ...input.lead, status: LeadStatusEnums.CONVERTED }, admin.id, t);

        const existingClient = await Client.findOne({
          where: {
            email: input.lead?.email
          }
        });
        if (existingClient) throw new BaseError(ERRORS.CLIENT_ALREADY_FOUND);
        client = await Client.create(
          {
            clientName: lead.name,
            email: lead.email,
            phoneNumber: lead.phone,
            companyName: lead.companyName
          },
          { transaction: t }
        );
      } else {
        client = await clientService.clientOrError({ id: input.clientId });
      }

      if (!input.deal.users || !Array.isArray(input.deal.users)) {
        input.deal.users = [admin.id];
      } else if (!input.deal.users.includes(admin.id)) {
        input.deal.users.push(admin.id);
      }

      const deal = await Deal.create(
        {
          ...input.deal,
          leadId: (lead as any)?.id,
          clientId: (client as any)?.id
        },
        {
          transaction: t
        }
      );
      if (input.deal.users && Array.isArray(input.deal.users))
        await deal.$set('users', input.deal.users, {
          transaction: t
        });
      if (input.deal.users) {
        input.deal.users.forEach(async (item: number) => {
          await notificationService.sendAssignDealNotification({ userId: item, target: deal.id }, deal, admin);
        });
      }
      if (input.deliveryDetails?.length) {
        await this.createDealDeliveryDetails(deal.id, input.deliveryDetails, t);
      }
      if (input.invoiceDetails?.length) {
        await this.createDealInvoice(deal.id, input.invoiceDetails, t);
      }
      await t.commit();
      await createActivityLog('deal', 'create', deal.id, admin.id, t, 'Deal created succesfully');
      return deal;
    } catch (error: Error | unknown) {
      console.log(error);
      await t.rollback();
      throw new BaseError(ERRORS[(error as any)?.message as keyof typeof ERRORS] || ERRORS.SOMETHING_WENT_WRONG);
    }
  }

  public async getDeals(query: GetPaginatedDealsInput, user: User): Promise<IPaginationRes<Deal>> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(DealPermissionsEnum.VIEW_GLOBAL_DEALS)) query.userId = user.id;

    const { rows: deals, count: totalItems } = await Deal.findAndCountAll({
      where: {
        stage: {
          [Op.ne]: DealStageEnums.CONVERTED
        },
        ...(query.searchKey && {
          [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }, { companyName: { [Op.iLike]: `%${query.searchKey}%` } }]
        }),
        ...(query?.stage &&
          isArray(query.stage) &&
          query.stage.length && {
            stage: {
              [Op.in]: query.stage
            }
          }),
        ...(query?.contractType &&
          isArray(query.contractType) &&
          query.contractType.length && {
            contractType: {
              [Op.in]: query.contractType
            }
          }),
        ...((query.fromDate || query.toDate) && {
          createdAt: {
            ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
            ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
          }
        }),
        ...((query.fromPrice || query.toPrice) && {
          price: {
            ...(query.fromPrice && { [Op.gte]: query.fromPrice }),
            ...(query.toPrice && { [Op.lte]: query.toPrice })
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
          query.sortBy && Object.keys(DealSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ],
      attributes: { exclude: ['cancelledReason'] }
    });

    return {
      docs: deals,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async getDealById(id: string, user: User): Promise<Deal> {
    await this.validateDealAccess(id, user);

    const deal = await this.dealOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] }
      },
      {
        model: Client,
        as: 'client',
        attributes: ['id', 'clientName', 'email']
      },
      Invoice,
      DealDelivery
    ]);
    return deal;
  }

  public async assignUserToDeal(input: AssignUserToDealInput, user: User): Promise<Deal> {
    await this.validateDealAccess(input.dealId, user);

    const deal = await this.dealOrError({ id: input.dealId });

    await userService.userOrError({ id: input.userId });

    deal.set({ userId: input.userId });

    await notificationService.sendAssignDealNotification({ userId: input.userId, target: deal.id }, deal, user);

    await createActivityLog('deal', 'assign', deal.id, user.id, null, `User with Id ${user.id} assigined succesfully`);

    return await deal.save();
  }

  public async updateDeal(input: UpdateDealInput, user: User): Promise<Deal> {
    await this.validateDealAccess(input.dealId, user);

    const deal = await this.dealOrError({ id: input.dealId });

    if (input.name || input.companyName) {
      const existingDeal = await Deal.findOne({
        where: {
          id: { [Op.ne]: input.dealId },
          name: input.name,
          companyName: input.companyName
        },
        attributes: ['name', 'companyName', 'id']
      });
      if (existingDeal) throw new BaseError(ERRORS.DEAL_ALREADY_EXIST);
    }
    const users = input.users?.filter((item: number) => !deal.users.map(e => e.id).includes(item));

    input.invoiceDetails?.length && (await this.createOrUpdateDealInvoice(input.dealId, input.invoiceDetails, user));
    input.deliveryDetails?.length && (await this.createOrUpdateDealDeliveryDetails(input.dealId, input.deliveryDetails, user));

    input.deletedDeliveryIds?.length && (await DealDelivery.destroy({ where: { id: { [Op.in]: input.deletedDeliveryIds } } }));
    input.deletedInvoiceIds?.length && (await Invoice.destroy({ where: { id: { [Op.in]: input.deletedInvoiceIds } } }));

    delete input.deletedDeliveryIds;
    delete input.deletedInvoiceIds;
    delete input.invoiceDetails;
    delete input.deliveryDetails;
    deal.set({
      ...input
    });
    if (users?.length) {
      users.forEach(async (item: number) => {
        await notificationService.sendAssignDealNotification({ userId: item, target: deal.id }, deal, user);
      });
    }
    await createActivityLog('deal', 'update', deal.id, user.id, null, `New updates added suucesfully`);
    await deal.save();
    if (input.users && Array.isArray(input.users)) await deal.$set('users', input.users);

    return await this.getDealById(deal.id, user);
  }

  public async createOrUpdateDealInvoice(dealId: string, input: CreateDealInvoiceInput[], user: User) {
    await this.validateDealAccess(dealId, user);

    const newInvoice: Partial<Invoice>[] = [];
    const updateInvoice: Partial<Invoice>[] = [];

    input!.forEach(e => (e.id ? updateInvoice.push(e) : newInvoice.push({ ...e, dealId })));
    await Invoice.bulkCreate(newInvoice as []);

    await Promise.all(updateInvoice.map(async e => await Invoice.update(e, { where: { id: e.id } })));
  }

  public async createOrUpdateDealDeliveryDetails(dealId: string, input: CreateDeliveryDetailsInput[], user: User) {
    await this.validateDealAccess(dealId, user);

    const newDeliveryDetails: Partial<DealDelivery>[] = [];
    const updateDeliveryDetails: Partial<DealDelivery>[] = [];
    input!.forEach(e => (e.id ? updateDeliveryDetails.push(e) : newDeliveryDetails.push({ ...e, dealId })));

    newDeliveryDetails.length && (await DealDelivery.bulkCreate(newDeliveryDetails));
    await Promise.all(updateDeliveryDetails.map(async e => await DealDelivery.update(e, { where: { id: e.id } })));
  }

  public async createDealInvoice(dealId: string, input: CreateDealInvoiceInput[], TX?: Transaction) {
    // const existingDeal = await Deal.findByPk(dealId, { transaction: TX });
    // if (!existingDeal) throw new BaseError(ERRORS.DEAL_NOT_FOUND);

    return await Invoice.bulkCreate(
      input.map(e => ({
        ...e,
        dealId
      })),
      {
        transaction: TX
      }
    );
  }

  public async createDealDeliveryDetails(dealId: string, input: CreateDeliveryDetailsInput[], TX?: Transaction) {
    // const existingDeal = await Deal.findByPk(dealId, { transaction: TX });
    // if (!existingDeal) throw new BaseError(ERRORS.DEAL_NOT_FOUND);

    return await DealDelivery.bulkCreate(
      input.map(e => ({
        ...e,
        dealId
      })),
      {
        transaction: TX
      }
    );
  }

  async dealOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Deal> {
    const deal = await Deal.findOne({ where: filter, include: joinedTables || [] });
    if (!deal) throw new BaseError(ERRORS.DEAL_NOT_FOUND);
    return deal;
  }

  public async validateDealAccess(dealId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(DealPermissionsEnum.VIEW_GLOBAL_DEALS)) return;

    const isAssigned = await this.isUserAssignedToDeal(dealId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToDeal(dealId: string, userId: number): Promise<boolean> {
    const assignment = await DealUsers.findOne({ where: { dealId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  public async sendDealsExcelByEmail(query: GetPaginatedDealsInput, user: User, email: string): Promise<void> {
    const where: any = {
      stage: {
        [Op.ne]: DealStageEnums.CONVERTED
      },
      ...(query.searchKey && {
        [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }, { companyName: { [Op.iLike]: `%${query.searchKey}%` } }]
      }),
      ...(query.stage?.length &&
        isArray(query.stage) && {
          stage: { [Op.in]: query.stage }
        }),
      ...(query?.contractType &&
        isArray(query.contractType) &&
        query.contractType.length && {
          contractType: {
            [Op.in]: query.contractType
          }
        }),
      ...(query.fromDate || query.toDate
        ? {
            createdAt: {
              ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
              ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
            }
          }
        : {}),
      ...(query.fromPrice || query.toPrice
        ? {
            price: {
              ...(query.fromPrice && { [Op.gte]: query.fromPrice }),
              ...(query.toPrice && { [Op.lte]: query.toPrice })
            }
          }
        : {})
    };

    if (!user.role.permissions.includes(DealPermissionsEnum.VIEW_GLOBAL_DEALS)) {
      where['$users.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Deals');

    worksheet.columns = [
      { header: 'Deal Name', key: 'name', width: 30 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Stage', key: 'stage', width: 20 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const deals = await Deal.findAll({
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

      for (const deal of deals) {
        worksheet.addRow({
          name: deal.name,
          companyName: deal.companyName,
          stage: deal.stage,
          price: deal.price,
          createdAt: deal.createdAt
        });
      }

      hasMore = deals.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Deals Export',
      text: 'Attached is the Excel file containing the filtered deals.',
      attachment: {
        name: 'deals.xlsx',
        content: attachment
      }
    });
  }
}

export default new DealService();
