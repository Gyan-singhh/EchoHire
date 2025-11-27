import User from "./User.js";
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const CandidateSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: String,
  skills: [String],
  education: String,
  experience: String,
});

export default models?.Candidate || model("Candidate", CandidateSchema);
