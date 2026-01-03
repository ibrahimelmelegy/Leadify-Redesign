// BaseError.ts
import { ERRORS } from './errors';

class BaseError extends Error {
  public code: number; // Error code as number
  public statusCode: number; // HTTP status code

  constructor(code: number, message?: string) {
    super(message || ERRORS[code] || 'Unknown error');
    this.code = code;
    this.statusCode = code; // You can use the error code as the HTTP status code
    Object.setPrototypeOf(this, new.target.prototype); // Maintain prototype chain
  }
}

export default BaseError;
