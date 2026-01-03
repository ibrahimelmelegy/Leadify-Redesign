import { Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import proposalService from './proposalContentService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class proposalContentController {
  public async createProposalContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalService.createProposalContent(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateProposalContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalService.updateProposalContent(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProposalContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await proposalService.deleteProposalContent(req.params.id, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new proposalContentController();
