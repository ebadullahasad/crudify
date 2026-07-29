const User = require("../models/user");
const { setUserCookie } = require("../controllers/authController");

async function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  setUserCookie(res, user);

  req.user = user;
  next();
}

module.exports = { authenticateUser };
