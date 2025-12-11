const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const matcherForm = document.getElementById('matcherForm');
const resumeText = document.getElementById('resumeText');
const jobDescription = document.getElementById('jobDescription');
const matchBtn = document.getElementById('matchBtn');
const matchBtnText = document.getElementById('matchBtnText');
const matchBtnLoader = document.getElementById('matchBtnLoader');
const resultsSection = document.getElementById('resultsSection');
const logoutBtn = document.getElementById('logoutBtn');

// Result elements
const matchScore = document.getElementById('matchScore');
const matchRating = document.getElementById('matchRating');
const atsScore = document.getElementById('atsScore');
const matchScoreFill = document.getElementById('matchScoreFill');
const atsScoreFill = document.getElementById('atsScoreFill');
const matchedSkills = document.getElementById('matchedSkills');
const missingSkills = document.getElementById('missingSkills');
const experienceStatus = document.getElementById('experienceStatus');
const experienceRequired = document.getElementById('experienceRequired');
const experienceCandidate = document.getElementById('experienceCandidate');
const educationStatus = document.getElementById('educationStatus');
const educationRequired = document.getElementById('educationRequired');
const educationCandidate = document.getElementById('educationCandidate');
const keyStrengths = document.getElementById('keyStrengths');
const improvements = document.getElementById('improvements');
const atsOptimizations = document.getElementById('atsOptimizations');
const addKeywords = document.getElementById('addKeywords');
const emphasizeSkills = document.getElementById('emphasizeSkills');
const improveSections = document.getElementById('improveSections');

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

// Load CV functionality
const loadCvBtn = document.getElementById('loadCvBtn');
loadCvBtn.addEventListener('click', loadUserCV);

async function loadUserCV() {
    try {
        loadCvBtn.disabled = true;
        loadCvBtn.innerHTML = '<span class="loader" style="width: 14px; height: 14px;"></span> Loading...';
        
        const response = await axios.get(`${API_URL}/cv/active`);
        
        if (response.data) {
            const cv = response.data;
            const resumeText = convertCVToText(cv);
            document.getElementById('resumeText').value = resumeText;
            
            // Show success feedback
            loadCvBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Loaded!';
            loadCvBtn.style.background = 'var(--success)';
            loadCvBtn.style.color = 'white';
            
            setTimeout(() => {
                loadCvBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> Load My CV';
                loadCvBtn.style.background = 'white';
                loadCvBtn.style.color = 'var(--primary)';
                loadCvBtn.disabled = false;
            }, 2000);
        }
        
    } catch (error) {
        console.error('Load CV Error:', error);
        
        if (error.response?.status === 404) {
            alert('No saved CV found. Please create a CV first using the CV Builder.');
        } else {
            alert('Failed to load CV. Please try again.');
        }
        
        loadCvBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> Load My CV';
        loadCvBtn.disabled = false;
    }
}

function convertCVToText(cv) {
    const { personalInfo, skills, experience, education } = cv;
    
    let resumeText = `${personalInfo.fullName}\n`;
    resumeText += `${personalInfo.email} | ${personalInfo.phone}`;
    
    if (personalInfo.location) {
        resumeText += ` | ${personalInfo.location}`;
    }
    if (personalInfo.linkedin) {
        resumeText += ` | ${personalInfo.linkedin}`;
    }
    
    resumeText += `\n\nPROFESSIONAL SUMMARY\n${personalInfo.summary}\n\n`;
    
    if (skills && skills.length > 0) {
        resumeText += `TECHNICAL SKILLS\n${skills.join(', ')}\n\n`;
    }
    
    if (experience && experience.length > 0) {
        resumeText += `PROFESSIONAL EXPERIENCE\n\n`;
        experience.forEach(exp => {
            resumeText += `${exp.title} | ${exp.company}\n`;
            resumeText += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
            resumeText += `${exp.description}\n\n`;
        });
    }
    
    if (education && education.length > 0) {
        resumeText += `EDUCATION\n\n`;
        education.forEach(edu => {
            resumeText += `${edu.degree}\n`;
            resumeText += `${edu.institution} | ${edu.year}`;
            if (edu.gpa) {
                resumeText += ` | GPA: ${edu.gpa}`;
            }
            resumeText += `\n\n`;
        });
    }
    
    return resumeText.trim();
}

// Match resume with job
matcherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const resume = resumeText.value.trim();
    const job = jobDescription.value.trim();
    
    if (!resume || !job) {
        alert('Please enter both resume and job description');
        return;
    }
    
    // Show loading
    matchBtn.disabled = true;
    matchBtn.classList.add('loading');
    matchBtnText.style.display = 'none';
    matchBtnLoader.style.display = 'block';
    
    // Hide previous results
    resultsSection.classList.remove('show');
    resultsSection.style.display = 'none';
    
    try {
        // Add timeout to frontend request
        const response = await axios.post(`${API_URL}/resume-match/match`, {
            resumeText: resume,
            jobDescription: job
        }, {
            timeout: 30000 // 30 seconds timeout
        });
        
        // Display results
        displayMatchResults(response.data.analysis);
        
        // Show results section with animation
        resultsSection.style.display = 'block';
        setTimeout(() => {
            resultsSection.classList.add('show');
            
            // Add success animation to match overview
            const matchOverview = document.querySelector('.match-overview');
            matchOverview.classList.add('analysis-complete');
            
            // Add success checkmark after delay
            setTimeout(() => {
                matchOverview.classList.add('analysis-success');
            }, 1500);
            
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Analysis failed';
        alert('Error: ' + errorMsg);
        console.error(error);
    } finally {
        matchBtn.disabled = false;
        matchBtn.classList.remove('loading');
        matchBtnText.style.display = 'flex';
        matchBtnLoader.style.display = 'none';
    }
});

