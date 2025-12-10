const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const resumeForm = document.getElementById('resumeForm');
const resumeText = document.getElementById('resumeText');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const analyzeBtnLoader = document.getElementById('analyzeBtnLoader');
const resultsSection = document.getElementById('resultsSection');
const resumeScore = document.getElementById('resumeScore');
const atsScore = document.getElementById('atsScore');
const resumeScoreFill = document.getElementById('resumeScoreFill');
const atsScoreFill = document.getElementById('atsScoreFill');
const suggestionsList = document.getElementById('suggestionsList');
const improvedContent = document.getElementById('improvedContent');
const historyList = document.getElementById('historyList');
const logoutBtn = document.getElementById('logoutBtn');
const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Analyze resume with Axios
resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = resumeText.value.trim();
    
    if (!text) {
        alert('Please enter your resume text');
        return;
    }
    
    // Show loading with enhanced animation
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('loading');
    analyzeBtnText.style.display = 'none';
    analyzeBtnLoader.style.display = 'block';
    
    // Hide previous results
    resultsSection.classList.remove('show');
    
    try {
        const response = await axios.post(`${API_URL}/resume/analyze`, {
            resumeText: text
        });
        
        // Display results
        displayResults(response.data);
        
        // Refresh history
        loadHistory();
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Analysis failed';
        alert('Error: ' + errorMsg);
        console.error(error);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('loading');
        analyzeBtnText.style.display = 'flex';
        analyzeBtnLoader.style.display = 'none';
    }
});

function displayResults(data) {
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('show');
    
    // Add success animation to the card
    const resultsCard = resultsSection.querySelector('.card');
    resultsCard.classList.add('analysis-complete');
    
    // Add success checkmark after a delay
    setTimeout(() => {
        resultsCard.classList.add('analysis-success');
    }, 1000);
    
    // Reset score displays first
    resumeScore.textContent = '0';
    atsScore.textContent = '0';
    resumeScoreFill.style.width = '0%';
    atsScoreFill.style.width = '0%';
    
    // Animate score counting
    setTimeout(() => {
        animateScore(resumeScore, data.aiScore || 0);
        animateScore(atsScore, data.atsScore || 0);
        
        // Animate score bars
        resumeScoreFill.style.width = `${data.aiScore || 0}%`;
        atsScoreFill.style.width = `${data.atsScore || 0}%`;
    }, 300);
    
    // Display suggestions with staggered animation
    suggestionsList.innerHTML = '';
    if (data.suggestions && data.suggestions.length > 0) {
        data.suggestions.forEach((suggestion, index) => {
            setTimeout(() => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                li.style.opacity = '0';
                li.style.transform = 'translateX(-20px)';
                suggestionsList.appendChild(li);
                
                // Animate in
                setTimeout(() => {
                    li.style.transition = 'all 0.3s ease';
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No suggestions available';
        suggestionsList.appendChild(li);
    }
    
    // Display improved text with typing effect
    improvedContent.textContent = '';
    const text = data.aiImprovedText || 'No improved version available';
    typeWriter(improvedContent, text, 20);
}

// Score counting animation
function animateScore(element, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 30; // 30 steps
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore);
    }, 50);
}

// Typewriter effect for improved content
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
}

// Load history with Axios
async function loadHistory() {
    try {
        console.log('Loading history...');
        
        const response = await axios.get(`${API_URL}/resume`);
        
        console.log('History data:', response.data);
        
        if (response.data.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">No analysis history yet. Analyze your first resume!</p>';
            return;
        }
        
        historyList.innerHTML = '';
        response.data.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-header">
                    <div class="history-scores">
                        <div class="history-score">
                            Resume: <strong>${item.aiScore || 0}</strong>
                        </div>
                        <div class="history-score">
                            ATS: <strong>${item.atsScore || 0}</strong>
                        </div>
                    </div>
                    <div class="history-date">${new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="history-preview">${item.originalText.substring(0, 100)}...</div>
            `;
            
            historyItem.addEventListener('click', () => {
                displayResults(item);
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            });
            
            historyList.appendChild(historyItem);
        });
        
    } catch (error) {
        console.error('Error loading history:', error);
        if (error.response?.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        } else {
            historyList.innerHTML = '<p style="text-align: center; color: var(--danger); padding: 40px;">Failed to load history. Please try again.</p>';
        }
    }
}

// Refresh history button
refreshHistoryBtn.addEventListener('click', loadHistory);

// Load history on page load
loadHistory();
