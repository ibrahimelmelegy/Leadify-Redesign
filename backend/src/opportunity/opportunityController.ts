import { Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import opportunityService from './opportunityService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class OpportunityController {
  public async createOpportunity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await opportunityService.createOpportunity(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async convertLeadToOpportunity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await opportunityService.convertLeadToOpportunity(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateOpportunity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await opportunityService.updateOpportunity(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getOpportunities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await opportunityService.getOpportunities(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async opportunityById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await opportunityService.opportunityById(req.params.id, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendOpportunitiesExcelByEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await opportunityService.sendOpportunitiesExcelByEmail(req.query, req.user as User, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new OpportunityController();
