require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);

// Mount all product routes under /api/products
app.use("/api/products", todoRoutes);

// 404 — runs if no route above matched
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

// Error handler — runs only when something throws
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ Connected to database!"))
  .catch((err) => console.log("✗ Connection failed:", err.message));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
