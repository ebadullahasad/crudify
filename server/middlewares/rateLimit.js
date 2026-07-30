const rateLimit = require("express-rate-limit");

const base = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    res.status(options.statusCode).json({ error: options.message }),
};


const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many requests. Please try again in a few minutes.",
});

const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "Too many failed login attempts. Please try again in 15 minutes.",
});

const signupLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Too many accounts created from this IP. Please try again later.",
});

const writeLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: "Too many write requests. Please slow down.",
});

module.exports = { apiLimiter, loginLimiter, signupLimiter, writeLimiter };
