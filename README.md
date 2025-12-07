# 🚀 AI-Powered Resume Analyzer & Job Tracker

A full-stack web application that helps users analyze their resumes with AI, generate tailored resumes from job descriptions, and track job applications.

## ✨ Features

- 🔐 **User Authentication** - Secure login/register with JWT
- 📊 **Resume Analyzer** - AI-powered resume analysis with scoring
- 🤖 **Resume Generator** - Generate tailored resumes from job descriptions
- 🎯 **Job Tracker** - Track job applications with status management
- 📈 **Dashboard** - Statistics and analytics
- 💾 **Cloud Database** - MongoDB Atlas for data persistence

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- HTML5
- CSS3 (Modern responsive design)
- Vanilla JavaScript
- Fetch API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
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

### 4. Start Backend Server
```bash
npm start
```
Server will run on `http://localhost:5000`

### 5. Open Frontend
Open `Frontend/index.html` in your browser or use a local server.

## 📁 Project Structure

```
├── Backend/
│   ├── Controllers/       # Request handlers
│   ├── Models/           # Database schemas
│   ├── Routes/           # API routes
│   ├── Middleware/       # Auth middleware
│   ├── Utils/            # Helper functions
│   ├── .env              # Environment variables (not in git)
│   ├── .env.example      # Environment template
│   ├── server.js         # Entry point
│   └── package.json
│
├── Frontend/
│   ├── css/
│   │   └── style.css     # Styles
│   ├── js/
│   │   ├── auth.js       # Authentication
│   │   ├── resume.js     # Resume analyzer
│   │   ├── generator.js  # Resume generator
│   │   └── jobs.js       # Job tracker
│   ├── index.html        # Login/Register
│   ├── resume.html       # Resume analyzer
│   ├── generator.html    # Resume generator
│   └── Jobs.html         # Job tracker
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume/analyze` - Analyze resume
- `GET /api/resume` - Get resume history

### Resume Generator
- `POST /api/resume-generator/generate` - Generate resume from job description

### Jobs
- `POST /api/jobs` - Add new job
- `GET /api/jobs` - Get all jobs
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## 🎯 Usage

1. **Register/Login** - Create an account or login
2. **Analyze Resume** - Paste your resume and get AI feedback
3. **Generate Resume** - Paste job description to generate tailored resume
4. **Track Jobs** - Add and manage job applications

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- CORS enabled for API security

## 📝 License

MIT License

## 👨‍💻 Author

Farooq Abdullah

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!
