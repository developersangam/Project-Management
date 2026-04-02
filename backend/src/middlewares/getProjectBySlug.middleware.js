const projectModel = require("../modules/project/project.model");

async function getProjectBySlug(req, res, next) {
  try {
    const { projectSlug } = req.params;
    const { organization } = req;

    const project = await projectModel.findOne({
      slug: projectSlug,
      organizationId: organization._id,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    req.project = project;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProjectBySlug,
};
