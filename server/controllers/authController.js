const User = require("../models/user");
const { cookieBase, AUTH_TTL_MS } = require("../config/cookies");

const setUserCookie = (res, user) => {
  res.cookie(
    "crudify_user",
    JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
    }),
    {
      ...cookieBase,
      httpOnly: false,
      maxAge: AUTH_TTL_MS,
    },
  );
};

const clearAuthCookies = (res) => {
  res.clearCookie("connect.sid", { ...cookieBase, httpOnly: true });
  res.clearCookie("crudify_user", { ...cookieBase, httpOnly: false });
};

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
  if (existing) {
    const fields = [];
    if (existing.email === email) fields.push("email");
    if (existing.name === name) fields.push("name");
    const err = new Error(`${fields.join(" and ")} already exists`);
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
  setUserCookie(res, user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email },
  });
};

const logoutUser = async (req, res) => {
  if (!req.session) {
    clearAuthCookies(res);
    return res
      .status(200)
      .json({ success: true, message: "Already logged out" });
  }

  await new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });

  clearAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  setUserCookie, // exported so middleware can refresh on each request
};
