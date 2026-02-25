const ProjectMember = require("./projectMember.model");

async function requireProjectMember(req, res, next) {
  try {
    const { project, user } = req;

    const membership = await ProjectMember.findOne({
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

    req.projectMembership = membership;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireProjectMember,
};
