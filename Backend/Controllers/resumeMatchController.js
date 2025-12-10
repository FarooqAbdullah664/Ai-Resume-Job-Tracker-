import { analyzeResumeJobMatch } from "../Utils/ResumeJobMatcher.js";
import ResumeMatch from "../Models/ResumeMatch.js";

export const matchResumeWithJob = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        message: "Both resume text and job description are required" 
      });
    }

    // Analyze resume vs job match
    const matchAnalysis = await analyzeResumeJobMatch(resumeText, jobDescription);

    // Save to database
    const savedMatch = await ResumeMatch.create({
      userId: req.user.id,
      resumeText,
      jobDescription,
      matchScore: matchAnalysis.matchScore || 0,
      atsScore: matchAnalysis.atsScore || 0,
      overallRating: matchAnalysis.overallRating || 'No Rating',
      matchedSkills: matchAnalysis.matchedSkills || [],
      missingSkills: matchAnalysis.missingSkills || [],
      experienceMatch: matchAnalysis.experienceMatch || {},
      educationMatch: matchAnalysis.educationMatch || {},
      keyStrengths: matchAnalysis.keyStrengths || [],
      improvements: matchAnalysis.improvements || [],
      atsOptimizations: matchAnalysis.atsOptimizations || [],
      recommendedChanges: matchAnalysis.recommendedChanges || {}
    });

    res.json({
      success: true,
      analysis: matchAnalysis,
      savedId: savedMatch._id
    });

  } catch (error) {
    console.error("Resume-Job Match Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to analyze resume-job match" 
    });
  }
};

// Get match history
export const getMatchHistory = async (req, res) => {
  try {
    const matches = await ResumeMatch.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('matchScore atsScore overallRating createdAt resumeText jobDescription')
      .limit(20);

    // Truncate text for preview
    const matchHistory = matches.map(match => ({
      ...match.toObject(),
      resumePreview: match.resumeText.substring(0, 100) + '...',
      jobPreview: match.jobDescription.substring(0, 100) + '...'
    }));

    res.json(matchHistory);
  } catch (error) {
    console.error("Get Match History Error:", error);
    res.status(500).json({ message: "Failed to fetch match history" });
  }
};

// Get specific match details
export const getMatchDetails = async (req, res) => {
  try {
    const match = await ResumeMatch.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    console.error("Get Match Details Error:", error);
    res.status(500).json({ message: "Failed to fetch match details" });
  }
};