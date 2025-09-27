import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/api';

/**
 * Send a successful response
 */
export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (res: Response, message: string, statusCode = 400, errors?: any[]): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response => {
  const totalPages = Math.ceil(total / limit);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
  
  return res.json(response);
};

/**
 * Send a not found response
 */
export const sendNotFound = (res: Response, resource = 'Resource'): Response => {
  return sendError(res, `${resource} not found`, 404);
};

/**
 * Send a validation error response
 */
export const sendValidationError = (res: Response, errors: any[]): Response => {
  return sendError(res, 'Validation failed', 400, errors);
};