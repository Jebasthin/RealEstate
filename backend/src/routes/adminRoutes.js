import express from 'express';
import {
  listPendingProperties,
  approveProperty,
  rejectProperty
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route guarding: Restrict all admin moderation routes to ADMIN accounts
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/pending', listPendingProperties);
router.patch('/approve/:id', approveProperty);
router.patch('/reject/:id', rejectProperty);

export default router;
