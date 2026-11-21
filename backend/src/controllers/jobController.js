const Job = require("../models/Job");

exports.listJobs = async (req, res, next) => {
  try {
    const { search, category, location, type } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = new RegExp(category, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (type) filter.type = type;
    if (search) {
      filter.$or = ["title", "company", "description", "skills"].map(field => ({
        [field]: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      }));
    }
    const jobs = await Job.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ count: jobs.length, jobs });
  } catch (error) { next(error); }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name");
    if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) { next(error); }
};

exports.createJob = async (req, res, next) => {
  try {
    const { title, company, location, description } = req.body;
    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Title, company, location and description are required" });
    }
    const job = await Job.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ message: "Job created", job });
  } catch (error) { next(error); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own jobs" });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json({ message: "Job updated", job });
  } catch (error) { next(error); }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }
    job.isActive = false;
    await job.save();
    res.json({ message: "Job closed" });
  } catch (error) { next(error); }
};
