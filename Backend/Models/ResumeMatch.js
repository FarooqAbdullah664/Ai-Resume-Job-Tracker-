import mongoose from "mongoose";

const resumeMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    default: 0
  },
  atsScore: {
    type: Number,
    default: 0
  },
  overallRating: {
    type: String,
    default: 'No Rating'
  },
  matchedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  experienceMatch: {
    required: String,
    candidate: String,
    match: Boolean
  },
  educationMatch: {
    required: String,
    candidate: String,
    match: Boolean
  },
  keyStrengths: [{
    type: String
  }],
  improvements: [{
    type: String
  }],
  atsOptimizations: [{
    type: String
  }],
  recommendedChanges: {
    addKeywords: [String],
    emphasizeSkills: [String],
    improveSections: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ResumeMatch", resumeMatchSchema);