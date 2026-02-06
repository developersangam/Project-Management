const crypto = require("crypto");

const generateHash = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
};

const hashInviteToken = (token) => {
  const computedHash = crypto.createHash("sha256").update(token).digest("hex");
  return computedHash;
}

module.exports = { generateHash, hashInviteToken };
