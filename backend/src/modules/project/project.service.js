const Project = require("./project.model");
const ProjectMember = require("../projectMember/projectMember.model");
const { paginate } = require("../../utils/paginate");
const generateSlug = require("../../utils/generateSlug");
const { AppError } = require("../../utils/AppError");
const { path } = require("../..");

async function createProject(data, session) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let counter = 1;

  // 🔁 Ensure slug uniqueness PER ORGANIZATION
  while (
    await Project.exists({
      organizationId: data.organizationId,
      slug,
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // 1️⃣ Create Project
  const [project] = await Project.create(
    [
      {
        ...data,
        slug,
      },
    ],
    { session },
  );

  // 2️⃣ Auto-add creator as PROJECT_MANAGER
  await ProjectMember.create(
    [
      {
        projectId: project._id,
        userId: data.createdBy,
        role: "PROJECT_MANAGER",
        status: "ACTIVE",
        addedBy: data.createdBy,
        joinedAt: new Date(),
      },
    ],
    { session },
  );

  return project;
}

async function listProjects({ organizationId, userId, page, limit, status }) {
  const result = await paginate({
    model: ProjectMember,
    filter: {
      userId,
      status: "ACTIVE",
    },
    page,
    limit,
    populate: [
      {
        path: "projectId",
        match: { organizationId, ...(status ? { status } : {}) }, // Filter projects by status if provided
        // select: "name description slug status createdAt updatedAt",
      },
    ],
  });
  const filteredData = result.data
    .filter((member) => member.projectId) // Filter out memberships where the project doesn't match the status filter
    .map((member) => ({
      project: member.projectId,
      role: member.role,
    }));
  return {
    data: filteredData,
    meta: result.meta,
  };
}

module.exports = {
  createProject,
  listProjects,
};
