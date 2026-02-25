const Project = require("./project.model");
const ProjectMember = require("../projectMember/projectMember.model");
const { paginate } = require("../../utils/paginate");
const generateSlug = require("../../utils/generateSlug");
const { AppError } = require("../../utils/AppError");
const userModel = require("../user/user.model");
const organizationMemberModel = require("../organizationMember/organizationMember.model");

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
  console.log("Raw pagination result:", result.data);
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

async function addProjectMember(
  { projectId, organizationId, userId, role, addedBy },
  session,
) {
  // 1️⃣ Ensure user exists
  const user = await userModel.findById(userId).session(session);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // 2️⃣ Ensure user belongs to same organization
  const orgMember = await organizationMemberModel
    .findOne({
      organizationId,
      userId,
      status: "ACTIVE",
    })
    .session(session);

  if (!orgMember) {
    throw new AppError(404, "User is not a member of this organization");
  }

  // 3️⃣ Check existing project membership
  const existing = await ProjectMember.findOne({
    projectId,
    userId,
  }).session(session);

  if (existing) {
    if (existing.status === "ACTIVE") {
      throw new AppError(400, "User is already a project member");
    }

    // Reactivate if previously removed
    existing.status = "ACTIVE";
    existing.role = role || existing.role;
    existing.addedBy = addedBy;
    await existing.save({ session });

    return existing;
  }

  // 4️⃣ Create new membership
  const [membership] = await ProjectMember.create(
    [
      {
        projectId,
        userId,
        role: role || "CONTRIBUTOR",
        status: "ACTIVE",
        addedBy,
      },
    ],
    { session },
  );

  return membership;
}

module.exports = {
  createProject,
  listProjects,
  addProjectMember,
};
