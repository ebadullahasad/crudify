// 404 — runs when no route matched
const notFound = (req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
};

// Central error handler — runs when any middleware/controller throws
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  console.error(`[${new Date().toISOString()}] ${status} - ${err.message}`);
  if (status >= 500) console.error(err.stack);

  const clientMessage = status >= 500 ? "Internal Server Error" : err.message;
  res.status(status).json({ error: clientMessage });
};

module.exports = { notFound, errorHandler };
