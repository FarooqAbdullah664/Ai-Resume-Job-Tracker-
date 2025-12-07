import { generateResumeFromJD } from "../Utils/ResumeGenerator.js";

export const generateResume = async (req, res) => {
  try {
    const { jobDescription, userInfo } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    // Generate resume based on job description
    const generatedResume = await generateResumeFromJD(jobDescription, userInfo);

    res.json({
      success: true,
      resume: generatedResume
    });
  } catch (error) {
    console.error("Resume Generation Error:", error);
    res.status(500).json({ message: error.message || "Failed to generate resume" });
  }
};
