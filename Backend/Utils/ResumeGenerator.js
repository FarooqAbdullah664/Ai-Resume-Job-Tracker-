export const generateResumeFromJD = async (jobDescription, userInfo = {}) => {
  try {
    // Extract key requirements from job description
    const requirements = extractRequirements(jobDescription);
    
    // Generate tailored resume
    const resume = buildResume(requirements, userInfo);
    
    return resume;
  } catch (error) {
    console.error("Resume generation error:", error);
    throw error;
  }
};

function extractRequirements(jd) {
  const requirements = {
    skills: [],
    experience: '',
    education: '',
    responsibilities: []
  };

  // Extract skills (common tech keywords)
  const skillKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'MongoDB', 
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript',
    'Angular', 'Vue', 'Express', 'Django', 'Flask', 'Spring', 'REST API',
    'GraphQL', 'Redis', 'PostgreSQL', 'MySQL', 'Firebase', 'Azure', 'GCP'
  ];

  skillKeywords.forEach(skill => {
    if (jd.toLowerCase().includes(skill.toLowerCase())) {
      requirements.skills.push(skill);
    }
  });

  // Extract experience level
  if (/(\d+)\+?\s*years?/i.test(jd)) {
    const match = jd.match(/(\d+)\+?\s*years?/i);
    requirements.experience = match[1] + '+ years';
  }

  // Extract education
  if (/bachelor|bs|b\.s\.|undergraduate/i.test(jd)) {
    requirements.education = "Bachelor's Degree";
  }
  if (/master|ms|m\.s\.|graduate/i.test(jd)) {
    requirements.education = "Master's Degree";
  }

  return requirements;
}

function buildResume(requirements, userInfo) {
  const name = userInfo.name || 'Your Name';
  const email = userInfo.email || 'your.email@example.com';
  const phone = userInfo.phone || '+1 (234) 567-8900';
  
  let resume = `${name}
${email} | ${phone}

PROFESSIONAL SUMMARY
Results-driven software professional with ${requirements.experience || '3+ years'} of experience in full-stack development. Proven expertise in building scalable applications and delivering high-quality solutions.

TECHNICAL SKILLS
`;

  // Add skills
  if (requirements.skills.length > 0) {
    resume += requirements.skills.join(', ');
  } else {
    resume += 'JavaScript, React, Node.js, MongoDB, Express, HTML, CSS, Git';
  }

  resume += `

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Company
2021 - Present
• Developed and maintained full-stack web applications using modern technologies
• Collaborated with cross-functional teams to deliver projects on time
• Implemented best practices for code quality and performance optimization
• Mentored junior developers and conducted code reviews
• Reduced application load time by 40% through optimization techniques

Software Engineer | Previous Company
2019 - 2021
• Built responsive web applications using ${requirements.skills.slice(0, 3).join(', ') || 'React and Node.js'}
• Designed and implemented RESTful APIs for mobile and web clients
• Worked in Agile environment with 2-week sprint cycles
• Participated in architecture decisions and technical planning
• Improved test coverage from 60% to 90%

EDUCATION
${requirements.education || "Bachelor's Degree in Computer Science"}
University Name | Graduated 2019

ACHIEVEMENTS
• Successfully delivered 15+ projects with 100% client satisfaction
• Recognized as "Employee of the Quarter" for outstanding performance
• Published technical articles on Medium with 10K+ views
• Active contributor to open-source projects on GitHub

CERTIFICATIONS
• AWS Certified Developer - Associate
• MongoDB Certified Developer
`;

  return resume;
}
