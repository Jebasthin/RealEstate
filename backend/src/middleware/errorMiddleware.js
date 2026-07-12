import { ZodError } from 'zod';

/**
 * Express Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log the full error stack in development for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error Handler]: ${err.stack || err.message}`);
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  // Handle Prisma Database Errors
  if (err.code && err.code.startsWith('P')) {
    // Unique constraint violation (e.g., email already exists)
    if (err.code === 'P2002') {
      const targetField = err.meta?.target ? err.meta.target.join(', ') : 'fields';
      return res.status(400).json({
        success: false,
        message: `Duplicate resource error: A record with this value for ${targetField} already exists.`
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: err.meta?.cause || 'Resource not found'
      });
    }

    // Default Prisma database exception status code
    return res.status(400).json({
      success: false,
      message: 'Database query failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token'
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired'
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Custom Error Class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
