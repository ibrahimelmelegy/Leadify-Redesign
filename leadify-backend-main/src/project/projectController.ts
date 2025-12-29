import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';
import { wrapResult } from '../utils/response/responseWrapper';
import projectService from './projectService';

class ProjectController {
  public async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectService.createProject(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async associatingVehicles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await projectService.associatingVehicles(req.params.id, req.body, req.user as User);
      wrapResult(res, response);
    } catch (error) {
      next(error);
    }
  }

  public async associatingManpower(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await projectService.associatingManpower(req.params.id, req.body, req.user as User);
      wrapResult(res, response);
    } catch (error) {
      next(error);
    }
  }

  public async associatingMaterials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await projectService.associateingMaterial(req.params.id, req.body, req.user as User);
      wrapResult(res, response);
    } catch (error) {
      next(error);
    }
  }

  public async associatingAsset(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await projectService.associateAssetsToProject(req.params.id, req.body, req.user as User);
      wrapResult(res, response);
    } catch (error) {
      next(error);
    }
  }

  public async completeProjectCreation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const previewData = await projectService.completeProjectCreation(req.params.id, req.body, req.user as User);
      wrapResult(res, previewData, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await projectService.getProjects(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
  public async getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.getProjectById(req.params.id, req.user as User);
      wrapResult(res, project, 200);
    } catch (error) {
      next(error);
    }
  }
  public async getDraftProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.getDraftProject();
      wrapResult(res, project, 200);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.deleteProject(req.params.id, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async sendProjectsExcelByEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.sendProjectsExcelByEmail(req.query, req.user as User, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
