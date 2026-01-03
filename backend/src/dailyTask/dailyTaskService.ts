import { col, fn, Includeable, literal, Op, Sequelize, WhereOptions } from 'sequelize';
import DailyTask from './dailyTaskModel';
import { UpdateDailyTaskInput } from './inputs/updateDailyTaskInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import User from '../user/userModel';
import Client from '../client/clientModel';
import userService from '../user/userService';
import clientService from '../client/clientService';
import { DailyTaskStatusEnum } from './dailyTaskEnum';
import { addMonths, startOfMonth, subYears } from 'date-fns';

class DailyTaskService {
  public async createDailyTask(data: any): Promise<DailyTask> {
    await userService.userOrError({ id: data.userId });
    await userService.userOrError({ id: data.salesRepresentativeId });
    if (data.clientId) await clientService.clientOrError({ id: data.clientId });
    return DailyTask.create(data);
  }

  public async updateDailyTask(id: string, data: UpdateDailyTaskInput): Promise<DailyTask> {
    if (data.userId) await userService.userOrError({ id: data.userId });
    if (data.salesRepresentativeId) await userService.userOrError({ id: data.salesRepresentativeId });
    if (data.clientId) await clientService.clientOrError({ id: data.clientId });
    const task = await this.taskOrError({ id });
    await task.update(data);
    return task;
  }

