import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHelpers.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.message.includes('duplicate key value violates unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (err.message.includes('foreign key constraint')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  if (err.message.includes('invalid input syntax')) {
    statusCode = 400;
    message = 'Invalid data format';
  }

  // Send error response
  return sendError(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};