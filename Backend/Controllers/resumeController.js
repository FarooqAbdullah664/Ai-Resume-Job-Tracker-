import Resume from "../Models/Resume.js";
import { analyzeResumeAI } from "../Utils/Gemini.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const ai = await analyzeResumeAI(resumeText);

    let aiText = ai.candidates[0].content.parts[0].text;
    
    // Remove markdown code blocks if present
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(aiText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("AI Response:", aiText);
      
      // Fallback: create a basic result
      result = {
        score: 70,
        atsScore: 65,
        suggestions: ["Unable to parse AI response. Please try again."],
        corrected: resumeText
      };
    }

    const saved = await Resume.create({
      userId: req.user.id,
      originalText: resumeText,
      aiImprovedText: result.corrected || result.improvedText || resumeText,
      aiScore: result.score || 70,
      atsScore: result.atsScore || 65,
      suggestions: result.suggestions || []
    });

    res.json(saved);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze resume" });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const data = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
