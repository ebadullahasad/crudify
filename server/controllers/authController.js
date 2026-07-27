const user = require("../models/user");
const User = require("../models/user");

const signupUser = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    const err = new Error(
      "name, email and password are required in the request body",
    );
    err.status = 400;
    throw err;
  }
const existing = await User.findOne({ $or: [{ name }, { email }] });
if(existing) {
  let fields = [];
  
  if(existing.email === email) fields.push("email");
  if(existing.name === name) fields.push("name");
  
  const field = fields.join(" and ");
  const err = new Error(`${field} already exists`);
  err.status = 409;
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
    err.status = 401;
    throw err;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  req.session.userId = user._id;

  res.status(200).json({ success: true, message: "Login successful" });
};

const logoutUser = async (req, res) => {
  if (!req.session) {
    return res
      .status(200)
      .json({ success: true, message: "Already logged out" });
  }

  await new Promise((res, rej) => {
    req.session.destroy((err) => (err ? rej(err) : res()));
  });

  res.clearCookie("connect.sid"); // default cookie name for express-session
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};
