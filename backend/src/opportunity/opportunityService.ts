import { Includeable, Op, WhereOptions } from 'sequelize';
import { LeadStatusEnums, SortEnum } from '../lead/leadEnum';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { OpportunitySortByEnum, OpportunityStageEnums } from './opportunityEnum';
import Opportunity from './opportunityModel';
import Lead from '../lead/leadModel';
import leadService from '../lead/leadService';
import notificationService from '../notification/notificationService';
import Client from '../client/clientModel';
import { sequelize } from '../config/db';
import { createActivityLog } from '../activity-logs/activityService';
import { OpportunityPermissionsEnum } from '../role/roleEnum';
import OpportunityUsers from './model/oppotyunity_UsersModel';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class OpportunityService {
  async createOpportunity(input: any, admin: User): Promise<Opportunity | void> {
    const transaction = await sequelize.transaction();
    let lead: Lead | null = null;
    let client: Client | null = null;

    try {
      if (input.clientId) {
        client = await Client.findByPk(input.clientId);
        if (!client) throw new BaseError(ERRORS.CLIENT_ALREADY_FOUND);
      } else if (input.lead) {
        input.lead.status = LeadStatusEnums.CONVERTED;
        lead = await leadService.createLead(input.lead, admin.id, transaction);
      } else if (input.opportunity?.leadId) {
        lead = await Lead.findByPk(input.opportunity.leadId);
        if (!lead) throw new BaseError(ERRORS.LEAD_NOT_FOUND);
      }

      if (!input.opportunity.users || !Array.isArray(input.opportunity.users)) {
        input.opportunity.users = [admin.id];
      } else if (!input.opportunity.users.includes(admin.id)) {
        input.opportunity.users.push(admin.id);
      }

      const opportunity = await Opportunity.create(
        {
          ...input.opportunity,
          leadId: lead?.id || input.opportunity?.leadId || null,
          clientId: client?.id || null
        },
        { transaction }
      );

      await opportunity.$set('users', input.opportunity.users, { transaction });

      // Defer the activity log until after commit
      await transaction.afterCommit(async () => {
        await createActivityLog('opportunity', 'create', opportunity.id, admin.id, undefined, 'Opportunity created successfully');
      });

      for (const userId of input.opportunity.users)
        await notificationService.sendAssignOpportunityNotification({ userId, target: opportunity.id }, opportunity, admin);

      await transaction.commit();
      return opportunity;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async convertLeadToOpportunity(input: any, admin: User): Promise<Opportunity> {
    const user = await User.findAll({
      where: {
        id: {
          [Op.in]: input.users
        }
      }
    });
    if (user.length !== input.users?.length) throw new BaseError(ERRORS.USER_NOT_FOUND);

    if (!input.users || !Array.isArray(input.users)) {
      input.users = [admin.id];
    } else if (!input.users.includes(admin.id)) {
      input.users.push(admin.id);
    }
    const opportunity = await Opportunity.create(input);
    if (input.users && Array.isArray(input.users)) await opportunity.$set('users', input.users);

    await leadService.updateLead(input.leadId, { status: LeadStatusEnums.CONVERTED }, admin);
    input.users.forEach(async (userId: Number) => {
      await notificationService.sendAssignOpportunityNotification({ userId, target: opportunity.id }, opportunity, admin);
    });
    await createActivityLog('opportunity', 'create', opportunity.id, admin.id, undefined, 'Opportunity created succesfully with convert lead');

    return opportunity;
  }

  async updateOpportunity(id: string, input: any, user: User): Promise<Opportunity> {
    await this.validateOpportunityAccess(id, user);

    const opportunity = await this.opportunityOrError({ id });

    const users = input.users?.filter((item: number) => !opportunity.users?.map(e => e.id).includes(item));

    if (users?.length) {
      users.forEach(async (userId: number) => {
        await notificationService.sendAssignOpportunityNotification({ userId, target: opportunity.id }, opportunity, user);
      });
    }

    opportunity.set(input);
    await createActivityLog('opportunity', 'update', opportunity.id, user.id, null, `New updates added suucesfully`);
    if (input.users && Array.isArray(input.users)) await opportunity.$set('users', input.users);

    return await opportunity.save();
  }

  async opportunityOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Opportunity> {
    const opportunity = await Opportunity.findOne({ where: filter, include: joinedTables || [] });
    if (!opportunity) throw new BaseError(ERRORS.OPPORTUNITY_NOT_FOUND);
    return opportunity;
  }

  async getOpportunities(query: any, user: User): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES)) query.userId = user.id;

    const { rows: opportunities, count: totalItems } = await Opportunity.findAndCountAll({
      where: {
        stage: { [Op.ne]: OpportunityStageEnums.CONVERTED },
        ...(query.searchKey && {
          [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }]
        }),
        ...(query.stage?.length && {
          stage: { [Op.in]: query.stage }
        }),
        ...(query.priority?.length && {
          priority: { [Op.in]: query.priority }
        }),
        ...((query.fromDate || query.toDate) && {
          createdAt: {
            ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
            ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
          }
        }),
        ...((query.fromExpectedCloseDate || query.toExpectedCloseDate) && {
          expectedCloseDate: {
            ...(query.fromExpectedCloseDate && { [Op.gte]: new Date(query.fromExpectedCloseDate) }),
            ...(query.toExpectedCloseDate && { [Op.lte]: new Date(query.toExpectedCloseDate) })
          }
        }),
        ...((query.fromEstimatedValue || query.toEstimatedValue) && {
          estimatedValue: {
            ...(query.fromEstimatedValue && { [Op.gte]: query.fromEstimatedValue }),
            ...(query.toEstimatedValue && { [Op.lte]: query.toEstimatedValue })
          }
        }),
        ...((query.fromProfit || query.toProfit) && {
          profit: {
            ...(query.fromProfit && { [Op.gte]: query.fromProfit }),
            ...(query.toProfit && { [Op.lte]: query.toProfit })
          }
        })
      },
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
          ...(query.userId && {
            required: true, // <-- THIS is crucial to apply WHERE in count query
            where: { id: query.userId }
          })
        },
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'name', 'email', 'companyName', 'phone']
        }
      ],
      limit,
      offset,
      distinct: true, // <-- THIS is crucial so count is not duplicated due to joins
      order: [
        [
          query.sortBy && Object.keys(OpportunitySortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: opportunities,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async opportunityById(id: string, user: User): Promise<Opportunity> {
    await this.validateOpportunityAccess(id, user);

    const opportunity = await this.opportunityOrError({ id }, [
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
      }
    ]);

    return opportunity;
  }

  public async validateOpportunityAccess(opportunityId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES)) return;

    const isAssigned = await this.isUserAssignedToOpportunity(opportunityId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToOpportunity(opportunityId: string, userId: number): Promise<boolean> {
    const assignment = await OpportunityUsers.findOne({ where: { opportunityId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  async sendOpportunitiesExcelByEmail(query: any, user: User, email: string): Promise<void> {
    const where: any = {
      stage: { [Op.ne]: OpportunityStageEnums.CONVERTED },
      ...(query.searchKey && {
        [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }]
      }),
      ...(query.stage?.length && { stage: { [Op.in]: query.stage } }),
      ...(query.priority?.length && { priority: { [Op.in]: query.priority } }),
      ...(query.fromDate || query.toDate
        ? {
            createdAt: {
              ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
              ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
            }
          }
        : {}),
      ...(query.fromExpectedCloseDate || query.toExpectedCloseDate
        ? {
            expectedCloseDate: {
              ...(query.fromExpectedCloseDate && { [Op.gte]: new Date(query.fromExpectedCloseDate) }),
              ...(query.toExpectedCloseDate && { [Op.lte]: new Date(query.toExpectedCloseDate) })
            }
          }
        : {}),
      ...(query.fromEstimatedValue || query.toEstimatedValue
        ? {
            estimatedValue: {
              ...(query.fromEstimatedValue && { [Op.gte]: query.fromEstimatedValue }),
              ...(query.toEstimatedValue && { [Op.lte]: query.toEstimatedValue })
            }
          }
        : {}),
      ...((query.fromProfit || query.toProfit) && {
        profit: {
          ...(query.fromProfit && { [Op.gte]: query.fromProfit }),
          ...(query.toProfit && { [Op.lte]: query.toProfit })
        }
      })
    };

    if (!user.role.permissions.includes(OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES)) {
      where['$users.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Opportunities');

    worksheet.columns = [
      { header: 'Opportunity Name', key: 'name', width: 30 },
      { header: 'Stage', key: 'stage', width: 20 },
      { header: 'Lead Name', key: 'leadName', width: 30 },
      { header: 'Priority', key: 'priority', width: 20 },
      { header: 'Estimated Value', key: 'estimatedValue', width: 20 },
      { header: 'Expected Close Date', key: 'expectedCloseDate', width: 25 },
      { header: 'Lead Email', key: 'leadEmail', width: 30 },
      { header: 'Lead Phone', key: 'leadPhone', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const opportunities = await Opportunity.findAll({
        where,
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name'],
            through: { attributes: [] }, // Exclude join table attributes
            required: query.userId ? true : false, // Ensure filtering only when assignedUserId exists
            where: query.userId ? { id: query.userId } : undefined
          },
          {
            model: Lead,
            as: 'lead',
            attributes: ['name', 'email', 'phone']
          }
        ],
        limit: batchSize,
        offset
      });

      for (const opp of opportunities) {
        worksheet.addRow({
          name: opp.name,
          stage: opp.stage,
          leadName: opp.lead?.name,
          priority: opp.priority,
          estimatedValue: opp.estimatedValue,
          expectedCloseDate: opp.expectedCloseDate,
          leadEmail: opp.lead?.email,
          leadPhone: opp.lead?.phone,
          createdAt: opp.createdAt
        });
      }

      hasMore = opportunities.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Opportunities Report',
      text: 'Attached is the Excel file with filtered opportunities.',
      attachment: {
        name: 'opportunities.xlsx',
        content: attachment
      }
    });
  }
}

export default new OpportunityService();
