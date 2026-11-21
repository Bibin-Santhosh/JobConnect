const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"], default: "Full-time" },
  category: { type: String, trim: true, default: "Other" },
  description: { type: String, required: true },
  salary: { type: String, default: "Not disclosed" },
  skills: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
