import express from 'express';
import {
  listPendingProperties,
  approveProperty,
  rejectProperty,
  listUsers,
  updateUser,
  deleteUser,
  createState,
  deleteState,
  createCity,
  deleteCity,
  createArea,
  deleteArea,
  listAllCities,
  listAllAreas,
  listAllStates
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route guarding: Restrict all admin moderation routes to ADMIN accounts
router.use(protect);
router.use(restrictTo('ADMIN'));

// Moderation
router.get('/pending', listPendingProperties);
router.patch('/approve/:id', approveProperty);
router.patch('/reject/:id', rejectProperty);

// User Master
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Location Master
router.get('/locations/states', listAllStates);
router.get('/locations/cities', listAllCities);
router.get('/locations/areas', listAllAreas);
router.post('/locations/states', createState);
router.delete('/locations/states/:id', deleteState);
router.post('/locations/cities', createCity);
router.delete('/locations/cities/:id', deleteCity);
router.post('/locations/areas', createArea);
router.delete('/locations/areas/:id', deleteArea);

export default router;
