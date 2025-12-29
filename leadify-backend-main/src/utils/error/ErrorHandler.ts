import { Request, Response, NextFunction } from 'express';
import BaseError from './base-http-exception';

export default (error: Error, req: Request, res: Response, next: NextFunction): Response => {
  // Check if the error is an instance of BaseError
  const isBaseError = error instanceof BaseError;
  
  // If it's not a BaseError, handle it as a generic error
  const statusCode = isBaseError ? error.statusCode : 500;  // Default to 500 if it's not a BaseError
  const message = isBaseError ? req.t(error.message) : req.t('internal_server_error'); // Assuming 'internal_server_error' is a translation key

  const response = {
    status: statusCode,
    success: false,
    message,
    body: {},
  };

  console.error(error); // Log the entire error

  return res.status(statusCode).send(response);
};
