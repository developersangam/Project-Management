const Project = require("./project.model");

async function getProjectBySlug(req, res, next) {
  try {
    const { projectSlug } = req.params;
    const { organization } = req;

    const project = await Project.findOne({
      slug: projectSlug,
      organizationId: organization._id,
    });

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
