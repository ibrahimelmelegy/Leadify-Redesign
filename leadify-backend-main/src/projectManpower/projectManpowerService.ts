import { Includeable, Op, WhereOptions } from 'sequelize';
import ProjectManpower from './projectManpowerModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import manpowerService from '../manpower/manpowerService';
import { MissionEnum } from './projectManpowerEnum';
import Manpower from '../manpower/manpowerModel';
import projectService from '../project/projectService';
import User from '../user/userModel';
import { createActivityLog } from '../activity-logs/activityService';

class ProjectManpowerService {
  public async createProjectManpower(data: any, user: User): Promise<ProjectManpower> {
    const { projectId, manpowerId, estimatedWorkDays, mission, otherCosts, otherCostsReason, actualWorkDays } = data;
    await projectService.validateProjectAccess(projectId, user);

    const project = await projectService.projectOrError({ id: projectId });
    const manpower = await manpowerService.manpowerOrError({ id: manpowerId });

    // Calculate mission weight
    const missionWeight = mission.reduce((totalWeight: number, missionItem: string) => {
      const missionValue = MissionEnum[missionItem as keyof typeof MissionEnum] || 0;
      return totalWeight + missionValue;
    }, 0);

    // Calculate costs
    const durationCost = manpower.dailyCost * estimatedWorkDays * missionWeight;

    const projectManpower = await ProjectManpower.create({
      projectId,
      manpowerId,
      estimatedWorkDays,
      actualWorkDays,
      mission,
      durationCost: parseFloat(durationCost.toFixed(2)),
      otherCosts,
      otherCostsReason
    });
    await projectService.recalculateProject(project);
    project.isCompleted && (await createActivityLog('project', 'update', project.id, user.id, null, 'Prject manpower got updated Successfully'));

    return this.projectManpowerById(projectManpower.id);
  }

  public async updateProjectManpower(id: string, data: any, user: User): Promise<ProjectManpower> {
    await projectService.validateProjectAccess(id, user);

    const projectManpower = await this.projectManpowerOrError({ id });
    const project = await projectService.projectOrError({ id: projectManpower.projectId });
    const manpower = await manpowerService.manpowerOrError({ id: projectManpower.manpowerId });

    // Recalculate costs if applicable
    if (data.estimatedWorkDays || data.mission || data.otherCosts) {
      const missionWeight = (data.mission || projectManpower.mission).reduce((totalWeight: number, missionItem: string) => {
        const missionValue = MissionEnum[missionItem as keyof typeof MissionEnum] || 0;
        return totalWeight + missionValue;
      }, 0);

      const durationCost = manpower.dailyCost * (data.estimatedWorkDays || projectManpower.estimatedWorkDays) * missionWeight;
      data.durationCost = parseFloat(durationCost.toFixed(2));
    }

    await projectManpower.update(data);
    await projectService.recalculateProject(project);
    project.isCompleted && (await createActivityLog('project', 'update', project.id, user.id, null, 'Prject manpower got updated Successfully'));
    return this.projectManpowerById(projectManpower.id);
  }

  public async getProjectManpowers(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: manpowers, count: totalItems } = await ProjectManpower.findAndCountAll({
      where: {
        ...(query.projectId && { projectId: query.projectId }),
        ...(query.searchKey && {
          [Op.or]: [{ totalCost: { [Op.iLike]: `%${query.searchKey}%` } }]
        })
      },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Manpower,
          as: 'manpower',
          attributes: ['name', 'phone']
        }
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

  public async projectManpowerById(id: string): Promise<ProjectManpower> {
    const projectManpower = await this.projectManpowerOrError({ id }, [
      {
        model: Manpower,
        as: 'manpower',
        attributes: ['name', 'phone']
      }
    ]);
    return projectManpower;
  }

  public async deleteProjectManpower(id: string, user: User): Promise<void> {
    const projectManpower = await this.projectManpowerOrError({ id });
    const project = await projectService.projectOrError({ id: projectManpower.projectId });
    await projectService.validateProjectAccess(id, user);
    await projectManpower.destroy();
    await projectService.recalculateProject(project);
    project.isCompleted && (await createActivityLog('project', 'update', project.id, user.id, null, 'Prject manpower got updated Successfully'));
  }

  async projectManpowerOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<ProjectManpower> {
    const projectManpower = await ProjectManpower.findOne({ where: filter, include: joinedTables || [] });
    if (!projectManpower) throw new BaseError(ERRORS.PROJECT_MANPOWER_NOT_FOUND);
    return projectManpower;
  }
}

export default new ProjectManpowerService();
