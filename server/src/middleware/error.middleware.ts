import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Cannot find endpoint ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`Server Error: ${err.message}`, err, { path: req.originalUrl, method: req.method });
    }
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? [],
      },
    });
    return;
  }

  // Unhandled internal errors
  logger.error(`Unhandled Exception: ${err.message}`, err, { path: req.originalUrl, method: req.method });

  const message = env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message;
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      details: env.NODE_ENV === 'development' ? err.stack : [],
    },
  });
};
