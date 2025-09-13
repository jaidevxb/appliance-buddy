import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendValidationError } from '../utils/responseHelpers.js';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationError(res, error.errors);
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationError(res, error.errors);
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationError(res, error.errors);
      }
      next(error);
    }
  };
};

// Common parameter schemas
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const applianceParamSchema = z.object({
  applianceId: z.string().uuid('Invalid appliance ID format'),
});

export const nestedResourceParamSchema = z.object({
  applianceId: z.string().uuid('Invalid appliance ID format'),
  id: z.string().uuid('Invalid resource ID format'),
});