import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    priority: String,
    desc: String,
    date: Date,
  },
  { timestamps: true }
);
export default mongoose.model("Todo", todoSchema);
