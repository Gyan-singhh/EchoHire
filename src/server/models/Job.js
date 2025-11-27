import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import Question from "./Question.js";
import User from "./User.js";
import Application from "./Application.js";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    jobDescription: { type: String },
    skillsRequired: [String],
    responsibilities: [String],
    requirements: [String],
    experienceLevel: {
      type: String,
      enum: [
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Director",
        "Executive",
      ],
    },
    companyName: String,
    salaryRange: {
      minSalary: Number,
      maxSalary: Number,
    },
    location: String,
    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "internship"],
    },
    isMockTest: {
      type: Boolean,
    },
    isPublic: { type: Boolean, default: false },
    questions: { type: Schema.Types.ObjectId, ref: "Question" },
    openings: Number,
    applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models?.Job || model("Job", JobSchema);
