const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// DOM Elements
const cvForm = document.getElementById('cvForm');
const skillInput = document.getElementById('skillInput');
const skillsList = document.getElementById('skillsList');
const addExperienceBtn = document.getElementById('addExperienceBtn');
const addEducationBtn = document.getElementById('addEducationBtn');
const experienceList = document.getElementById('experienceList');
const educationList = document.getElementById('educationList');
const generateCvBtn = document.getElementById('generateCvBtn');
const generateCvBtnText = document.getElementById('generateCvBtnText');
const generateCvBtnLoader = document.getElementById('generateCvBtnLoader');
const cvPreview = document.getElementById('cvPreview');
const downloadCvBtn = document.getElementById('downloadCvBtn');
const saveCvBtn = document.getElementById('saveCvBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Data storage
let cvData = {
    skills: [],
    experience: [],
    education: []
};

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

// Skills management
skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSkill();
    }
});

function addSkill() {
    const skill = skillInput.value.trim();
    if (skill && !cvData.skills.includes(skill)) {
        cvData.skills.push(skill);
        renderSkills();
        skillInput.value = '';
    }
}

function removeSkill(skill) {
    cvData.skills = cvData.skills.filter(s => s !== skill);
    renderSkills();
}

function renderSkills() {
    skillsList.innerHTML = '';
    cvData.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" onclick="removeSkill('${skill}')" class="skill-remove">×</button>
        `;
        skillsList.appendChild(skillTag);
    });
}

// Experience management
addExperienceBtn.addEventListener('click', addExperience);

function addExperience() {
    const experienceId = Date.now();
    const experienceHtml = `
        <div class="experience-item" data-id="${experienceId}">
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" class="exp-title" placeholder="Senior Software Engineer" required>
                </div>
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" class="exp-company" placeholder="Tech Corp" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date *</label>
                    <input type="month" class="exp-start" required>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" class="exp-end" placeholder="Leave empty if current">
                </div>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea class="exp-description" rows="3" placeholder="• Developed web applications using React and Node.js&#10;• Led a team of 5 developers&#10;• Improved performance by 40%" required></textarea>
            </div>
            <button type="button" class="btn-danger btn-small" onclick="removeExperience(${experienceId})">Remove</button>
        </div>
    `;
    experienceList.insertAdjacentHTML('beforeend', experienceHtml);
}

function removeExperience(id) {
    const experienceItem = document.querySelector(`[data-id="${id}"]`);
    if (experienceItem) {
        experienceItem.remove();
    }
}

// Education management
addEducationBtn.addEventListener('click', addEducation);

function addEducation() {
    const educationId = Date.now();
    const educationHtml = `
        <div class="education-item" data-id="${educationId}">
            <div class="form-row">
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" class="edu-degree" placeholder="Bachelor of Science in Computer Science" required>
                </div>
                <div class="form-group">
                    <label>Institution *</label>
                    <input type="text" class="edu-institution" placeholder="University of Technology" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Graduation Year *</label>
                    <input type="number" class="edu-year" placeholder="2020" min="1950" max="2030" required>
                </div>
                <div class="form-group">
                    <label>GPA (Optional)</label>
                    <input type="text" class="edu-gpa" placeholder="3.8/4.0">
                </div>
            </div>
            <button type="button" class="btn-danger btn-small" onclick="removeEducation(${educationId})">Remove</button>
        </div>
    `;
    educationList.insertAdjacentHTML('beforeend', educationHtml);
}

function removeEducation(id) {
    const educationItem = document.querySelector(`[data-id="${id}"]`);
    if (educationItem) {
        educationItem.remove();
    }
}

// Generate CV
generateCvBtn.addEventListener('click', generateCV);

function generateCV() {
    // Collect form data
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    // Show loading
    generateCvBtn.disabled = true;
    generateCvBtnText.style.display = 'none';
    generateCvBtnLoader.style.display = 'block';
    
    // Generate CV preview
    setTimeout(() => {
        const cvHtml = generateCVHTML(formData);
        cvPreview.innerHTML = cvHtml;
        
        // Show action buttons
        downloadCvBtn.style.display = 'inline-flex';
        saveCvBtn.style.display = 'inline-flex';
        
        // Hide loading
        generateCvBtn.disabled = false;
        generateCvBtnText.style.display = 'flex';
        generateCvBtnLoader.style.display = 'none';
        
        // Scroll to preview
        cvPreview.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

function collectFormData() {
    // Personal info
    const personalInfo = {
        fullName: document.getElementById('fullName').value.trim(),
        jobTitle: document.getElementById('jobTitle').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        summary: document.getElementById('summary').value.trim()
    };
    
    // Experience
    const experience = [];
    document.querySelectorAll('.experience-item').forEach(item => {
        const exp = {
            title: item.querySelector('.exp-title').value.trim(),
            company: item.querySelector('.exp-company').value.trim(),
            startDate: item.querySelector('.exp-start').value,
            endDate: item.querySelector('.exp-end').value || 'Present',
            description: item.querySelector('.exp-description').value.trim()
        };
        if (exp.title && exp.company && exp.description) {
            experience.push(exp);
        }
    });
    
    // Education
    const education = [];
    document.querySelectorAll('.education-item').forEach(item => {
        const edu = {
            degree: item.querySelector('.edu-degree').value.trim(),
            institution: item.querySelector('.edu-institution').value.trim(),
            year: item.querySelector('.edu-year').value,
            gpa: item.querySelector('.edu-gpa').value.trim()
        };
        if (edu.degree && edu.institution && edu.year) {
            education.push(edu);
        }
    });
    
    return {
        personalInfo,
        skills: cvData.skills,
        experience,
        education
    };
}

function validateFormData(data) {
    const { personalInfo, experience, education } = data;
    
    if (!personalInfo.fullName || !personalInfo.jobTitle || !personalInfo.email || !personalInfo.phone || !personalInfo.summary) {
        alert('Please fill all required personal information fields');
        return false;
    }
    
    if (experience.length === 0) {
        alert('Please add at least one work experience');
        return false;
    }
    
    if (education.length === 0) {
        alert('Please add at least one education entry');
        return false;
    }
    
    return true;
}

function generateCVHTML(data) {
    const { personalInfo, skills, experience, education } = data;
    
    return `
        <div class="professional-cv">
            <!-- Header -->
            <div class="cv-header">
                <div class="cv-name">${personalInfo.fullName}</div>
                <div class="cv-title">${personalInfo.jobTitle}</div>
                <div class="cv-contact">
                    <span>${personalInfo.email}</span>
                    <span>${personalInfo.phone}</span>
                    ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
                    ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
                </div>
            </div>
            
            <!-- Professional Summary -->
            <div class="cv-section">
                <div class="cv-section-title">PROFESSIONAL SUMMARY</div>
                <div class="cv-section-content">
                    <p>${personalInfo.summary}</p>
                </div>
            </div>
            
            <!-- Technical Skills -->
            ${skills.length > 0 ? `
            <div class="cv-section">
                <div class="cv-section-title">TECHNICAL SKILLS</div>
                <div class="cv-section-content">
                    <div class="cv-skills">${skills.join(' • ')}</div>
                </div>
            </div>
            ` : ''}
            
            <!-- Professional Experience -->
            <div class="cv-section">
                <div class="cv-section-title">PROFESSIONAL EXPERIENCE</div>
                <div class="cv-section-content">
                    ${experience.map(exp => `
                        <div class="cv-experience-item">
                            <div class="cv-exp-header">
                                <div class="cv-exp-title">${exp.title}</div>
                                <div class="cv-exp-date">${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</div>
                            </div>
                            <div class="cv-exp-company">${exp.company}</div>
                            <div class="cv-exp-description">
                                ${exp.description.split('\n').map(line => line.trim()).filter(line => line).map(line => `<div class="cv-bullet">${line.replace(/^[•\-\*]\s*/, '')}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Education -->
            <div class="cv-section">
                <div class="cv-section-title">EDUCATION</div>
                <div class="cv-section-content">
                    ${education.map(edu => `
                        <div class="cv-education-item">
                            <div class="cv-edu-header">
                                <div class="cv-edu-degree">${edu.degree}</div>
                                <div class="cv-edu-year">${edu.year}</div>
                            </div>
                            <div class="cv-edu-institution">${edu.institution}</div>
                            ${edu.gpa ? `<div class="cv-edu-gpa">GPA: ${edu.gpa}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    if (dateStr === 'Present' || !dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// Download CV
downloadCvBtn.addEventListener('click', downloadCV);

function downloadCV() {
    const cvContent = cvPreview.innerHTML;
    const personalInfo = collectFormData().personalInfo;
    const fileName = `CV_${personalInfo.fullName.replace(/\s+/g, '_')}_${Date.now()}.html`;
    
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${personalInfo.fullName} - CV</title>
    <style>
        ${getCVStyles()}
    </style>
</head>
<body>
    ${cvContent}
</body>
</html>
    `;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success feedback
    const originalText = downloadCvBtn.innerHTML;
    downloadCvBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Downloaded!';
    downloadCvBtn.style.background = 'var(--success)';
    downloadCvBtn.style.color = 'white';
    
    setTimeout(() => {
        downloadCvBtn.innerHTML = originalText;
        downloadCvBtn.style.background = 'white';
        downloadCvBtn.style.color = 'var(--primary)';
    }, 2000);
}

// Save CV to database
saveCvBtn.addEventListener('click', saveCV);

async function saveCV() {
    const formData = collectFormData();
    
    try {
        saveCvBtn.disabled = true;
        const originalText = saveCvBtn.innerHTML;
        saveCvBtn.innerHTML = '<span class="loader" style="width: 16px; height: 16px;"></span> Saving...';
        
        const response = await axios.post(`${API_URL}/cv/save`, {
            cvData: formData,
            cvHtml: cvPreview.innerHTML
        });
        
        // Show success
        saveCvBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved!';
        saveCvBtn.style.background = 'var(--success)';
        saveCvBtn.style.color = 'white';
        
        setTimeout(() => {
            saveCvBtn.innerHTML = originalText;
            saveCvBtn.style.background = 'white';
            saveCvBtn.style.color = 'var(--primary)';
            saveCvBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Save CV Error:', error);
        alert('Failed to save CV. Please try again.');
        saveCvBtn.disabled = false;
    }
}

function getCVStyles() {
    return `
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: white; }
        .professional-cv { max-width: 800px; margin: 0 auto; background: white; }
        .cv-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .cv-name { font-size: 32px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .cv-title { font-size: 18px; color: #666; margin-bottom: 15px; }
        .cv-contact { font-size: 14px; color: #666; }
        .cv-contact span { margin: 0 10px; }
        .cv-section { margin-bottom: 25px; }
        .cv-section-title { font-size: 16px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; }
        .cv-section-content p { margin: 0; line-height: 1.6; color: #444; }
        .cv-skills { line-height: 1.8; color: #444; }
        .cv-experience-item { margin-bottom: 20px; }
        .cv-exp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .cv-exp-title { font-weight: bold; font-size: 16px; color: #333; }
        .cv-exp-date { font-size: 14px; color: #666; }
        .cv-exp-company { font-size: 14px; color: #666; margin-bottom: 8px; }
        .cv-bullet { margin-bottom: 3px; color: #444; }
        .cv-bullet:before { content: "• "; color: #666; }
        .cv-education-item { margin-bottom: 15px; }
        .cv-edu-header { display: flex; justify-content: space-between; align-items: center; }
        .cv-edu-degree { font-weight: bold; color: #333; }
        .cv-edu-year { color: #666; }
        .cv-edu-institution { color: #666; font-size: 14px; }
        .cv-edu-gpa { color: #666; font-size: 14px; }
    `;
}

// Add initial experience and education
addExperience();
addEducation();