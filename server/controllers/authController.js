const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUserIdForSession } = require("../service/auth");

const signupUser = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    const err = new Error(
      "name, email and password are required in the request body",
    );
    err.status = 400;
    throw err;
  }
  const newUser = new User({ name, email, password });
  await newUser.save();
  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    const err = new Error("email and password are required");
    err.status = 400;
    throw err;
  }
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 404;
    throw err;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const sessionId = uuidv4();
  setUserIdForSession(sessionId, user);
  res.cookie("uid", sessionId, {
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Login successful" });
};

module.exports = {
  signupUser,
  loginUser,
};
