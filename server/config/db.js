const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to database!");
  } catch (err) {
    console.error("✗ Connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
