import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import leadService from './leadService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class LeadController {
  public async createLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await leadService.createLead(req.body, req.user!.id);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await leadService.updateLead(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getLeads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await leadService.getLeads(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async leadById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await leadService.leadById(req.params.id, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async importLeadSheet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploadedFile = (<any>req).files.file;
      const responseFromService = await leadService.importFile(uploadedFile);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendLeadsExcelByEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
     leadService.sendLeadsExcelByEmail(req.query, req.user as User, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadController();
