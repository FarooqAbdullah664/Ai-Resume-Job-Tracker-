import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: String,
    linkedin: String,
    summary: { type: String, required: true }
  },
  skills: [{
    type: String
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,
    description: { type: String, required: true }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
    gpa: String
  }],
  cvHtml: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
cvSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.model("CV", cvSchema);