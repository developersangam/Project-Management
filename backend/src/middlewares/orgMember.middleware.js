const { AppError } = require("../utils/AppError");

const requireOrgMember = async (req, res, next) => {
  try {
    if (!req.membership || req.membership.status !== "ACTIVE") {
      return next(new AppError(403, "You are not a member of this organization"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireOrgMember;
