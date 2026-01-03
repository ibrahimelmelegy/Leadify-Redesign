import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import proposalFinanceTableService from './proposalFinanceTableService';
import proposalContentService from '../proposalContent/proposalContentService';
import User from '../user/userModel';
import { AuthenticatedRequest } from '../types';

class ProposalFinanceTableController {
  public async createFinanceTable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // const proposalContent = await proposalContentService.contentOrError({ id: req.body.proposalId });
      const responseFromService = await proposalFinanceTableService.createFinanceTable(req.body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateFinanceTable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalFinanceTableService.updateFinanceTable(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getFinanceTables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalFinanceTableService.getFinanceTables(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async financeTableById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await proposalFinanceTableService.financeTableById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteFinanceTable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await proposalFinanceTableService.deleteFinanceTable(req.params.id, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async deleteFinanceTableCustomColumn(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await proposalFinanceTableService.deleteFinanceTableCustomColumn(req.params.id, req.params.customColumnKey, req.user as User);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProposalFinanceTableController();
