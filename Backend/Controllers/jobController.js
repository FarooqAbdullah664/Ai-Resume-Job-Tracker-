import Job from "../Models/job.js";

export const addJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, userId: req.user.id });
    res.json(job);
  } catch (error) {
    console.error("Add Job Error:", error);
    res.status(500).json({ message: "Failed to add job" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
