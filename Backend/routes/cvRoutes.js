import express from 'express';
import { 
  saveCV, 
  getUserCVs, 
  getActiveCV, 
  getCV, 
  deleteCV 
} from '../Controllers/cvController.js';
import { auth } from '../Middleware/authMiddle.js';

const router = express.Router();

// Save CV
router.post('/save', auth, saveCV);

// Get user's CVs
router.get('/list', auth, getUserCVs);

// Get active CV
router.get('/active', auth, getActiveCV);

// Get specific CV
router.get('/:id', auth, getCV);

// Delete CV
router.delete('/:id', auth, deleteCV);

export default router;