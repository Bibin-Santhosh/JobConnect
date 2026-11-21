const Application = require("../models/Application");
const Job = require("../models/Job");

exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, isActive: true });
    if (!job) return res.status(404).json({ message: "Active job not found" });
    if (job.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot apply to your own job" });
    }
    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || ""
    });
    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You already applied to this job" });
    next(error);
  }
};

exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job").sort({ createdAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (error) { next(error); }
};

exports.jobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to view these applications" });
    }
    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email").sort({ createdAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (error) { next(error); }
};
