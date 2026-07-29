require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const connectDB = require("./config/db");
const { authenticateUser } = require("./middlewares/auth");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 5,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 5,
      // secure: true,   // enable in production over HTTPS
    },
  }),
);

// Public routes — no auth required
app.use("/api/auth", authRoutes);

// Protected routes — require a valid session
app.use("/api/products", authenticateUser, productRoutes);

// Fallbacks (must be last)
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
