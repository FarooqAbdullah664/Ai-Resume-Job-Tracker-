const API_URL = 'http://localhost:5000/api';

let isLogin = true;

const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const nameGroup = document.getElementById('nameGroup');
const authForm = document.getElementById('authForm');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'resume.html';
}

// Toggle between login and register
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to continue to your account';
        nameGroup.style.display = 'none';
        btnText.textContent = 'Sign In';
        toggleText.innerHTML = "Don't have an account? <a href='#' id='toggleLink'>Sign Up</a>";
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Sign up to get started';
        nameGroup.style.display = 'block';
        btnText.textContent = 'Sign Up';
        toggleText.innerHTML = "Already have an account? <a href='#' id='toggleLink'>Sign In</a>";
    }
    
    // Re-attach event listener to new toggle link
    document.getElementById('toggleLink').addEventListener('click', arguments.callee);
    
    // Clear messages
    hideMessages();
});

// Form submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation
    if (!email || !password) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (!isLogin && !name) {
        showError('Please enter your name');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    // Show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    hideMessages();
    
    try {
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const body = isLogin ? { email, password } : { name, email, password };
        
        console.log('🚀 Sending request to:', `${API_URL}${endpoint}`);
        console.log('📦 Request body:', body);
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        console.log('📡 Response status:', response.status);
        
        const data = await response.json();
        console.log('📥 Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        if (isLogin) {
            // Store token and redirect
            localStorage.setItem('token', data.token);
            console.log('✅ Token saved:', data.token);
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'resume.html';
            }, 1000);
        } else {
            // Show success and switch to login
            showSuccess('Account created! Please sign in.');
            console.log('✅ User registered successfully');
            setTimeout(() => {
                toggleLink.click();
                authForm.reset();
            }, 1500);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
}

function hideMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
}
