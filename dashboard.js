const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// DOM Elements
// userName element removed
const logoutBtn = document.getElementById('logoutBtn');
const refreshActivityBtn = document.getElementById('refreshActivityBtn');

// Stat elements
const resumeAnalysesCount = document.getElementById('resumeAnalysesCount');
const jobApplicationsCount = document.getElementById('jobApplicationsCount');
const jobMatchesCount = document.getElementById('jobMatchesCount');
const avgResumeScore = document.getElementById('avgResumeScore');

// Job status elements
const appliedJobsCount = document.getElementById('appliedJobsCount');
const interviewingJobsCount = document.getElementById('interviewingJobsCount');
const offeredJobsCount = document.getElementById('offeredJobsCount');
const rejectedJobsCount = document.getElementById('rejectedJobsCount');

// Resume performance elements
const latestResumeScore = document.getElementById('latestResumeScore');
const latestAtsScore = document.getElementById('latestAtsScore');
const latestResumeScoreFill = document.getElementById('latestResumeScoreFill');
const latestAtsScoreFill = document.getElementById('latestAtsScoreFill');
const scoreImprovement = document.getElementById('scoreImprovement');

// Activity and matches
const recentActivityList = document.getElementById('recentActivityList');
const topSkillsList = document.getElementById('topSkillsList');
const recentMatchesList = document.getElementById('recentMatchesList');

