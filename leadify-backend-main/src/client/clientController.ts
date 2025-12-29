import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { wrapResult } from '../utils/response/responseWrapper';
import ClientService from './clientService';
import { CreateClientInput } from './inputs/createClientInput';
import User from '../user/userModel';

class ClientController {
  public async createClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateClientInput;
      !body.users?.length && (body.users = [req.user!.id]);
      const responseFromService = await ClientService.createClient(body, req.user as User);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await ClientService.updateClient(req.params.id, req.body, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getClients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await ClientService.getClients(req.query, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async ClientById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await ClientService.clientById(req.params.id, req.user as User);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async clients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await ClientService.getClientsArray();
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendClientsExcelByEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await ClientService.sendClientsExcelByEmail(req.query, req.user as User, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();
