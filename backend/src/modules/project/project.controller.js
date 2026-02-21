const mongoose = require("mongoose");
const projectService = require("./project.service");
const { successResponse } = require("../../utils/apiResponse");

async function createProject(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const { organization, user } = req;
    const { name, description } = req.body;

    let project;

    await session.withTransaction(async () => {
      project = await projectService.createProject(
        {
          organizationId: organization._id,
          name,
          description,
          createdBy: user.id,
        },
        session
      );
    });

    return successResponse(
      res,
      201,
      "Project created successfully",
      project
    );
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function listProjects(req, res, next) {
  try {
    const { organization, user } = req;
        const { page, limit, status } = req.query;


    const projects = await projectService.listProjects({
      organizationId: organization._id,
      userId: user.id,
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });

    return successResponse(
      res,
      200,
      "Projects fetched successfully",
      projects
    );
  } catch (err) {
    next(err);
  }
}


module.exports = {
  createProject,
  listProjects
};


