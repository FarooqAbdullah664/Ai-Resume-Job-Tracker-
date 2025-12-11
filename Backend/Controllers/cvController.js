import CV from "../Models/CV.js";

// Save CV
export const saveCV = async (req, res) => {
  try {
    const { cvData, cvHtml } = req.body;

    if (!cvData || !cvHtml) {
      return res.status(400).json({ 
        message: "CV data and HTML are required" 
      });
    }

    // Validate required fields
    const { personalInfo, skills, experience, education } = cvData;
    
    if (!personalInfo.fullName || !personalInfo.jobTitle || !personalInfo.email || 
        !personalInfo.phone || !personalInfo.summary) {
      return res.status(400).json({ 
        message: "All personal information fields are required" 
      });
    }

    if (!experience || experience.length === 0) {
      return res.status(400).json({ 
        message: "At least one work experience is required" 
      });
    }

    if (!education || education.length === 0) {
      return res.status(400).json({ 
        message: "At least one education entry is required" 
      });
    }

    // Deactivate previous CVs for this user
    await CV.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    // Save new CV
    const savedCV = await CV.create({
      userId: req.user.id,
      personalInfo,
      skills: skills || [],
      experience,
      education,
      cvHtml,
      isActive: true
    });

    res.json({
      success: true,
      message: "CV saved successfully",
      cvId: savedCV._id
    });

  } catch (error) {
    console.error("Save CV Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to save CV" 
    });
  }
};

// Get user's CVs
export const getUserCVs = async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('personalInfo.fullName personalInfo.jobTitle isActive createdAt updatedAt');

    res.json(cvs);
  } catch (error) {
    console.error("Get CVs Error:", error);
    res.status(500).json({ message: "Failed to fetch CVs" });
  }
};

// Get active CV
export const getActiveCV = async (req, res) => {
  try {
    const activeCV = await CV.findOne({ 
      userId: req.user.id, 
      isActive: true 
    });

    if (!activeCV) {
      return res.status(404).json({ message: "No active CV found" });
    }

    res.json(activeCV);
  } catch (error) {
    console.error("Get Active CV Error:", error);
    res.status(500).json({ message: "Failed to fetch active CV" });
  }
};

// Get specific CV
export const getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json(cv);
  } catch (error) {
    console.error("Get CV Error:", error);
    res.status(500).json({ message: "Failed to fetch CV" });
  }
};

// Delete CV
export const deleteCV = async (req, res) => {
  try {
    const deletedCV = await CV.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!deletedCV) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error("Delete CV Error:", error);
    res.status(500).json({ message: "Failed to delete CV" });
  }
};