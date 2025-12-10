import express from 'express';
import { 
  matchResumeWithJob, 
  getMatchHistory, 
  getMatchDetails 
} from '../Controllers/resumeMatchController.js';
import { auth } from '../Middleware/authMiddle.js';

const router = express.Router();

// Match resume with job description
router.post('/match', auth, matchResumeWithJob);

// Get match history
router.get('/history', auth, getMatchHistory);

// Get specific match details
router.get('/:id', auth, getMatchDetails);

export default router;