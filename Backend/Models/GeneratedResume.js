import mongoose from "mongoose";

const generatedResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  userInfo: {
    name: String,
    email: String,
    phone: String
  },
  analysis: {
    requiredSkills: [String],
    experienceLevel: String,
    educationRequired: String,
    jobType: String,
    keyResponsibilities: [String],
    matchScore: Number
  },
  generatedResume: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("GeneratedResume", generatedResumeSchema);