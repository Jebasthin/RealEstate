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
 * Refresh access token using rotation strategy
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
      // Invalid/expired token -> clear database records for this token if it exists
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
      res.clearCookie('refreshToken');
      throw new ApiError(401, 'Invalid refresh token.');
    }

    // 2. Query token record in DB to check revocation / database presence
    const savedTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!savedTokenRecord) {
      // Token not in database (could be a reused revoked token, or fake)
      // For safety, clear cookie
      res.clearCookie('refreshToken');
      throw new ApiError(401, 'Refresh token has been revoked or is invalid.');
    }

    // Check expiration
    if (new Date() > new Date(savedTokenRecord.expiresAt)) {
      await prisma.refreshToken.delete({ where: { id: savedTokenRecord.id } });
      res.clearCookie('refreshToken');
      throw new ApiError(401, 'Refresh token has expired. Please login again.');
    }

    const user = savedTokenRecord.user;

    // 3. Implement Refresh Token Rotation (RTR) for security
    // Delete the old refresh token
    await prisma.refreshToken.delete({
      where: { id: savedTokenRecord.id },
    });

    // Generate new set of tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token in DB
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
      },
    });

    // Send new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
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
