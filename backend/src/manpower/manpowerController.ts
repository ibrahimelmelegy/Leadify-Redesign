import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import manpowerService from './manpowerService';

class ManpowerController {
  public async createManpower(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await manpowerService.createManpower(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateManpower(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await manpowerService.updateManpower(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getManpowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await manpowerService.getManpowers(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async manpowerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await manpowerService.manpowerById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendManpowerExcelByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await manpowerService.sendManpowerExcelByEmail(req.query, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ManpowerController();