// Dashboard data
let dashboardData = {
    stats: {},
    recentActivity: [],
    jobStats: {},
    resumePerformance: {},
    topSkills: [],
    recentMatches: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

// Refresh activity
refreshActivityBtn.addEventListener('click', () => {
    loadDashboardData();
});

// User name functionality removed - using simple "Welcome!" message

// Load all dashboard data
async function loadDashboardData() {
    try {
        showLoadingState();
        
        // Load data from all APIs
        const [resumeData, jobData, matchData, cvData, generatedData] = await Promise.allSettled([
            loadResumeData(),
            loadJobData(), 
            loadMatchData(),
            loadCVData(),
            loadGeneratedResumeData()
        ]);

        // Process and display data
        processResumeData(resumeData.status === 'fulfilled' ? resumeData.value : []);
        processJobData(jobData.status === 'fulfilled' ? jobData.value : []);
        processMatchData(matchData.status === 'fulfilled' ? matchData.value : []);
        processCVData(cvData.status === 'fulfilled' ? cvData.value : null);
        processGeneratedResumeData(generatedData.status === 'fulfilled' ? generatedData.value : []);
        
        // Update UI
        updateStatsDisplay();
        updateJobStatusDisplay();
        updateResumePerformanceDisplay();
        updateRecentActivityDisplay();
        updateTopSkillsDisplay();
        updateRecentMatchesDisplay();
        updatePerformanceMetrics();
        
        hideLoadingState();
        
    } catch (error) {
        console.error('Dashboard Load Error:', error);
        hideLoadingState();
    }
}

// Load resume analyses
async function loadResumeData() {
    try {
        const response = await axios.get(`${API_URL}/resume`);
        return response.data;
    } catch (error) {
        console.error('Resume data error:', error);
        return [];
    }
}

// Load job applications
async function loadJobData() {
    try {
        const response = await axios.get(`${API_URL}/jobs`);
        return response.data;
    } catch (error) {
        console.error('Job data error:', error);
        return [];
    }
}

// Load job matches
async function loadMatchData() {
    try {
        const response = await axios.get(`${API_URL}/resume-match/history`);
        return response.data;
    } catch (error) {
        console.error('Match data error:', error);
        return [];
    }
}

// Load CV data
async function loadCVData() {
    try {
        const response = await axios.get(`${API_URL}/cv/list`);
        return response.data;
    } catch (error) {
        console.error('CV data error:', error);
        return [];
    }
}

// Load generated resume data
async function loadGeneratedResumeData() {
    try {
        const response = await axios.get(`${API_URL}/resume-generator/history`);
        return response.data;
    } catch (error) {
        console.error('Generated resume data error:', error);
        return [];
    }
}

// Process resume data
function processResumeData(resumes) {
    dashboardData.stats.resumeAnalyses = resumes.length;
    
    if (resumes.length > 0) {
        // Calculate average score
        const totalScore = resumes.reduce((sum, resume) => sum + (resume.aiScore || 0), 0);
        dashboardData.stats.avgScore = Math.round(totalScore / resumes.length);
        
        // Latest resume performance
        const latest = resumes[0];
        dashboardData.resumePerformance = {
            latestScore: latest.aiScore || 0,
            latestAtsScore: latest.atsScore || 0,
            improvement: resumes.length > 1 ? 
                (latest.aiScore || 0) - (resumes[1].aiScore || 0) : 0
        };
        
        // Add to recent activity
        resumes.slice(0, 3).forEach(resume => {
            dashboardData.recentActivity.push({
                type: 'resume',
                title: 'Resume Analyzed',
                description: `Score: ${resume.aiScore}/100`,
                time: resume.createdAt,
                icon: '📊'
            });
        });
    }
}

// Process job data
function processJobData(jobs) {
    dashboardData.stats.jobApplications = jobs.length;
    
    // Count by status
    const statusCounts = {
        Applied: 0,
        Interviewing: 0,
        Offered: 0,
        Rejected: 0
    };
    
    jobs.forEach(job => {
        if (statusCounts.hasOwnProperty(job.status)) {
            statusCounts[job.status]++;
        }
    });
    
    dashboardData.jobStats = statusCounts;
    
    // Add recent jobs to activity
    jobs.slice(0, 3).forEach(job => {
        dashboardData.recentActivity.push({
            type: 'job',
            title: `Applied to ${job.company}`,
            description: job.position,
            time: job.createdAt,
            icon: '💼'
        });
    });
}

// Process match data
function processMatchData(matches) {
    dashboardData.stats.jobMatches = matches.length;
    dashboardData.recentMatches = matches.slice(0, 5);
    
    // Add to recent activity
    matches.slice(0, 2).forEach(match => {
        dashboardData.recentActivity.push({
            type: 'match',
            title: 'Job Match Analysis',
            description: `${match.matchScore}% match`,
            time: match.createdAt,
            icon: '🎯'
        });
    });
}

// Process CV data
function processCVData(cvs) {
    dashboardData.stats.savedCVs = cvs.length;
    
    if (cvs.length > 0) {
        // Get active CV for skills
        const activeCV = cvs.find(cv => cv.isActive) || cvs[0];
        if (activeCV && activeCV.skills) {
            dashboardData.topSkills = activeCV.skills.slice(0, 10);
        }
        
        // Add recent CVs to activity
        cvs.slice(0, 2).forEach(cv => {
            dashboardData.recentActivity.push({
                type: 'cv',
                title: 'CV Created',
                description: cv.personalInfo?.jobTitle || 'Professional CV',
                time: cv.createdAt,
                icon: '📄'
            });
        });
    }
}

// Process generated resume data
function processGeneratedResumeData(resumes) {
    dashboardData.stats.generatedResumes = resumes.length;
    
    // Add to recent activity
    resumes.slice(0, 2).forEach(resume => {
        dashboardData.recentActivity.push({
            type: 'generated',
            title: 'Resume Generated',
            description: `Match Score: ${resume.analysis?.matchScore || 'N/A'}%`,
            time: resume.createdAt,
            icon: '🤖'
        });
    });
}

// Update stats display
function updateStatsDisplay() {
    const stats = dashboardData.stats;
    
    animateCounter(resumeAnalysesCount, stats.resumeAnalyses || 0);
    animateCounter(jobApplicationsCount, stats.jobApplications || 0);
    animateCounter(jobMatchesCount, stats.jobMatches || 0);
    animateCounter(avgResumeScore, stats.avgScore || 0);
    
    // Update action card stats
    document.getElementById('resumeAnalysesCountCard').textContent = stats.resumeAnalyses || 0;
    document.getElementById('jobApplicationsCountCard').textContent = stats.jobApplications || 0;
    document.getElementById('jobMatchesCountCard').textContent = stats.jobMatches || 0;
    
    // Update generated resumes and CVs count (will be implemented)
    document.getElementById('generatedResumesCountCard').textContent = stats.generatedResumes || 0;
    document.getElementById('savedCVsCountCard').textContent = stats.savedCVs || 0;
}

// Update job status display
function updateJobStatusDisplay() {
    const jobStats = dashboardData.jobStats;
    
    appliedJobsCount.textContent = jobStats.Applied || 0;
    interviewingJobsCount.textContent = jobStats.Interviewing || 0;
    offeredJobsCount.textContent = jobStats.Offered || 0;
    rejectedJobsCount.textContent = jobStats.Rejected || 0;
}

// Update resume performance display
function updateResumePerformanceDisplay() {
    const performance = dashboardData.resumePerformance;
    
    if (performance.latestScore !== undefined) {
        latestResumeScore.textContent = performance.latestScore;
        latestAtsScore.textContent = performance.latestAtsScore;
        
        // Animate progress bars
        setTimeout(() => {
            latestResumeScoreFill.style.width = `${performance.latestScore}%`;
            latestAtsScoreFill.style.width = `${performance.latestAtsScore}%`;
        }, 500);
        
        // Show improvement
        const improvement = performance.improvement;
        if (improvement > 0) {
            scoreImprovement.textContent = `+${improvement}`;
            scoreImprovement.className = 'metric-value improvement positive';
        } else if (improvement < 0) {
            scoreImprovement.textContent = improvement;
            scoreImprovement.className = 'metric-value improvement negative';
        } else {
            scoreImprovement.textContent = '0';
            scoreImprovement.className = 'metric-value improvement';
        }
    }
}

// Update recent activity display
function updateRecentActivityDisplay() {
    const activities = dashboardData.recentActivity
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);
    
    if (activities.length === 0) {
        recentActivityList.innerHTML = `
            <div class="activity-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    recentActivityList.innerHTML = '';
    activities.forEach((activity, index) => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.style.animationDelay = `${index * 0.1}s`;
        activityItem.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatTimeAgo(activity.time)}</div>
            </div>
        `;
        recentActivityList.appendChild(activityItem);
    });
}

