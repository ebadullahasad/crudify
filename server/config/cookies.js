const isProd = process.env.NODE_ENV === "production";

const cookieBase = {
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

const AUTH_TTL_MS = 1000 * 60 * 5;

module.exports = { isProd, cookieBase, AUTH_TTL_MS };
