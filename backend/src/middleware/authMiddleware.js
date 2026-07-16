import { verifyAccessToken } from '../utils/token.js';
import { ApiError } from './errorMiddleware.js';

/**
 * Protect routes by verifying JWT Access Token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    // Verify token
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded; // Attach userId and role to request context
      next();
    } catch (error) {
      throw new ApiError(401, 'Access denied. Invalid or expired token.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict access based on user roles
 * @param {...string} roles - Permitted roles (e.g., 'ADMIN', 'SELLER')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new ApiError(403, 'You do not have permission to perform this action.');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optionally parse JWT Access Token if present, without rejecting request if absent
 */
export const parseUserOptional = (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Silently ignore invalid token errors to let request pass as a guest
  }
  next();
};

