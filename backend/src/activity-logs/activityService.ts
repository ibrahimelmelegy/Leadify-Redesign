import { DealActivity } from './model/dealActivities';
import { ActivityActionType } from './model/activities';
import { OpportunityActivity } from './model/opportunityActivities';
import { LeadActivity } from './model/leadActivities';
import { ClientActivity } from './model/clientActivities';
import { ProjectActivity } from './model/projectActivities';

type ActivityModel = 'deal' | 'opportunity' | 'lead' | 'client' | 'project';
const actionModel: Record<ActivityModel, any> = {
  deal: DealActivity,
  opportunity: OpportunityActivity,
  lead: LeadActivity,
  client: ClientActivity,
  project: ProjectActivity
};

export async function createActivityLog(
  model: ActivityModel,
  actionType: ActivityActionType,
  modelId: string,
  userId: number,
  transation?: any,
  data?: any
) {
  await actionModel[model].create(
    {
      userId,
      descripion: `${data}`,
      status: actionType,
      [model + 'Id']: modelId
    },
    { transation }
  );
  return true;
}
export async function getActivityLogs(model: ActivityModel, modelId: string, page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  const { rows: docs, count: totalItems } = await actionModel[model].findAndCountAll({
    where: {
      [model + 'Id']: modelId
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: { all: true }
  });

  return {
    docs,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
}
