require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { Todo } = require("./models/item.model");

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.status(200).json(todos);
});

app.get('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json(todo);
});

app.post("/api/todos", async (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    const err = new Error("name key is required in the request body");
    err.status = 400;
    throw err;
  }
  const newTodo = new Todo({
    name: name,
  });
  await newTodo.save();
  res.status(201).json({ message: newTodo.name + " is added to the list", todo: newTodo });
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedTodo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ message: todo.name + " is deleted from the list" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ Connected to database!"))
  .catch((err) => console.log("✗ Connection failed:", err.message));
