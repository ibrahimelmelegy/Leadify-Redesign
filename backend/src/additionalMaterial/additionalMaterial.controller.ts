import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { wrapResult } from '../utils/response/responseWrapper';
import materialService from './material.service';

class AdditionalMaterialController {
  public async createMaterial(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await materialService.createAdditionalMaterial(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async getMaterials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await materialService.getMaterials(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getMaterialById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await materialService.getMaterial(+req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async updateMaterial(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await materialService.updateMaterial(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async sendMaterialsExcelByEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await materialService.sendMaterialsExcelByEmail(req.query, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdditionalMaterialController();
