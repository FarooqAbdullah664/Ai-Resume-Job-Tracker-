const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const generatorForm = document.getElementById('generatorForm');
const jobDescription = document.getElementById('jobDescription');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const generateBtn = document.getElementById('generateBtn');
const generateBtnText = document.getElementById('generateBtnText');
const generateBtnLoader = document.getElementById('generateBtnLoader');
const generatedResume = document.getElementById('generatedResume');
const copyBtn = document.getElementById('copyBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Generate resume
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
    generatedResume.innerHTML = '<div style="text-align: center; color: var(--primary);">Generating your resume...</div>';
    copyBtn.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/resume-generator/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                jobDescription: jd,
                userInfo: {
                    name: userName.value.trim(),
                    email: userEmail.value.trim(),
                    phone: userPhone.value.trim()
                }
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Generation failed');
        }
        
        const data = await response.json();
        
        // Display generated resume
        generatedResume.textContent = data.resume;
        generatedResume.style.display = 'block';
        generatedResume.style.justifyContent = 'flex-start';
        generatedResume.style.alignItems = 'flex-start';
        copyBtn.style.display = 'inline-flex';
        
    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
        generatedResume.innerHTML = '<div style="text-align: center; color: var(--danger);">Failed to generate resume. Please try again.</div>';
    } finally {
        generateBtn.disabled = false;
        generateBtnText.style.display = 'flex';
        generateBtnLoader.style.display = 'none';
    }
});

// Copy resume to clipboard
copyBtn.addEventListener('click', () => {
    const resumeText = generatedResume.textContent;
    
    navigator.clipboard.writeText(resumeText).then(() => {
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
