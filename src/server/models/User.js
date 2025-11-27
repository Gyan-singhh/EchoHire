import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

import Job from "./Job.js";
const UserSchema = new Schema(
  {
    username: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    subscription: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    role: { type: String, enum: ["candidate", "employer"], required: true },
    resumeUrl: { type: String },
    job: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    attended: [{ type: Schema.Types.ObjectId, ref: "UserInterview" }],
  },
  { timestamps: true }
);

export default models?.User || model("User", UserSchema);