  public async getDailyTasks(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: tasks, count: totalItems } = await DailyTask.findAndCountAll({
      where: {
        ...(query.search && {
          name: { [Op.iLike]: `%${query.search}%` }
        }),
        ...(query.status &&
          query.status.length > 0 && {
            status: {
              [Op.in]: query.status
            }
          })
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        },
        {
          model: User,
          as: 'salesRepresentative',
          attributes: ['name']
        },
        {
          model: Client,
          as: 'client',
          attributes: ['clientName']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      docs: tasks,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async getDailyTaskById(id: string): Promise<DailyTask> {
    const task = await this.taskOrError({ id }, [
      {
        model: User,
        as: 'user',
        attributes: ['name']
      },
      {
        model: User,
        as: 'salesRepresentative',
        attributes: ['name']
      },
      {
        model: Client,
        as: 'client',
        attributes: ['clientName']
      }
    ]);
    return task;
  }

  public async deleteDailyTask(id: string): Promise<void> {
    const task = await this.taskOrError({ id });
    await task.destroy();
  }

  async taskOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<DailyTask> {
    const task = await DailyTask.findOne({ where: filter, include: joinedTables || [] });
    if (!task) throw new BaseError(ERRORS.TASK_NOT_FOUND);
    return task;
  }

  public async sendTasksExcelByEmail(query: any, email: string): Promise<void> {
    const where: any = {
      ...(query.search && {
        name: { [Op.iLike]: `%${query.search}%` }
      })
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Tasks');

    worksheet.columns = [
      { header: 'name', key: 'name', width: 30 },

      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await DailyTask.findAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name']
          },
          {
            model: User,
            as: 'salesRepresentative',
            attributes: ['name']
          },
          {
            model: Client,
            as: 'client',
            attributes: ['clientName']
          }
        ],
        raw: true,
        limit: batchSize,
        offset,
        order: [['createdAt', 'DESC']]
      });

      for (const task of batch) {
        worksheet.addRow({
          name: task.name,
          createdAt: task.createdAt
        });
      }

      hasMore = batch.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Daily Tasks Export',
      text: 'Attached is the Excel file with all filtered daily tasks.',
      attachment: {
        name: 'daily_tasks.xlsx',
        content: attachment
      }
    });
  }

  async getDailyTasksStatistics() {
    const oneYearAgo = startOfMonth(subYears(new Date(), 1));

    const [activeTasks, completedTasks, grantedTasks, totalRevenue, monthlyRevenue, taskClientCounts, salesPerformance] = await Promise.all([
      DailyTask.count({
        where: { status: DailyTaskStatusEnum.ACTIVE }
      }),
      DailyTask.count({
        where: { status: DailyTaskStatusEnum.COMPLETED }
      }),
      DailyTask.count({
        where: {
          status: {
            [Op.in]: [DailyTaskStatusEnum.CONTRACT_SIGNED, DailyTaskStatusEnum.WAITING_FOR_CONTRACT]
          }
        }
      }),
      DailyTask.sum('totalPaid', {
        where: {
          status: DailyTaskStatusEnum.COMPLETED
        }
      }),
      DailyTask.findAll({
        attributes: [
          [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
          [fn('SUM', col('totalPaid')), 'totalPaid']
        ],
        where: {
          createdAt: { [Op.gte]: oneYearAgo },
          status: DailyTaskStatusEnum.COMPLETED
        },
        group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
        order: [[literal('month'), 'ASC']],
        raw: true
      }),
      DailyTask.findAll({
        attributes: ['clientId', [Sequelize.fn('COUNT', Sequelize.col('dailyTask.id')), 'count']],
        include: [
          {
            model: Client,
            attributes: ['clientName']
          }
        ],
        group: ['dailyTask.clientId', 'client.id']
      }),
      DailyTask.findAll({
        attributes: [
          [fn('COUNT', col('dailyTask.id')), 'tasksCount'],
          [fn('SUM', col('dailyTask.totalPaid')), 'totalPaid']
        ],
        include: [
          {
            model: User,
            as: 'salesRepresentative',
            attributes: ['name']
          }
        ],
        group: ['salesRepresentative.id', 'salesRepresentative.name'],
        raw: true
      })
    ]);

    const totalCount = activeTasks + completedTasks + grantedTasks;

    const taskStatusPercentage = {
      active: totalCount ? Number(((activeTasks / totalCount) * 100).toFixed(2)) : 0,
      completed: totalCount ? Number(((completedTasks / totalCount) * 100).toFixed(2)) : 0,
      granted: totalCount ? Number(((grantedTasks / totalCount) * 100).toFixed(2)) : 0
    };

    // Build a map of actual revenue data
    const revenueMap = new Map<string, number>();
    for (const entry of monthlyRevenue) {
      const { month, totalPaid } = entry as unknown as {
        month: string;
        totalPaid: string | number | null;
      };
      revenueMap.set(month, Number(totalPaid ?? 0));
    }

    // Generate all 12 months from oneYearAgo
    const formattedMonthlyRevenue = Array.from({ length: 12 }).map((_, i) => {
      const date = addMonths(oneYearAgo, i);
      const monthKey = date.toISOString().substring(0, 7); // "YYYY-MM"
      const rawMonthDate = new Date(date);
      const totalPaid = revenueMap.get(monthKey) ?? 0;

      return {
        month: rawMonthDate.toLocaleString('ar-EG', { month: 'long' }),
        totalPaid: Number(totalPaid.toFixed(2))
      };
    });

    const taskDistributionByClient = taskClientCounts.map((item: any) => {
      const clientName = item.client?.clientName || 'Unknown';
      const count = Number(item.dataValues.count);

      return {
        clientName,
        taskCount: count,
        taskPercentage: totalCount > 0 ? Number(((count / totalCount) * 100).toFixed(2)) : 0
      };
    });

    return {
      activeTasks,
      completedTasks,
      grantedTasks,
      totalRevenue: Number((totalRevenue ?? 0).toFixed(2)),
      taskStatusPercentage,
      monthlyRevenue: formattedMonthlyRevenue,
      taskDistributionByClient,
      salesPerformance: salesPerformance.map((item: any) => ({
        name: item['salesRepresentative.name'],
        tasksCount: Number(item.tasksCount),
        totalPaid: Number((item.totalPaid ?? 0).toFixed(2))
      }))
    };
  }
}

export default new DailyTaskService();
