import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import Job from "./Job.js";
import User from "./User.js";
import Question from "./Question.js";
const AttemptSchema = new Schema(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    questions: { type: Schema.Types.ObjectId, ref: "Question" },
    videoUrl: String,
    answers: [
      {
        answerText: String,
      },
    ],
    rating: { type: Number, min: 0, max: 10 },
    feedback: {
      strengths: [String],
      improvements: [String],
      overallComment: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Attempt || model("Attempt", AttemptSchema);
