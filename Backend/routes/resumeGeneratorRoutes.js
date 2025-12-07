import express from "express";
import { generateResume } from "../Controllers/resumeGeneratorController.js";
import { auth } from "../Middleware/authMiddle.js";

const router = express.Router();

router.post("/generate", auth, generateResume);

export default router;