// Update top skills display
function updateTopSkillsDisplay() {
    const skills = dashboardData.topSkills;
    
    if (skills.length === 0) {
        topSkillsList.innerHTML = `
            <div class="skills-placeholder">
                <p>Build a CV to see your skills</p>
                <button class="btn-primary btn-small" onclick="window.location.href='cv-builder.html'">
                    Build CV
                </button>
            </div>
        `;
        return;
    }
    
    topSkillsList.innerHTML = '';
    skills.forEach((skill, index) => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag-dashboard';
        skillTag.textContent = skill;
        skillTag.style.animationDelay = `${index * 0.1}s`;
        topSkillsList.appendChild(skillTag);
    });
}

// Update recent matches display
function updateRecentMatchesDisplay() {
    const matches = dashboardData.recentMatches;
    
    if (matches.length === 0) {
        recentMatchesList.innerHTML = `
            <div class="matches-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
                    <path d="M9 11H1l6-6v4a7.98 7.98 0 0 1 10 2M15 13h8l-6 6v-4a7.98 7.98 0 0 0-10-2"/>
                </svg>
                <p>No job matches yet</p>
            </div>
        `;
        return;
    }
    
    recentMatchesList.innerHTML = '';
    matches.forEach((match, index) => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.style.animationDelay = `${index * 0.1}s`;
        matchItem.innerHTML = `
            <div class="match-score">${match.matchScore}%</div>
            <div class="match-content">
                <div class="match-title">Job Match Analysis</div>
                <div class="match-description">${match.jobPreview || 'Job analysis completed'}</div>
                <div class="match-time">${formatTimeAgo(match.createdAt)}</div>
            </div>
        `;
        recentMatchesList.appendChild(matchItem);
    });
}

// Utility functions
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 50);
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

function showLoadingState() {
    // Add loading class to dashboard
    document.querySelector('.main-container').classList.add('loading');
}

function hideLoadingState() {
    // Remove loading class
    document.querySelector('.main-container').classList.remove('loading');
}

// Update performance metrics
function updatePerformanceMetrics() {
    const jobStats = dashboardData.jobStats;
    const totalJobs = Object.values(jobStats).reduce((sum, count) => sum + count, 0);
    
    // Calculate success rate (Offered / Total)
    const successRate = totalJobs > 0 ? Math.round((jobStats.Offered / totalJobs) * 100) : 0;
    document.getElementById('successRateValue').textContent = `${successRate}%`;
    
    // Calculate average match score
    const matches = dashboardData.recentMatches;
    const avgMatchScore = matches.length > 0 ? 
        Math.round(matches.reduce((sum, match) => sum + (match.matchScore || 0), 0) / matches.length) : 0;
    document.getElementById('avgMatchScoreValue').textContent = `${avgMatchScore}%`;
}/
/ Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
    }
});
// Debu
g function to check localStorage
function debugLocalStorage() {
    console.log('=== LocalStorage Debug ===');
    console.log('Token:', localStorage.getItem('token'));
    console.log('UserName:', localStorage.getItem('userName'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('========================');
}

// Call debug on page load
document.addEventListener('DOMContentLoaded', () => {
    debugLocalStorage();
    loadDashboardData();
    setUserName();
});