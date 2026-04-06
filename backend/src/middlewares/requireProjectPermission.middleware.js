const organizationMemberModel = require("../modules/organizationMember/organizationMember.model");
const projectMemberModel = require("../modules/projectMember/projectMember.model");
const { AppError } = require("../utils/AppError");

const requireProjectPermission = (permissionKey) => {
  return async (req, res, next) => {
    console.log(
      `Checking permission: ${permissionKey} for user ${req.user.id} on project ${req.project._id}`,
    );
    const { project, user, organization } = req;
    const isOwner = await organizationMemberModel
      .findOne({ organizationId: organization._id, userId: user.id })
      .lean();

    if (isOwner.role === "OWNER") {
      return next();
    }
    if (!project) {
      return next(new AppError(500, "Project not found in request"));
    }
    const member = await projectMemberModel
      .findOne({
        projectId: project._id,
        userId: user._id,
        status: "ACTIVE",
      })
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "key",
        },
      })
      .lean();
    if (!member) {
      return next(new AppError(403, "Not a project member"));
    }
    const permissionSet = new Set(member.role.permissions.map((p) => p.key));

    if (!permissionSet.has(permissionKey)) {
      return next(new AppError(403, "Forbidden"));
    }
    next();
  };
};

module.exports = {
  requireProjectPermission,
};
