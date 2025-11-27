import User from "./User.js";
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const EmployerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: String,
  companySize: Number,
  industry: String,
});
export default models?.Employer || model("Employer", EmployerSchema);
