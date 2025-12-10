import express from "express";
import { 
  generateResume, 
  analyzeJobAndGenerateResume,
  getGeneratedResumeHistory,
  getGeneratedResume
} from "../Controllers/resumeGeneratorController.js";
import { auth } from "../Middleware/authMiddle.js";

const router = express.Router();

router.post("/generate", auth, generateResume);
router.post("/analyze-and-generate", auth, analyzeJobAndGenerateResume);
router.get("/history", auth, getGeneratedResumeHistory);
router.get("/:id", auth, getGeneratedResume);

export default router;
