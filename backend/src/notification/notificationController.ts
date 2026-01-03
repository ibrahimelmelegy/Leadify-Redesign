import { Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import notificationService from './notificationService';
import { AuthenticatedRequest } from '../types';
import User from '../user/userModel';

class OpportunityController {
  public async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await notificationService.getNotifications(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async updateNotificationsToRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.updateNotificationsToRead(req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async updateNotificationToClicked(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.updateNotificationToClicked(req.params.id, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new OpportunityController();
