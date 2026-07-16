import express from 'express';
import {
  getStates,
  getCitiesByState,
  getAreasByCity
} from '../controllers/locationController.js';

const router = express.Router();

// Public routes for location lookup dropdown helpers
router.get('/states', getStates);
router.get('/states/:stateId/cities', getCitiesByState);
router.get('/cities/:cityId/areas', getAreasByCity);

export default router;
