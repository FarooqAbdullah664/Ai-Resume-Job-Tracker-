const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

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

// Analyze resume
resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = resumeText.value.trim();
    
    if (!text) {
        alert('Please enter your resume text');
        return;
    }
    
    // Show loading
    analyzeBtn.disabled = true;
    analyzeBtnText.style.display = 'none';
    analyzeBtnLoader.style.display = 'block';
    
    try {
        const response = await fetch(`${API_URL}/resume/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ resumeText: text })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Analysis failed');
        }
        
        const data = await response.json();
        
        // Display results
        displayResults(data);
        
        // Refresh history
        loadHistory();
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtnText.style.display = 'flex';
        analyzeBtnLoader.style.display = 'none';
    }
});

function displayResults(data) {
    // Show results section
    resultsSection.style.display = 'block';
    
    // Update scores
    resumeScore.textContent = data.aiScore || 0;
    atsScore.textContent = data.atsScore || 0;
    
    // Animate score bars
    setTimeout(() => {
        resumeScoreFill.style.width = `${data.aiScore || 0}%`;
        atsScoreFill.style.width = `${data.atsScore || 0}%`;
    }, 100);
    
    // Display suggestions
    suggestionsList.innerHTML = '';
    if (data.suggestions && data.suggestions.length > 0) {
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
    } else {
        suggestionsList.innerHTML = '<li>No suggestions available</li>';
    }
    
    // Display improved text
    improvedContent.textContent = data.aiImprovedText || 'No improved version available';
}

// Load history
async function loadHistory() {
    try {
        console.log('Loading history with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch(`${API_URL}/resume`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('History response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                window.location.href = 'index.html';
                return;
            }
            throw new Error('Failed to load history');
        }
        
        const history = await response.json();
        console.log('History data:', history);
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">No analysis history yet. Analyze your first resume!</p>';
            return;
        }
        
        historyList.innerHTML = '';
        history.forEach(item => {
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
        historyList.innerHTML = '<p style="text-align: center; color: var(--danger); padding: 40px;">Failed to load history. Please try again.</p>';
    }
}

// Refresh history button
refreshHistoryBtn.addEventListener('click', loadHistory);

// Load history on page load
loadHistory();
