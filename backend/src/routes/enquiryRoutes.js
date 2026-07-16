import express from 'express';
import { createEnquiry, myLeads, mySentEnquiries } from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route guarding: Enquiries require authentication
router.use(protect);

router.post('/', createEnquiry);
router.get('/my-leads', myLeads);
router.get('/my-enquiries', mySentEnquiries);

export default router;
