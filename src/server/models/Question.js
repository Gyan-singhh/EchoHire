import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const QuestionSchema = new Schema({
  text: [String],
});

export default mongoose.models?.Question || model("Question", QuestionSchema);
