const User = require("../models/user");

async function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}

module.exports = { authenticateUser };
