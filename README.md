# 🚀 AI-Powered Resume Analyzer & Job Tracker

A comprehensive full-stack web application that helps users analyze resumes with AI, generate tailored resumes from job descriptions, and track job applications efficiently.

## ✨ Features

### 🔐 User Authentication
- Secure registration and login system
- JWT-based authentication
- Password encryption with bcrypt

### 📊 Resume Analyzer
- **AI-powered resume analysis** with scoring (0-100)
- **ATS compatibility score** to pass Applicant Tracking Systems
- **Improvement suggestions** for better resume quality
- **Grammar and formatting fixes**
- **Analysis history** to track improvements over time

### 🤖 Resume Generator (NEW!)
- **Job Description Analysis**
  - Extracts required skills automatically
  - Identifies experience level needed
  - Detects education requirements
  - Shows job type (Remote/Hybrid/On-site)
  - Calculates match score
- **Tailored Resume Generation**
  - Creates customized resume for specific job
  - Includes all required skills from job description
  - Professional formatting
  - **Download as .txt file**
  - Copy to clipboard

### 🎯 Job Application Tracker
- **Add and manage job applications**
- **Track application status:**
  - Applied (Initial application)
  - Interviewing (Interview rounds)
  - Offered (Job offer received)
  - Rejected (Application rejected)
- **Add notes** for each application
- **Statistics dashboard** showing application counts
- **Filter by status**
- **Edit and delete** applications

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** (Mongoose) - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Axios** - HTTP client for AI API calls

### Frontend
- **HTML5** - Structure
- **CSS3** - Modern responsive design with gradients
- **Vanilla JavaScript** - Logic
- **Axios** - API communication
- **Fetch API** - Alternative HTTP client

### AI Integration
- Mock AI analyzer (can be replaced with Gemini API)
- Intelligent resume generation based on job requirements

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-resume-tracker.git
cd ai-resume-tracker
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `Backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_KEY=your_gemini_api_key (optional)
```

**Get MongoDB URI:**
1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Replace `<password>` with your database password

### 4. Start the Application
```bash
# From Backend directory
npm start
```

Server will run on `http://localhost:5000`

### 5. Access the Application
Open your browser and go to:
```
http://localhost:5000
```

## 📁 Project Structure

```
ai-resume-tracker/
├── Backend/
│   ├── Controllers/          # Request handlers
│   │   ├── authControllers.js
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   └── resumeGeneratorController.js
│   ├── Models/              # Database schemas
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── job.js
│   ├── Routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   └── resumeGeneratorRoutes.js
│   ├── Middleware/          # Auth middleware
│   │   └── authMiddle.js
│   ├── Utils/               # Helper functions
│   │   ├── Gemini.js
│   │   └── ResumeGenerator.js
│   ├── .env                 # Environment variables (not in git)
│   ├── .env.example         # Environment template
│   ├── server.js            # Entry point
│   └── package.json
│
├── Frontend Files (served by backend):
│   ├── index.html           # Login/Register page
│   ├── resume.html          # Resume Analyzer
│   ├── generator.html       # Resume Generator
│   ├── Jobs.html            # Job Tracker
│   ├── style.css            # Styles
│   ├── auth.js              # Authentication logic
│   ├── resume.js            # Resume analyzer logic
│   ├── generator.js         # Resume generator logic
│   └── jobs.js              # Job tracker logic
│
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Analyzer
- `POST /api/resume/analyze` - Analyze resume (requires auth)
- `GET /api/resume` - Get resume history (requires auth)

### Resume Generator
- `POST /api/resume-generator/generate` - Generate resume from job description
- `POST /api/resume-generator/analyze-and-generate` - Analyze job + generate resume

### Job Tracker
- `POST /api/jobs` - Add new job (requires auth)
- `GET /api/jobs` - Get all jobs (requires auth)
- `PUT /api/jobs/:id` - Update job (requires auth)
- `DELETE /api/jobs/:id` - Delete job (requires auth)

## 🎯 How to Use

### 1. Register/Login
- Create a new account or login with existing credentials
- JWT token will be stored in browser localStorage

### 2. Resume Analyzer
- Navigate to Resume Analyzer page
- Paste your resume text
- Click "Analyze Resume"
- View scores, suggestions, and improved version
- Check analysis history

### 3. Resume Generator
- Navigate to Resume Generator page
- Paste job description
- Add your personal info (optional)
- Click "Analyze & Generate Resume"
- View job analysis with match score
- Download or copy generated resume

### 4. Job Tracker
- Navigate to Job Tracker page
- Click "Add New Job"
- Fill in company, position, job description, status, and notes
- Track your applications
- Update status as you progress
- View statistics dashboard

## 🔒 Security Features

- Passwords hashed using bcrypt (10 rounds)
- JWT tokens for secure authentication
- Environment variables for sensitive data
- CORS enabled for API security
- Input validation on both frontend and backend

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Resumes Collection
```javascript
{
  userId: ObjectId,
  originalText: String,
  aiImprovedText: String,
  aiScore: Number,
  atsScore: Number,
  suggestions: Array,
  createdAt: Date
}
```

### Jobs Collection
```javascript
{
  userId: ObjectId,
  company: String,
  position: String,
  jobDescription: String,
  status: String (Applied/Interviewing/Offered/Rejected),
  notes: String,
  createdAt: Date
}
```

## 🎨 UI Features

- Modern gradient design (Purple theme)
- Fully responsive (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Interactive dashboard with statistics
- Professional color scheme
- Clean and intuitive interface

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Deploy

### Database
- MongoDB Atlas (already cloud-based)
- No additional setup needed

## 📝 License

MIT License - Feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

**Farooq Abdullah**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

## 📧 Contact

For any queries or suggestions, feel free to reach out!

---

**Note:** This project was created as a final assignment to demonstrate full-stack development skills including backend API development, database design, authentication, CRUD operations, and AI integration.
