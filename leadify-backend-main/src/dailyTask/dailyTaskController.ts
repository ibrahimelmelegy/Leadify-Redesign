import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import dailyTaskService from './dailyTaskService';

class DailyTaskController {
  public async createDailyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.createDailyTask(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateDailyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.updateDailyTask(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getDailyTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.getDailyTasks(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getDailyTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.getDailyTaskById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteDailyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.deleteDailyTask(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getDailyTasksStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await dailyTaskService.getDailyTasksStatistics();
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
}

export default new DailyTaskController();
