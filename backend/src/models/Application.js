const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, maxlength: 5000, default: "" },
  status: { type: String, enum: ["applied", "reviewing", "shortlisted", "rejected", "selected"], default: "applied" }
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
