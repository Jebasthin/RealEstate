import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes (requires valid access token)
router.get('/me', protect, getMe);

export default router;
