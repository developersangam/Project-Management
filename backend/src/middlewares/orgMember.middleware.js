const { AppError } = require("../utils/AppError");

const requireOrgMember = async (req, res, next) => {
  try {
    if (!req.membership || req.membership.status !== "ACTIVE") {
      return next(new AppError("You are not a member of this organization", 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireOrgMember;
