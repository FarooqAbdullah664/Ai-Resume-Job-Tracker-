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

export const analyzeJobAndGenerateResume = async (req, res) => {
  try {
    const { jobDescription, userInfo } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    // Analyze job description
    const analysis = analyzeJobDescription(jobDescription);

    // Generate tailored resume
    const generatedResume = await generateResumeFromJD(jobDescription, userInfo);

    res.json({
      success: true,
      analysis: analysis,
      resume: generatedResume,
      fileName: `Resume_${userInfo?.name?.replace(/\s+/g, '_') || 'Generated'}_${Date.now()}.txt`
    });
  } catch (error) {
    console.error("Job Analysis Error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze job and generate resume" });
  }
};

function analyzeJobDescription(jd) {
  const analysis = {
    requiredSkills: [],
    experienceLevel: '',
    educationRequired: '',
    jobType: '',
    keyResponsibilities: [],
    matchScore: 0
  };

  // Extract skills
  const skillKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'MongoDB', 
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript',
    'Angular', 'Vue', 'Express', 'Django', 'Flask', 'Spring', 'REST API',
    'GraphQL', 'Redis', 'PostgreSQL', 'MySQL', 'Firebase', 'Azure', 'GCP'
  ];

  skillKeywords.forEach(skill => {
    if (jd.toLowerCase().includes(skill.toLowerCase())) {
      analysis.requiredSkills.push(skill);
    }
  });

  // Extract experience level
  if (/(\d+)\+?\s*years?/i.test(jd)) {
    const match = jd.match(/(\d+)\+?\s*years?/i);
    analysis.experienceLevel = match[1] + '+ years required';
  } else if (/entry.level|junior|fresher/i.test(jd)) {
    analysis.experienceLevel = 'Entry Level / Junior';
  } else if (/senior|lead/i.test(jd)) {
    analysis.experienceLevel = 'Senior Level';
  }

  // Extract education
  if (/bachelor|bs|b\.s\.|undergraduate/i.test(jd)) {
    analysis.educationRequired = "Bachelor's Degree";
  }
  if (/master|ms|m\.s\.|graduate/i.test(jd)) {
    analysis.educationRequired = "Master's Degree";
  }

  // Job type
  if (/remote/i.test(jd)) {
    analysis.jobType = 'Remote';
  } else if (/hybrid/i.test(jd)) {
    analysis.jobType = 'Hybrid';
  } else if (/on.site|onsite/i.test(jd)) {
    analysis.jobType = 'On-site';
  }

  // Key responsibilities
  const responsibilityPatterns = [
    /develop|build|create|design|implement/i,
    /maintain|manage|support/i,
    /collaborate|work with|team/i,
    /test|debug|troubleshoot/i,
    /document|write|prepare/i
  ];

  responsibilityPatterns.forEach(pattern => {
    if (pattern.test(jd)) {
      const match = jd.match(new RegExp(`[^.!?]*${pattern.source}[^.!?]*[.!?]`, 'i'));
      if (match) {
        analysis.keyResponsibilities.push(match[0].trim());
      }
    }
  });

  // Calculate match score (basic)
  analysis.matchScore = Math.min(
    (analysis.requiredSkills.length * 10) + 
    (analysis.experienceLevel ? 20 : 0) + 
    (analysis.educationRequired ? 10 : 0),
    100
  );

  return analysis;
}
