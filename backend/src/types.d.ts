import { Request } from 'express';
import User from './user/userModel';

export interface AuthenticatedRequest extends Request {
  user?: InstanceType<typeof User>; // or just `User` if it's the instance type
  emailApiKey?: InstanceType<typeof String>;
}

export interface IPaginationRes<T> {
  docs: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
