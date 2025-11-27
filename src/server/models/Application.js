import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import User from "./User.js";
import Job from "./Job.js";

const ApplicationSchema = new Schema(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: {
      resumeUrl: { type: String },
      publicId: { type: String },
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "interview_scheduled",
        "interviewed",
        "rejected",
        "hired",
      ],
      default: "applied",
    },

    assignedInterview: {
      isAssigned: { type: Boolean, default: false },
      scheduledAt: { type: Date },
      scheduledFrom: { type: Date }, 
      scheduledEnd: { type: Date },  
      meetingLink: { type: String },
    },
  },
  { timestamps: true }
);
export default mongoose.models?.Application ||
  model("Application", ApplicationSchema);
