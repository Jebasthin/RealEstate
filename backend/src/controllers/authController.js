import prisma from '../config/db.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword
} from '../utils/token.js';
import { ApiError } from '../middleware/errorMiddleware.js';

// Max-age for cookie: 7 days in milliseconds
const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    const { email, password, fullName, role, mobile } = validatedData;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, 'A user with this email address already exists.');
    }

    // Encrypt password
    const passwordHash = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        mobile: mobile || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        mobile: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and issue Access & Refresh tokens
 */
export const login = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Verify password
    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to database
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          mobile: user.mobile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token — stable reuse strategy (no rotation)
 * The refresh token stays valid until its TTL expires or the user logs out.
 * This avoids double-call issues from React StrictMode during page refresh.
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new ApiError(401, 'Authentication token missing.');
    }

    // 1. Verify token signature
    let decodedPayload;
    try {
      decodedPayload = verifyRefreshToken(refreshToken);
    } catch (err) {
      // Invalid/expired JWT signature — clear cookie only, don't delete DB record since
      // token may not exist in DB if it was already cleared
      res.clearCookie('refreshToken');
      throw new ApiError(401, 'Invalid refresh token.');
    }

    // 2. Query token record in DB to check revocation / database presence
    const savedTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!savedTokenRecord) {
      // Token not in database (revoked on logout or fake token)
      // Do NOT clear cookie here — it may already have been updated to a valid new token
      // by a concurrent request. Just refuse with 401.
      throw new ApiError(401, 'Refresh token has been revoked or is invalid.');
    }

    // 3. Check expiration against DB record
    if (new Date() > new Date(savedTokenRecord.expiresAt)) {
      await prisma.refreshToken.delete({ where: { id: savedTokenRecord.id } });
      res.clearCookie('refreshToken');
      throw new ApiError(401, 'Refresh token has expired. Please login again.');
    }

    const user = savedTokenRecord.user;

    // 4. Issue a fresh access token (refresh token is REUSED — not rotated)
    const newAccessToken = generateAccessToken(user);

    // Re-set the same refresh token cookie to slide the browser expiry window
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user and clear tokens
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Delete from DB so it cannot be reused
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Clear client-side cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user details
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        mobile: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
