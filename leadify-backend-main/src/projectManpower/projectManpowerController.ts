import { Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import projectManpowerService from './projectManpowerService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class ProjectManpowerController {
  public async createProjectManpower(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectManpowerService.createProjectManpower(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateProjectManpower(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectManpowerService.updateProjectManpower(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getProjectManpowers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectManpowerService.getProjectManpowers(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async projectManpowerById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectManpowerService.projectManpowerById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProjectManpower(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectManpowerService.deleteProjectManpower(req.params.id, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectManpowerController();
