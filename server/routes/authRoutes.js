const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimit");

router.post("/signup", signupLimiter, signupUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);

module.exports = router;
