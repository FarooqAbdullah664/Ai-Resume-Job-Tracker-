import express from "express";
import { generateResume, analyzeJobAndGenerateResume } from "../Controllers/resumeGeneratorController.js";
import { auth } from "../Middleware/authMiddle.js";

const router = express.Router();

router.post("/generate", auth, generateResume);
router.post("/analyze-and-generate", auth, analyzeJobAndGenerateResume);

export default router;
