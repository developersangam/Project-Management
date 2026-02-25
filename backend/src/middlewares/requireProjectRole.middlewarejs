const projectMemberModel = require("../modules/projectMember/projectMember.model");

function requireProjectRole(allowedRoles = []) {
  return async function (req, res, next) {
    try {
      const { project, user } = req;

      const membership = await projectMemberModel.findOne({
        projectId: project._id,
        userId: user.id,
        status: "ACTIVE",
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this project",
        });
      }

      if (allowedRoles.length && !allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient project permissions",
        });
      }

      req.projectMembership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireProjectRole,
};
