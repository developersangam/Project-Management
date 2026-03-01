const Project = require("./project.model");
const ProjectMember = require("../projectMember/projectMember.model");
const { paginate } = require("../../utils/paginate");
const generateSlug = require("../../utils/generateSlug");
const { AppError } = require("../../utils/AppError");
const userModel = require("../user/user.model");
const organizationMemberModel = require("../organizationMember/organizationMember.model");
const projectRoleModel = require("../accessControl/projectRole.model");

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
  const adminRole = await projectRoleModel.findOne({ key: "PROJECT_ADMIN" });

  // 2️⃣ Auto-add creator as PROJECT_ADMIN
  await ProjectMember.create(
    [
      {
        projectId: project._id,
        userId: data.createdBy,
        role: adminRole._id,
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
  { projectId, organizationId, userId, roleKey, addedBy },
  session,
) {
  // 1️⃣ Validate user
  const user = await userModel.findById(userId).session(session);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // 2️⃣ Validate org membership
  const orgMember = await organizationMemberModel
    .findOne({
      organizationId,
      userId,
      status: "ACTIVE",
    })
    .session(session);

  if (!orgMember) {
    throw new AppError(400, "User is not a member of this organization");
  }

  // 3️⃣ Resolve role by key
  const projectRole = await projectRoleModel
    .findOne({ key: roleKey })
    .session(session);

  if (!projectRole) {
    throw new AppError(400, "Invalid project role");
  }

  // 4️⃣ Check existing membership
  const existing = await ProjectMember.findOne({
    projectId,
    userId,
  }).session(session);

  if (existing) {
    if (existing.status === "ACTIVE") {
      throw new AppError(400, "User is already a project member");
    }

    existing.status = "ACTIVE";
    existing.role = projectRole._id;
    existing.addedBy = addedBy;

    await existing.save({ session });

    return existing;
  }

  // 5️⃣ Create new membership
  const [membership] = await ProjectMember.create(
    [
      {
        projectId,
        userId,
        role: projectRole._id,
        status: "ACTIVE",
        addedBy,
      },
    ],
    { session },
  );

  return membership;
}

async function removeProjectMember({ projectId, userId, removedBy }, session) {
  // 1️⃣ Get remover membership
  const remover = await ProjectMember.findOne({
    projectId,
    userId: removedBy,
    status: "ACTIVE",
  })
    .populate("role")
    .session(session);

  if (!remover) {
    throw new AppError(403, "You are not a project member");
  }

  // 2️⃣ Get target membership
  const target = await ProjectMember.findOne({
    projectId,
    userId,
    status: "ACTIVE",
  })
    .populate("role")
    .session(session);

  if (!target) {
    throw new AppError(404, "Target member not found");
  }

  // 3️⃣ Prevent self removal
  if (String(remover.userId) === String(target.userId)) {
    throw new AppError(400, "You cannot remove yourself");
  }


  const removerLevel = remover.role.level;
  const targetLevel = target.role.level;

  console.log(removerLevel, targetLevel);

  // 4️⃣ Prevent removing equal or higher level
  if (removerLevel <= targetLevel) {
    throw new AppError(
      403,
      "Not allowed to remove this member due to insufficient permissions",
    );
  }

  // 5️⃣ Soft remove
  target.status = "REMOVED";
  target.removedBy = removedBy;
  target.removedAt = new Date();

  await target.save({ session });

  return target;
}

async function changeProjectMemberRole(
  { projectId, targetUserId, roleKey, changedBy },
  session
) {
  // 1️⃣ Get changer membership
  const changer = await ProjectMember.findOne({
    projectId,
    userId: changedBy,
    status: "ACTIVE",
  })
    .populate("role")
    .session(session);

  if (!changer) {
    throw new AppError(403, "You are not a project member");
  }

  // 2️⃣ Get target membership
  const target = await ProjectMember.findOne({
    projectId,
    userId: targetUserId,
    status: "ACTIVE",
  })
    .populate("role")
    .session(session);

  if (!target) {
    throw new AppError(404, "Target member not found");
  }

  // 3️⃣ Prevent self role change
  if (String(changer.userId) === String(target.userId)) {
    throw new AppError(400, "You cannot change your own role");
  }

  // 4️⃣ Get new role
  const newRole = await projectRoleModel.findOne({ key: roleKey }).session(session);

  if (!newRole) {
    throw new AppError(400, "Invalid role");
  }

  // 5️⃣ Hierarchy Checks
  const changerLevel = changer.role.level;
  const targetLevel = target.role.level;
  const newRoleLevel = newRole.level;

  // Cannot modify equal or higher
  if (changerLevel <= targetLevel) {
    throw new AppError(
      403,
      "You cannot change role of equal or higher member"
    );
  }

  // Cannot assign role equal or higher than yourself
  if (changerLevel <= newRoleLevel) {
    throw new AppError(
      403,
      "You cannot assign a role equal or higher than yourself"
    );
  }

  // 6️⃣ Update role
  target.role = newRole._id;
  await target.save({ session });

  return target;
}

async function getProjectMembers(projectId) {
  const members = await ProjectMember.find({
    projectId,
    status: "ACTIVE",
  })
    .populate({
      path: "userId",
      select: "name email avatar", // adjust to your User model
    })
    .populate({
      path: "role",
      select: "key level",
    })
    .lean();

  // Format clean response
  return members.map((member) => ({
    id: member._id,
    user: member.userId,
    role: member.role.key,
    roleLevel: member.role.level,
    joinedAt: member.createdAt,
  }));
}

async function updateProject(projectId, payload) {
  const allowedFields = ["name", "description"];
  const updates = {};

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      updates[key] = payload[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(400, "No valid fields provided for update");
  }

  const existingProject = await Project.findById(projectId);

  if (!existingProject) {
    throw new AppError(404, "Project not found");
  }

  // 🔥 Use SAME slug logic as create
  if (updates.name && updates.name !== existingProject.name) {
    const baseSlug = generateSlug(updates.name);
    let slug = baseSlug;
    let counter = 1;

    while (
      await Project.exists({
        organizationId: existingProject.organizationId,
        slug,
        _id: { $ne: projectId }, // exclude current project
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    updates.slug = slug;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  return {
    id: updatedProject._id,
    name: updatedProject.name,
    slug: updatedProject.slug,
    description: updatedProject.description,
    updatedAt: updatedProject.updatedAt,
  };
}

async function archiveProject(projectId) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  if (project.status === "ARCHIVED") {
    throw new AppError(400, "Project is already archived");
  }

  if (project.status === "DELETED") {
    throw new AppError(400, "Cannot archive a deleted project");
  }

  project.status = "ARCHIVED";
  await project.save();
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
