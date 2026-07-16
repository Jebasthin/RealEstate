import express from 'express';
import {
  createProperty,
  listProperties,
  myListings,
  getPropertyDetails,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  listAmenities,
  getNextViewId
} from '../controllers/propertyController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', listProperties);
router.get('/amenities', listAmenities);

// User listings (must be logged in)
router.get('/my-listings', protect, myListings);
router.get('/next-view-id', protect, restrictTo('SELLER', 'ADMIN'), getNextViewId);

// Create listings (must be Seller or Admin)
router.post('/', protect, restrictTo('SELLER', 'ADMIN'), createProperty);

// Detail lookup (optional token parsing is handled inside controllers using header checks if present)
// We will bind protect optionally in our middleware
import { parseUserOptional } from '../middleware/authMiddleware.js';
router.get('/:id', parseUserOptional, getPropertyDetails);

// Modify listings (must be logged in)
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.patch('/:id/status', protect, updatePropertyStatus);

export default router;
