import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Generate a short-lived access token containing userId and role
 * @param {Object} user 
 * @returns {string} jwt access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate a long-lived refresh token containing userId
 * @param {Object} user 
 * @returns {string} jwt refresh token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify JWT access token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Verify JWT refresh token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Hash plain password using bcryptjs
 * @param {string} password 
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain password against hash
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} match result
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
