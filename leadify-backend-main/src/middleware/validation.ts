import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import 'reflect-metadata';

// Type definition for ClassConstructor
type ClassConstructor<T> = {
  new (...args: any[]): T;
};

// Helper function to format errors recursively
function formatValidationErrors(errors: any[]): any[] {
  return errors.map(error => {
    const formattedError: any = {
      property: error.property,
      constraints: error.constraints || {}
    };

    if (error.children && error.children.length > 0) {
      formattedError.children = formatValidationErrors(error.children);
    }

    return formattedError;
  });
}

// Main validation middleware
export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // Step 1: Transform the body into an instance of the DTO class
    const dtoObject = plainToInstance(dtoClass, req.body, {
      excludeExtraneousValues: false // Retain all fields for extra fields check
    });

    // Validate the transformed DTO object
    // NOTE: rely on class-validator's whitelist + forbidNonWhitelisted to block extra fields.
    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true });
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatValidationErrors(errors) // Use the helper function for detailed formatting
      });
    }
    // Sanitize the DTO object by removing undefined values
    const sanitizedQuery = Object.fromEntries(Object.entries(dtoObject).filter(([_, value]) => value !== undefined));

    // Step 6: Assign sanitized query to req.query
    req.body = sanitizedQuery;
    next(); // Call the next middleware
  };
}

// Middleware for validating the query
export function validateQuery<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request<{}, {}, {}, ParsedQs>, res: Response, next: NextFunction): Promise<any> => {
    // Step 1: Transform the query params into an instance of the DTO class
    const dtoObject = plainToInstance(dtoClass, req.query, {
      excludeExtraneousValues: false // Retain all fields for extra fields check
    });

    // Validate the transformed DTO object
    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true });
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints
        }))
      });
    }
    // Step 5: Sanitize the DTO object by removing undefined or null values
    const sanitizedQuery = Object.fromEntries(Object.entries(dtoObject).filter(([_, value]) => value !== undefined));

    // Step 6: Assign sanitized query to req.query
    req.query = sanitizedQuery;
    next(); // Call the next middleware
  };
}
