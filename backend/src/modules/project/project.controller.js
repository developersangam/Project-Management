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
        session,
      );
    });

    return successResponse(res, 201, "Project created successfully", project);
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

    return successResponse(res, 200, "Projects fetched successfully", projects);
  } catch (err) {
    next(err);
  }
}

async function addProjectMember(req, res, next) {
  const session = await mongoose.startSession();
  console.log("Request body for adding project member:", req.body);
  try {
    const { project, organization, user } = req;
    const { email, role } = req.body;

    let membership;

    await session.withTransaction(async () => {
      membership = await projectService.addProjectMember(
        {
          projectId: project._id,
          organizationId: organization._id,
          email,
          role,
          addedBy: user.id,
        },
        session,
      );
    });

    return successResponse(
      res,
      201,
      "Project member added successfully",
      membership,
    );
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function removeProjectMember(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const { project, organization, user } = req;
    const { userId } = req.params;
    console.log(
      `Attempting to remove user ${userId} from project ${project._id} by user ${user.id}`,
    );
    let result;

    await session.withTransaction(async () => {
      result = await projectService.removeProjectMember(
        {
          projectId: project._id,
          organizationId: organization._id,
          userId,
          removedBy: user.id,
        },
        session,
      );
    });

    return successResponse(res, 200, "Project member removed successfully", {
      userId: result.userId,
      status: result.status,
    });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function changeProjectMemberRole(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const { project, user } = req;
    const { userId } = req.params;
    const { role } = req.body;

    let result;

    await session.withTransaction(async () => {
      result = await projectService.changeProjectMemberRole(
        {
          projectId: project._id,
          targetUserId: userId,
          role,
          changedBy: user.id,
        },
        session
      );
    });

    return successResponse(
      res,
      200,
      "Project member role updated successfully",
      {}
    );
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function getProjectMembers(req, res, next) {
  try {
    const { project } = req;

    const members = await projectService.getProjectMembers(project._id);

    return successResponse(
      res,
      200,
      "Project members fetched successfully",
      members
    );
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { project } = req;

    const updatedProject = await projectService.updateProject(
      project._id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Project updated successfully",
      updatedProject
    );
  } catch (err) {
    next(err);
  }
}

async function archiveProject(req, res, next) {
  try {
    const { project } = req;

    await projectService.archiveProject(
      project._id,
      req.user.id
    );

    return successResponse(
      res,
      200,
      "Project archived successfully"
    );
  } catch (err) {
    next(err);
  }
}




module.exports = {
  createProject,
  listProjects,
  addProjectMember,
  removeProjectMember,
  changeProjectMemberRole,
  getProjectMembers,
  updateProject,
  archiveProject,
};
