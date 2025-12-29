import { col, fn, Op, Sequelize } from 'sequelize';
import Deal from '../deal/model/dealModel';
import Lead from '../lead/leadModel';
import { OpportunityStageEnums } from '../opportunity/opportunityEnum';
import Opportunity from '../opportunity/opportunityModel';
import User from '../user/userModel';
import { startOfMonth, endOfMonth } from 'date-fns';
import Project from '../project/models/projectModel';
import { ProjectCategoryEnum, ProjectStatusEnum } from '../project/projectEnum';
import Manpower from '../manpower/manpowerModel';
import ProjectManpower from '../projectManpower/projectManpowerModel';
import Asset from '../asset/assetModel';
import ProjectAsset from '../projectAsset/projectAssetModel';
import {
  FinancialAndBusinessMetricsWidgetsPermissionsEnum,
  LeadAndSalesWidgetsPermissionsEnum,
  PerformanceAndHRWidgetsPermissionsEnum,
  ProjectsAndOperationsWidgetsPermissionsEnum
} from '../role/roleEnum';
import { DealStageEnums } from '../deal/dealEnum';
import Invoice from '../deal/model/invoiceMode';
import { LeadStatusEnums } from '../lead/leadEnum';

class InsightService {
  async getLeadsSalesInsights(user: User) {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const query: any = {};
    if (!user.role.permissions.includes(LeadAndSalesWidgetsPermissionsEnum.VIEW_GLOBAL_LEAD_SALES_WIDGETS)) query.userId = user.id;
    const [
      leadCount,
      convertedOpportunityFromLeadsCount,
      opportunityCount,
      opportunityStageCounts,
      dealsPipelineDealsCount,
      dealsCount,
      revenueFromDealsResult,
      salesPerformanceRaw
    ] = await Promise.all([
      Lead.count({
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: !!query.userId,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Opportunity.count({
        where: {
          leadId: {
            [Op.ne]: null
          }
        },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: !!query.userId,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Opportunity.count({
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Opportunity.findAll({
        attributes: ['stage', [Sequelize.fn('COUNT', Sequelize.col('Opportunity.id')), 'count']],
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ],
        group: ['Opportunity.stage', 'Opportunity.id', 'users.id']
      }),
      Deal.count({
        where: {
          opportunityId: {
            [Op.ne]: null
          }
        },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Deal.count({
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Deal.findOne({
        where: {
          stage: DealStageEnums.CLOSED
        },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('Deal.price')), 'totalRevenue']],
        include: query.userId
          ? [
              {
                model: User,
                as: 'users',
                attributes: [], // explicitly avoid selecting any user fields
                through: { attributes: [] },
                where: { id: query.userId }
              }
            ]
          : [],
        raw: true, // ensures no model mapping and omits implicit primary key injection
        subQuery: false // prevents subquery generation which could pull in unwanted columns
      }),
      Deal.findAll({
        attributes: [
          [fn('DATE_TRUNC', 'day', col('Deal.createdAt')), 'createdAt'],
          [fn('SUM', col('Deal.price')), 'price'] // Ensure price is fully qualified as 'Deal.price'
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        group: [fn('DATE_TRUNC', 'day', col('Deal.createdAt'))],
        order: [[fn('DATE_TRUNC', 'day', col('Deal.createdAt')), 'ASC']],
        raw: true
      })
    ]);

    const leadConversionRate = leadCount > 0 ? Number(((convertedOpportunityFromLeadsCount / leadCount) * 100).toFixed(2)) : 0;

    const opportunityStages = Object.values(OpportunityStageEnums).reduce((acc: any, stage) => {
      const found = opportunityStageCounts.find((item: any) => item.dataValues.stage === stage);
      const count = found ? Number(found.dataValues.count) : 0;
      acc[stage] = opportunityCount > 0 ? Number(((count / opportunityCount) * 100).toFixed(2)) : 0;
      return acc;
    }, {});

    const dealsPipeline = {
      leads: leadCount,
      opportunities: convertedOpportunityFromLeadsCount,
      deals: dealsPipelineDealsCount
    };

    const revenueFromDeals = Number((revenueFromDealsResult as unknown as { totalRevenue: string | null })?.totalRevenue || 0);

    // Generate last 30 days
    const last30Days = this.generateLast30Days();

    // Format sales performance data and ensure each date in the last 30 days is included
    const salesPerformance = last30Days.map(date => {
      const performanceData = salesPerformanceRaw.find(
        item => item.createdAt.toISOString().split('T')[0] === date // Compare formatted dates
      );
      return {
        date: date,
        revenue: performanceData ? Number(performanceData.price) : 0 // If no data, set revenue to 0
      };
    });

    return {
      leadCount,
      leadConversionRate,
      opportunityCount,
      opportunityStages,
      dealsPipeline,
      dealsCount,
      revenueFromDeals,
      salesPerformance
    };
  }

  generateLast30Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
    }
    return dates;
  };

  async getProjectsOperationsInsights(user: User) {
    const query: any = {};
    if (!user.role.permissions.includes(ProjectsAndOperationsWidgetsPermissionsEnum.VIEW_GLOBAL_PROJECTS_OPERATIONS_WIDGETS)) query.userId = user.id;

    const [projectCount, projectsByStatusRaw, totalManpowerCount, assignedManpowerCount, totalAssetCount, assignedAssetCount, eitmadProjectsCount] =
      await Promise.all([
        Project.count({
          include: [
            {
              model: User,
              as: 'assignedUsers',
              attributes: ['id', 'name'],
              through: { attributes: [] }, // Exclude join table attributes
              required: query.userId ? true : false, // Ensure filtering only when assignedUserId exists
              where: query.userId ? { id: query.userId } : undefined
            }
          ]
        }),
        Project.findAll({
          attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('Project.id')), 'count']],
          include: [
            {
              model: User,
              as: 'assignedUsers',
              attributes: ['id', 'name'],
              through: { attributes: [] },
              required: query.userId ? true : false,
              where: query.userId ? { id: query.userId } : undefined
            }
          ],
          group: ['Project.status', 'Project.id', 'assignedUsers.id']
        }),
        Manpower.count(),
        ProjectManpower.count({
          distinct: true,
          col: 'manpowerId'
        }),
        Asset.count(),
        ProjectAsset.count({
          distinct: true,
          col: 'assetId'
        }),
        Project.count({
          where: {
            category: ProjectCategoryEnum.Etimad
          },
          include: [
            {
              model: User,
              as: 'assignedUsers',
              attributes: ['id', 'name'],
              through: { attributes: [] },
              required: query.userId ? true : false,
              where: query.userId ? { id: query.userId } : undefined
            }
          ]
        })
      ]);

    const projectsByStatus = Object.values(ProjectStatusEnum).reduce((acc: any, status) => {
      const found = projectsByStatusRaw.find(item => item.dataValues.status === status);
      const count = found ? Number(found.dataValues.count) : 0;
      acc[status] = count;
      return acc;
    }, {});

    const usedManpowerPercentage = totalManpowerCount > 0 ? Number(((assignedManpowerCount / totalManpowerCount) * 100).toFixed(2)) : 0;
    // Calculate percentage of used assets
    const usedAssetPercentage = totalAssetCount > 0 ? Number(((assignedAssetCount / totalAssetCount) * 100).toFixed(2)) : 0;

    // Project Profitability Analysis (KPI Box) → Project Profitability= (Total Revenue from  Projects −Total Project Expenses) / Total Revenue from Projects ×100

    // Total Revenue from Projects = Total Material Margin Commissions + Project Margin

    // Total Project Expenses = All project costs Manpower + Vehicles + Materials + Assets

    return {
      projectCount,
      projectsByStatus,
      usedManpowerPercentage,
      usedAssetPercentage,
      eitmadProjectsCount
    };
  }

  async getFinancialAndBusinessMetricsInsights(user: User) {
    const query: any = {};
    if (!user.role.permissions.includes(FinancialAndBusinessMetricsWidgetsPermissionsEnum.VIEW_GLOBAL_FINANCIAL_BUSINESS_METRICS_WIDGETS))
      query.userId = user.id;

    const [revenueFromDealsResult, outstandingInvoicesCount, collectedPaymentsCount] = await Promise.all([
      Deal.findOne({
        where: {
          stage: DealStageEnums.CLOSED
        },
        attributes: [[Sequelize.fn('SUM', Sequelize.col('Deal.price')), 'totalRevenue']],
        include: query.userId
          ? [
              {
                model: User,
                as: 'users',
                attributes: [], // explicitly avoid selecting any user fields
                through: { attributes: [] },
                where: { id: query.userId }
              }
            ]
          : [],
        raw: true, // ensures no model mapping and omits implicit primary key injection
        subQuery: false // prevents subquery generation which could pull in unwanted columns
      }),
      Invoice.count({
        where: {
          collected: false
        }
      }),
      Invoice.count({
        where: {
          collected: true
        }
      })
    ]);

    const revenueFromDeals = Number((revenueFromDealsResult as unknown as { totalRevenue: string | null })?.totalRevenue || 0);

    return {
      revenueFromDeals,
      outstandingInvoicesCount,
      collectedPaymentsCount
    };
  }

  async getPerformanceAndHRInsights(user: User) {
    const query: any = {};
    if (!user.role.permissions.includes(PerformanceAndHRWidgetsPermissionsEnum.VIEW_GLOBAL_PERFORMANCE_HR_WIDGETS)) query.userId = user.id;

    const [leadCount, opportunityCount, convertedDealsFromOpportunityCount, dealsCount] = await Promise.all([
      Lead.count({
        where: {
          status: LeadStatusEnums.QUALIFIED
        },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: !!query.userId,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Opportunity.count({
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Deal.count({
        where: {
          opportunityId: {
            [Op.ne]: null
          }
        },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      }),
      Deal.count({
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: [] },
            required: query.userId ? true : false,
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      })
    ]);

    const percentageOfOpportunitiesBecameDeals =
      opportunityCount > 0 ? Number(((convertedDealsFromOpportunityCount / opportunityCount) * 100).toFixed(2)) : 0;
    return {
      leadCount,
      percentageOfOpportunitiesBecameDeals,
      dealsCount
    };
  }
}
export default new InsightService();
