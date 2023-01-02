import express from "express";
const app = express();
const PORT = process.env.PORT || 6789;
import dotenv from "dotenv";
import cors from "cors";
import todoModel from "./todo.model.js";
dotenv.config();
import mongoose from "mongoose";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://127.0.0.1:5500/", "http://127.0.0.1:5500"],
    credentials :true
  })
);
app.get("/", (req, res) => {
  res.send("im live");
});

app.post("/api/v1/todo/create", async (req, res) => {
  const { title, status, priority, desc, date } = req.body;
  console.log(req.body);
  if (!title || !status || !priority || !desc || !date) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }
  const akg = await todoModel.create({ ...req.body });
  const todos = await todoModel.find();
  return res
    .status(200)
    .json({ success: true, message: "todo created", todos });
});

app.get("/api/v1/todo/get", async (req, res) => {
  const akg = await todoModel.find();
  res.status(200).json({ success: true, todos: akg || {} });
});

app.delete("/api/v1/todo/delete", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(204).json({ success: false, message: "ID is required" });
  }
  const akg = await todoModel.deleteOne({ _id });
  const todos = await todoModel.find();
  return res
    .status(200)
    .json({ success: true, message: "ToDo deleted", todo: akg });
});

app.post("/api/v1/todo/update", async (req, res) => {
  const { _id, status } = req.body;
  if (!_id || !status) {
    return res
      .status(204)
      .json({ success: false, message: "ID and status are required" });
  }
  const akg = await todoModel.updateOne({ _id }, { status });
  const todos = await todoModel.find();
  return res
    .status(200)
    .json({ success: true, message: "ToDo deleted", todo: akg });
});
app.listen(PORT, (error) => {0
  if (!error) {
    mongoose.connect(process.env.MONGO_DB, (error) => {
      !error && console.log("mongoDB Atlas connected");
      error && console.log(error);
    });
    console.log(`server is live on : ${PORT}`);
    return;
  }
  console.log(error);
});
