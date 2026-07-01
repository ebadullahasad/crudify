const { Todo } = require("../models/item.model");

// GET /api/todos — list all todos (newest first)
const getAllTodos = async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.status(200).json(todos);
};

// GET /api/todos/:id — fetch one todo by id
const getTodoById = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json(todo);
};

// POST /api/todos — create a new todo
const createTodo = async (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    const err = new Error("name key is required in the request body");
    err.status = 400;
    throw err;
  }
  const newTodo = new Todo({ name });
  await newTodo.save();
  res.status(201).json({ message: newTodo.name + " is added to the list" });
};

// PUT /api/todos/:id — update an existing todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedTodo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ message: updatedTodo.name + " is updated" });
};

// DELETE /api/todos/:id — delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    const err = new Error("Todo not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ message: todo.name + " is deleted from the list" });
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
