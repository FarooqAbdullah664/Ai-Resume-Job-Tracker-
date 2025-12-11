const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Configure Axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const logoutBtn = document.getElementById('logoutBtn');
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const jobForm = document.getElementById('jobForm');
const modalTitle = document.getElementById('modalTitle');
const saveJobBtn = document.getElementById('saveJobBtn');
const saveBtnText = document.getElementById('saveBtnText');
const saveBtnLoader = document.getElementById('saveBtnLoader');
const jobsTableBody = document.getElementById('jobsTableBody');
const statusFilter = document.getElementById('statusFilter');

// Stats elements
const appliedCount = document.getElementById('appliedCount');
const interviewingCount = document.getElementById('interviewingCount');
const offeredCount = document.getElementById('offeredCount');
const rejectedCount = document.getElementById('rejectedCount');

let currentEditId = null;
let allJobs = [];

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

// Open modal for adding job
addJobBtn.addEventListener('click', () => {
    currentEditId = null;
    modalTitle.textContent = 'Add New Job';
    saveBtnText.textContent = 'Save Job';
    jobForm.reset();
    jobModal.classList.add('show');
});

// Close modal
closeModal.addEventListener('click', () => {
    jobModal.classList.remove('show');
});

cancelBtn.addEventListener('click', () => {
    jobModal.classList.remove('show');
});

// Close modal on outside click
jobModal.addEventListener('click', (e) => {
    if (e.target === jobModal) {
        jobModal.classList.remove('show');
    }
});

// Submit job form with Axios
jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;
    
    // Show loading
    saveJobBtn.disabled = true;
    saveBtnText.style.display = 'none';
    saveBtnLoader.style.display = 'block';
    
    try {
        const jobData = {
            company,
            position,
            jobDescription,
            status,
            notes
        };
        
        if (currentEditId) {
            // Update existing job
            await axios.put(`${API_URL}/jobs/${currentEditId}`, jobData);
        } else {
            // Create new job
            await axios.post(`${API_URL}/jobs`, jobData);
        }
        
        // Close modal and reload jobs
        jobModal.classList.remove('show');
        loadJobs();
        
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to save job';
        alert('Error: ' + errorMsg);
        console.error(error);
    } finally {
        saveJobBtn.disabled = false;
        saveBtnText.style.display = 'block';
        saveBtnLoader.style.display = 'none';
    }
});

// Load all jobs with Axios
async function loadJobs() {
    try {
        console.log('Loading jobs...');
        
        const response = await axios.get(`${API_URL}/jobs`);
        
        allJobs = response.data;
        console.log('Jobs data:', allJobs);
        
        // Update stats
        updateStats(allJobs);
        
        // Display jobs
        displayJobs(allJobs);
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        if (error.response?.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        } else {
            jobsTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="6">
                        <div class="empty-message">
                            <p style="color: var(--danger);">Failed to load jobs. Please try again.</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

// Update statistics
function updateStats(jobs) {
    const stats = {
        Applied: 0,
        Interviewing: 0,
        Offered: 0,
        Rejected: 0
    };
    
    jobs.forEach(job => {
        if (stats.hasOwnProperty(job.status)) {
            stats[job.status]++;
        }
    });
    
    appliedCount.textContent = stats.Applied;
    interviewingCount.textContent = stats.Interviewing;
    offeredCount.textContent = stats.Offered;
    rejectedCount.textContent = stats.Rejected;
}

// Display jobs in table
function displayJobs(jobs) {
    if (jobs.length === 0) {
        jobsTableBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">
                    <div class="empty-message">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <p>No job applications yet</p>
                        <button class="btn-secondary" onclick="document.getElementById('addJobBtn').click()">Add Your First Job</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    jobsTableBody.innerHTML = '';
    
    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${job.company}</strong></td>
            <td>${job.position}</td>
            <td><span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span></td>
            <td>${new Date(job.createdAt).toLocaleDateString()}</td>
            <td>${job.notes ? job.notes.substring(0, 50) + (job.notes.length > 50 ? '...' : '') : '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit" onclick="editJob('${job._id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteJob('${job._id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        jobsTableBody.appendChild(row);
    });
}

// Edit job
window.editJob = async (id) => {
    const job = allJobs.find(j => j._id === id);
    if (!job) return;
    
    currentEditId = id;
    modalTitle.textContent = 'Edit Job';
    saveBtnText.textContent = 'Update Job';
    
    document.getElementById('company').value = job.company;
    document.getElementById('position').value = job.position;
    document.getElementById('jobDescription').value = job.jobDescription || '';
    document.getElementById('status').value = job.status;
    document.getElementById('notes').value = job.notes || '';
    
    jobModal.classList.add('show');
};

// Delete job with Axios
window.deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job application?')) {
        return;
    }
    
    try {
        await axios.delete(`${API_URL}/jobs/${id}`);
        loadJobs();
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to delete job';
        alert('Error: ' + errorMsg);
        console.error(error);
    }
};

// Filter jobs by status
statusFilter.addEventListener('change', (e) => {
    const filterValue = e.target.value;
    
    if (filterValue === 'all') {
        displayJobs(allJobs);
    } else {
        const filtered = allJobs.filter(job => job.status === filterValue);
        displayJobs(filtered);
    }
});

// Load jobs on page load
loadJobs();
