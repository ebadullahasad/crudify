require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const connectDB = require("./config/db");
const { authenticateUser } = require("./middlewares/auth");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const { apiLimiter } = require("./middlewares/rateLimit");
const { isProd, cookieBase, AUTH_TTL_MS } = require("./config/cookies");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = process.env.PORT || 8000;

if (isProd) app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
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
      ...cookieBase,
      httpOnly: true,
      maxAge: AUTH_TTL_MS,
    },
  }),
);

app.use("/api", apiLimiter);

// Public routes — no auth required
app.use("/api/auth", authRoutes);

// Protected routes — require a valid session
app.use("/api/products", authenticateUser, productRoutes);

// Fallbacks (must be last)
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
