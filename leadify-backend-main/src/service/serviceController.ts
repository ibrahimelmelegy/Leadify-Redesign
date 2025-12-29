import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import serviceService from './serviceService';

class ServiceController {
  public async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await serviceService.createService(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await serviceService.updateService(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await serviceService.getServices(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async serviceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await serviceService.serviceById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendServicesExcelByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await serviceService.sendServicesExcelByEmail(req.query, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();
