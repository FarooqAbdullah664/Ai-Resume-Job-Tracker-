import axios from "axios";

export const analyzeResumeJobMatch = async (resumeText, jobDescription) => {
  try {
    // Try Gemini API first
    const prompt = `Analyze this resume against the job description and return ONLY valid JSON:

{
  "matchScore": 85,
  "atsScore": 78,
  "overallRating": "Excellent Match",
  "matchedSkills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["Docker", "AWS", "TypeScript"],
  "experienceMatch": {
    "required": "5+ years",
    "candidate": "6 years",
    "match": true
  },
  "educationMatch": {
    "required": "Bachelor's Degree",
    "candidate": "BS Computer Science",
    "match": true
  },
  "keyStrengths": [
    "Strong technical skills in required technologies",
    "Relevant work experience",
    "Good educational background"
  ],
  "improvements": [
    "Add Docker and containerization experience",
    "Include AWS cloud services knowledge",
    "Mention TypeScript proficiency"
  ],
  "atsOptimizations": [
    "Include more keywords from job description",
    "Add specific years of experience for each skill",
    "Use exact job title terminology"
  ],
  "recommendedChanges": {
    "addKeywords": ["Docker", "AWS", "TypeScript", "Microservices"],
    "emphasizeSkills": ["React", "Node.js", "JavaScript"],
    "improveSections": ["Technical Skills", "Professional Summary"]
  }
}

Job Description:
${jobDescription}

Resume:
${resumeText}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // Reduced to 10 seconds
      }
    );

    let aiText = response.data.candidates[0].content.parts[0].text;
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(aiText);

  } catch (error) {
    console.log("⚠️ Gemini API unavailable, using advanced mock analysis");
    
    // Advanced mock analysis
    return generateMockMatchAnalysis(resumeText, jobDescription);
  }
};

function generateMockMatchAnalysis(resumeText, jobDescription) {
  // Extract skills from job description
  const jobSkills = extractSkills(jobDescription);
  const resumeSkills = extractSkills(resumeText);
  
  // Find matched and missing skills
  const matchedSkills = jobSkills.filter(skill => 
    resumeSkills.some(rSkill => rSkill.toLowerCase().includes(skill.toLowerCase()))
  );
  const missingSkills = jobSkills.filter(skill => 
    !resumeSkills.some(rSkill => rSkill.toLowerCase().includes(skill.toLowerCase()))
  );
  
  // Calculate match score
  const skillMatchPercentage = jobSkills.length > 0 ? 
    (matchedSkills.length / jobSkills.length) * 100 : 0;
  
  // Experience analysis
  const jobExperience = extractExperience(jobDescription);
  const resumeExperience = extractExperience(resumeText);
  
  // Education analysis
  const jobEducation = extractEducation(jobDescription);
  const resumeEducation = extractEducation(resumeText);
  
  // Calculate overall match score
  let matchScore = Math.round(skillMatchPercentage * 0.6); // 60% weight for skills
  
  if (resumeExperience.years >= jobExperience.years) {
    matchScore += 20; // 20% for experience
  } else {
    matchScore += Math.round((resumeExperience.years / jobExperience.years) * 20);
  }
  
  if (resumeEducation.level >= jobEducation.level) {
    matchScore += 10; // 10% for education
  }
  
  // Additional factors
  if (resumeText.toLowerCase().includes('leadership')) matchScore += 5;
  if (resumeText.toLowerCase().includes('team')) matchScore += 3;
  if (resumeText.toLowerCase().includes('project')) matchScore += 2;
  
  matchScore = Math.min(matchScore, 100);
  
  // ATS Score (slightly lower than match score)
  const atsScore = Math.max(matchScore - 10, 0);
  
  // Generate rating
  let overallRating;
  if (matchScore >= 90) overallRating = "Excellent Match";
  else if (matchScore >= 80) overallRating = "Very Good Match";
  else if (matchScore >= 70) overallRating = "Good Match";
  else if (matchScore >= 60) overallRating = "Fair Match";
  else overallRating = "Poor Match";
  
  // Generate improvements
  const improvements = [];
  if (missingSkills.length > 0) {
    improvements.push(`Add experience with: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (resumeExperience.years < jobExperience.years) {
    improvements.push(`Highlight relevant experience to meet ${jobExperience.text} requirement`);
  }
  if (matchedSkills.length < jobSkills.length * 0.7) {
    improvements.push("Include more keywords from the job description");
  }
  improvements.push("Quantify achievements with specific numbers and percentages");
  improvements.push("Tailor professional summary to match job requirements");
  
  // ATS Optimizations
  const atsOptimizations = [
    "Use exact keywords from job description",
    "Include skill variations (e.g., 'JavaScript' and 'JS')",
    "Add years of experience for each major skill",
    "Use standard section headings (Experience, Education, Skills)",
    "Include both acronyms and full forms (e.g., 'API' and 'Application Programming Interface')"
  ];
  
  return {
    matchScore,
    atsScore,
    overallRating,
    matchedSkills: matchedSkills.slice(0, 8),
    missingSkills: missingSkills.slice(0, 5),
    experienceMatch: {
      required: jobExperience.text || "Not specified",
      candidate: resumeExperience.text || "Not clearly specified",
      match: resumeExperience.years >= jobExperience.years
    },
    educationMatch: {
      required: jobEducation.text || "Not specified",
      candidate: resumeEducation.text || "Not clearly specified", 
      match: resumeEducation.level >= jobEducation.level
    },
    keyStrengths: generateStrengths(matchedSkills, resumeExperience, resumeEducation),
    improvements: improvements.slice(0, 5),
    atsOptimizations: atsOptimizations.slice(0, 4),
    recommendedChanges: {
      addKeywords: missingSkills.slice(0, 6),
      emphasizeSkills: matchedSkills.slice(0, 4),
      improveSections: ["Professional Summary", "Technical Skills", "Work Experience"]
    }
  };
}

function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'MongoDB', 
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript',
    'Angular', 'Vue', 'Express', 'Django', 'Flask', 'Spring', 'REST API',
    'GraphQL', 'Redis', 'PostgreSQL', 'MySQL', 'Firebase', 'Azure', 'GCP',
    'Jenkins', 'CI/CD', 'Microservices', 'Agile', 'Scrum', 'TDD', 'Jest',
    'Webpack', 'Babel', 'Redux', 'Next.js', 'Tailwind', 'Bootstrap'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  const experienceMatch = text.match(/(\d+)\+?\s*years?/i);
  if (experienceMatch) {
    return {
      years: parseInt(experienceMatch[1]),
      text: experienceMatch[0]
    };
  }
  
  // Check for experience levels
  if (/senior|lead/i.test(text)) {
    return { years: 5, text: "Senior level (5+ years)" };
  }
  if (/junior|entry/i.test(text)) {
    return { years: 1, text: "Junior level (1-2 years)" };
  }
  
  return { years: 0, text: "Not specified" };
}

function extractEducation(text) {
  let level = 0;
  let educationText = "Not specified";
  
  if (/phd|doctorate/i.test(text)) {
    level = 4;
    educationText = "PhD/Doctorate";
  } else if (/master|ms|m\.s\.|mba/i.test(text)) {
    level = 3;
    educationText = "Master's Degree";
  } else if (/bachelor|bs|b\.s\.|be|b\.e\./i.test(text)) {
    level = 2;
    educationText = "Bachelor's Degree";
  } else if (/associate|diploma/i.test(text)) {
    level = 1;
    educationText = "Associate/Diploma";
  }
  
  return { level, text: educationText };
}

function generateStrengths(matchedSkills, experience, education) {
  const strengths = [];
  
  if (matchedSkills.length > 5) {
    strengths.push("Strong technical skill alignment with job requirements");
  }
  if (matchedSkills.length > 0) {
    strengths.push(`Proficient in key technologies: ${matchedSkills.slice(0, 3).join(', ')}`);
  }
  if (experience.years > 3) {
    strengths.push("Solid professional experience in the field");
  }
  if (education.level >= 2) {
    strengths.push("Good educational foundation");
  }
  
  strengths.push("Relevant background for the position");
  
  return strengths.slice(0, 4);
}