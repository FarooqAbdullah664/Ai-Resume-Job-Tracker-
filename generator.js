const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const generatorForm = document.getElementById('generatorForm');
const jobDescription = document.getElementById('jobDescription');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const generateBtn = document.getElementById('generateBtn');
const generateBtnText = document.getElementById('generateBtnText');
const generateBtnLoader = document.getElementById('generateBtnLoader');
const generatedResume = document.getElementById('generatedResume');
const analysisCard = document.getElementById('analysisCard');
const matchScore = document.getElementById('matchScore');
const matchScoreFill = document.getElementById('matchScoreFill');
const analysisDetails = document.getElementById('analysisDetails');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentFileName = '';
let currentResumeText = '';

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Generate resume with job analysis
generatorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const jd = jobDescription.value.trim();
    
    if (!jd) {
        alert('Please enter a job description');
        return;
    }
    
    // Show loading
    generateBtn.disabled = true;
    generateBtnText.style.display = 'none';
    generateBtnLoader.style.display = 'block';
    generatedResume.innerHTML = '<div style="text-align: center; color: var(--primary);">Analyzing job and generating resume...</div>';
    copyBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    analysisCard.style.display = 'none';
    
    try {
        const response = await axios.post(`${API_URL}/resume-generator/analyze-and-generate`, {
            jobDescription: jd,
            userInfo: {
                name: userName.value.trim() || 'Your Name',
                email: userEmail.value.trim() || 'your.email@example.com',
                phone: userPhone.value.trim() || '+1 (234) 567-8900'
            }
        });
        
        // Display job analysis
        displayAnalysis(response.data.analysis);
        
        // Display generated resume
        currentResumeText = response.data.resume;
        currentFileName = response.data.fileName;
        generatedResume.textContent = currentResumeText;
        generatedResume.style.display = 'block';
        generatedResume.style.justifyContent = 'flex-start';
        generatedResume.style.alignItems = 'flex-start';
        copyBtn.style.display = 'inline-flex';
        downloadBtn.style.display = 'inline-flex';
        
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Generation failed';
        alert('Error: ' + errorMsg);
        console.error(error);
        generatedResume.innerHTML = '<div style="text-align: center; color: var(--danger);">Failed to generate resume. Please try again.</div>';
    } finally {
        generateBtn.disabled = false;
        generateBtnText.style.display = 'flex';
        generateBtnLoader.style.display = 'none';
    }
});

// Display job analysis
function displayAnalysis(analysis) {
    analysisCard.style.display = 'block';
    
    // Update match score
    matchScore.textContent = analysis.matchScore || 0;
    setTimeout(() => {
        matchScoreFill.style.width = `${analysis.matchScore || 0}%`;
    }, 100);
    
    // Display analysis details
    let detailsHTML = '<div style="display: grid; gap: 20px;">';
    
    if (analysis.requiredSkills && analysis.requiredSkills.length > 0) {
        detailsHTML += `
            <div>
                <h4 style="margin-bottom: 10px; color: var(--dark);">🎯 Required Skills</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${analysis.requiredSkills.map(skill => 
                        `<span style="background: var(--primary); color: white; padding: 6px 12px; border-radius: 20px; font-size: 13px;">${skill}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    if (analysis.experienceLevel) {
        detailsHTML += `
            <div>
                <h4 style="margin-bottom: 10px; color: var(--dark);">💼 Experience Level</h4>
                <p style="background: var(--light); padding: 12px; border-radius: 8px;">${analysis.experienceLevel}</p>
            </div>
        `;
    }
    
    if (analysis.educationRequired) {
        detailsHTML += `
            <div>
                <h4 style="margin-bottom: 10px; color: var(--dark);">🎓 Education Required</h4>
                <p style="background: var(--light); padding: 12px; border-radius: 8px;">${analysis.educationRequired}</p>
            </div>
        `;
    }
    
    if (analysis.jobType) {
        detailsHTML += `
            <div>
                <h4 style="margin-bottom: 10px; color: var(--dark);">📍 Job Type</h4>
                <p style="background: var(--light); padding: 12px; border-radius: 8px;">${analysis.jobType}</p>
            </div>
        `;
    }
    
    if (analysis.keyResponsibilities && analysis.keyResponsibilities.length > 0) {
        detailsHTML += `
            <div>
                <h4 style="margin-bottom: 10px; color: var(--dark);">📋 Key Responsibilities</h4>
                <ul style="background: var(--light); padding: 20px; border-radius: 8px; margin: 0;">
                    ${analysis.keyResponsibilities.slice(0, 3).map(resp => 
                        `<li style="margin-bottom: 8px;">${resp}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }
    
    detailsHTML += '</div>';
    analysisDetails.innerHTML = detailsHTML;
}

// Copy resume to clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentResumeText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        copyBtn.style.background = 'var(--success)';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = 'var(--success)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'white';
            copyBtn.style.color = 'var(--primary)';
            copyBtn.style.borderColor = 'var(--primary)';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy resume');
        console.error(err);
    });
});

// Download resume as text file
downloadBtn.addEventListener('click', () => {
    try {
        if (!currentResumeText) {
            alert('No resume to download. Please generate a resume first.');
            return;
        }
        
        // Create blob with UTF-8 encoding
        const blob = new Blob([currentResumeText], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = currentFileName || `Resume_${Date.now()}.txt`;
        
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
        
        // Show success feedback
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Downloaded!';
        downloadBtn.style.background = 'var(--success)';
        downloadBtn.style.color = 'white';
        downloadBtn.style.borderColor = 'var(--success)';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.background = 'white';
            downloadBtn.style.color = 'var(--primary)';
            downloadBtn.style.borderColor = 'var(--primary)';
        }, 2000);
        
        console.log('✅ Resume downloaded successfully!');
        
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download resume. Please try copying the text instead.');
    }
});
