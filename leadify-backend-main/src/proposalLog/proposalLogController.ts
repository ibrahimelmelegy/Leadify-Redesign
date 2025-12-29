import { Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import proposalLogService from './proposalLogService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class proposalLogController {
  public async getProposalLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalLogService.getProposalLogs(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
}

export default new proposalLogController();
