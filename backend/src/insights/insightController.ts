import insightService from './insightService';
import { AuthenticatedRequest } from '../types';
import { wrapResult } from '../utils/response/responseWrapper';
import { NextFunction, Response } from 'express';
import User from '../user/userModel';

class InsightController {
  async getLeadsSalesInsights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const responseFromService = await insightService.getLeadsSalesInsights(req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsOperationsInsights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const responseFromService = await insightService.getProjectsOperationsInsights(req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  async getFinancialAndBusinessMetricsInsights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const responseFromService = await insightService.getFinancialAndBusinessMetricsInsights(req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  async getPerformanceAndHRInsights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const responseFromService = await insightService.getPerformanceAndHRInsights(req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
}
export default new InsightController();
