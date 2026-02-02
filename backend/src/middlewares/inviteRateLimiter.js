const rateLimit = require("express-rate-limit");

exports.inviteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 invites per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many invite requests. Please try again later.",
  },
});