function displayMatchResults(analysis) {
    // Match scores with animation
    animateScore(matchScore, analysis.matchScore || 0);
    animateScore(atsScore, analysis.atsScore || 0);
    
    // Match rating
    matchRating.textContent = analysis.overallRating || 'No Rating';
    
    // Animate score bars
    setTimeout(() => {
        matchScoreFill.style.width = `${analysis.matchScore || 0}%`;
        atsScoreFill.style.width = `${analysis.atsScore || 0}%`;
    }, 500);
    
    // Skills analysis
    displaySkills(matchedSkills, analysis.matchedSkills || [], 'matched');
    displaySkills(missingSkills, analysis.missingSkills || [], 'missing');
    
    // Experience analysis
    if (analysis.experienceMatch) {
        experienceStatus.textContent = analysis.experienceMatch.match ? '✅ Match' : '❌ Gap';
        experienceStatus.className = `requirement-status ${analysis.experienceMatch.match ? 'match' : 'gap'}`;
        experienceRequired.textContent = analysis.experienceMatch.required;
        experienceCandidate.textContent = analysis.experienceMatch.candidate;
    }
    
    // Education analysis
    if (analysis.educationMatch) {
        educationStatus.textContent = analysis.educationMatch.match ? '✅ Match' : '❌ Gap';
        educationStatus.className = `requirement-status ${analysis.educationMatch.match ? 'match' : 'gap'}`;
        educationRequired.textContent = analysis.educationMatch.required;
        educationCandidate.textContent = analysis.educationMatch.candidate;
    }
    
    // Key strengths
    displayList(keyStrengths, analysis.keyStrengths || []);
    
    // Improvements
    displayList(improvements, analysis.improvements || []);
    
    // ATS optimizations
    displayList(atsOptimizations, analysis.atsOptimizations || []);
    
    // Recommended changes
    if (analysis.recommendedChanges) {
        displayKeywords(addKeywords, analysis.recommendedChanges.addKeywords || []);
        displayKeywords(emphasizeSkills, analysis.recommendedChanges.emphasizeSkills || []);
        displaySections(improveSections, analysis.recommendedChanges.improveSections || []);
    }
}

function animateScore(element, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 40; // 40 steps
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore);
    }, 50);
}

function displaySkills(container, skills, type) {
    container.innerHTML = '';
    
    if (skills.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-skills';
        emptyMsg.textContent = type === 'matched' ? 'No matched skills found' : 'No missing skills';
        container.appendChild(emptyMsg);
        return;
    }
    
    skills.forEach((skill, index) => {
        setTimeout(() => {
            const skillTag = document.createElement('span');
            skillTag.className = `skill-tag ${type}`;
            skillTag.textContent = skill;
            skillTag.style.opacity = '0';
            skillTag.style.transform = 'translateY(10px)';
            container.appendChild(skillTag);
            
            // Animate in
            setTimeout(() => {
                skillTag.style.transition = 'all 0.3s ease';
                skillTag.style.opacity = '1';
                skillTag.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

function displayList(container, items) {
    container.innerHTML = '';
    
    if (items.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'empty-item';
        emptyMsg.textContent = 'No items to display';
        container.appendChild(emptyMsg);
        return;
    }
    
    items.forEach((item, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            container.appendChild(li);
            
            // Animate in
            setTimeout(() => {
                li.style.transition = 'all 0.3s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, 50);
        }, index * 150);
    });
}

function displayKeywords(container, keywords) {
    container.innerHTML = '';
    
    if (keywords.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-keywords';
        emptyMsg.textContent = 'No keywords to add';
        container.appendChild(emptyMsg);
        return;
    }
    
    keywords.forEach((keyword, index) => {
        setTimeout(() => {
            const keywordTag = document.createElement('span');
            keywordTag.className = 'keyword-tag';
            keywordTag.textContent = keyword;
            keywordTag.style.opacity = '0';
            keywordTag.style.transform = 'scale(0.8)';
            container.appendChild(keywordTag);
            
            // Animate in
            setTimeout(() => {
                keywordTag.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                keywordTag.style.opacity = '1';
                keywordTag.style.transform = 'scale(1)';
            }, 50);
        }, index * 80);
    });
}

function displaySections(container, sections) {
    container.innerHTML = '';
    
    if (sections.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-sections';
        emptyMsg.textContent = 'No sections to improve';
        container.appendChild(emptyMsg);
        return;
    }
    
    sections.forEach((section, index) => {
        setTimeout(() => {
            const sectionTag = document.createElement('span');
            sectionTag.className = 'section-tag';
            sectionTag.textContent = section;
            sectionTag.style.opacity = '0';
            sectionTag.style.transform = 'translateY(10px)';
            container.appendChild(sectionTag);
            
            // Animate in
            setTimeout(() => {
                sectionTag.style.transition = 'all 0.3s ease';
                sectionTag.style.opacity = '1';
                sectionTag.style.transform = 'translateY(0)';
            }, 50);
        }, index * 120);
    });
}

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
});