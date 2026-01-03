import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import userService from './userService';

class UserController {
  public async createSuperAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await userService.createSuperAdmin();
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await userService.createUser(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Update user details
   * @route PUT /api/user/:id
   * @access Admin
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await userService.updateUser(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get all users
   * @route GET /api/user/
   * @access Admin
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await userService.getUsers(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get user by ID
   * @route GET /api/user/:id
   * @access Admin
   */
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await userService.getUserById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async sendUsersExcelByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.sendUsersExcelByEmail(req.query, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
