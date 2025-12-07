import axios from "axios";

export const analyzeResumeAI = async (resumeText) => {
  // Try Gemini API first, if fails use mock analysis
  try {
    const prompt = `Analyze this resume and return ONLY valid JSON with this structure:
{
  "score": 85,
  "atsScore": 78,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "corrected": "improved resume text"
}

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
        timeout: 10000
      }
    );

    return response.data;
    
  } catch (error) {
    console.log("⚠️ Gemini API unavailable, using mock analysis");
    
    // Mock AI analysis - works without API
    const words = resumeText.split(/\s+/).length;
    const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
    const hasPhone = /\d{10}/.test(resumeText);
    const hasExperience = /experience|work|job|position/i.test(resumeText);
    const hasSkills = /skills|technologies|tools/i.test(resumeText);
    const hasEducation = /education|degree|university|college/i.test(resumeText);
    
    let score = 50;
    if (words > 100) score += 10;
    if (words > 200) score += 10;
    if (hasEmail) score += 5;
    if (hasPhone) score += 5;
    if (hasExperience) score += 10;
    if (hasSkills) score += 5;
    if (hasEducation) score += 5;
    
    const suggestions = [];
    if (!hasEmail) suggestions.push("Add your email address for contact");
    if (!hasPhone) suggestions.push("Include your phone number");
    if (!hasExperience) suggestions.push("Add detailed work experience with achievements");
    if (!hasSkills) suggestions.push("List your technical skills and competencies");
    if (!hasEducation) suggestions.push("Include your educational background");
    if (words < 150) suggestions.push("Expand your resume with more details and achievements");
    suggestions.push("Use action verbs to describe your accomplishments");
    suggestions.push("Quantify achievements with numbers and percentages");
    suggestions.push("Tailor your resume to match job descriptions");
    
    const improvedText = resumeText
      .replace(/\n\n+/g, '\n\n')
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
      .trim();
    
    return {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              score: Math.min(score, 95),
              atsScore: Math.min(score - 5, 90),
              suggestions: suggestions.slice(0, 5),
              corrected: improvedText || resumeText
            })
          }]
        }
      }]
    };
  }
};
