const OrganizationMember = require("./organizationMember.model");
const { paginate } = require("../../utils/paginate");
const { aggregatePaginate } = require("../../utils/aggregatePagination");
const { default: mongoose } = require("mongoose");
const { AppError } = require("../../utils/AppError");

async function createOrgMember(data, session) {
  console.log("Creating organization member with data:", data);
  const existingMember = await OrganizationMember.findOne({
    organizationId: data.organizationId,
    userId: data.userId,
  }).session(session);

  // 🔹 Reactivate if exists
  if (existingMember) {
    existingMember.status = "ACTIVE";
    existingMember.role = data.role;
    existingMember.joinedAt = new Date();
    existingMember.invitedBy = data.invitedBy;

    // 🔹 Clear removal fields
    existingMember.removedAt = null;
    existingMember.removedBy = null;

    await existingMember.save({ session });
    return existingMember;
  }

  // 🔹 Create new
  const [orgMember] = await OrganizationMember.create([data], { session });
  return orgMember;
}

async function getMyOrganizations(userId, page, limit, status) {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: status || "ACTIVE",
      },
    },

    // Join organization
    {
      $lookup: {
        from: "organizations",
        localField: "organizationId",
        foreignField: "_id",
        as: "organization",
      },
    },
    { $unwind: "$organization" },
    {
      $match: {
        "organization.isActive": true,
      },
    },
    // Count members
    {
      $lookup: {
        from: "organizationmembers",
        let: { orgId: "$organizationId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$organizationId", "$$orgId"] },
                  { $eq: ["$status", "ACTIVE"] },
                ],
              },
            },
          },
          { $count: "totalMembers" },
        ],
        as: "memberStats",
      },
    },

    // Count projects
    {
      $lookup: {
        from: "projects",
        let: { orgId: "$organizationId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and :[
                  {$eq: ["$organizationId", "$$orgId"]}, 
                ]
                
              },
            },
          },
          { $count: "totalProjects" },
        ],
        as: "projectStats",
      },
    },

    // Flatten counts
    {
      $addFields: {
        totalMembers: {
          $ifNull: [{ $arrayElemAt: ["$memberStats.totalMembers", 0] }, 0],
        },
        totalProjects: {
          $ifNull: [{ $arrayElemAt: ["$projectStats.totalProjects", 0] }, 0],
        },
      },
    },

    // Clean response
    {
      $project: {
        _id: 0,
        organization: {
          _id: "$organization._id",
          name: "$organization.name",
          slug: "$organization.slug",
          owner: "$organization.owner",
          isActive: "$organization.isActive",
        },
        totalMembers: 1,
        totalProjects: 1,
      },
    },
  ];
  return aggregatePaginate({
    model: OrganizationMember,
    pipeline,
    page,
    limit,
  });
}

async function findMember(organizationId, userId) {
  return await OrganizationMember.findOne({
    organizationId,
    userId,
    status: "ACTIVE",
  });
}

async function getOrgMembers(organizationId, page, limit, role) {
  const filter = { organizationId, status: "ACTIVE" };
  if (role) {
    filter.role = role;
  }
  return await paginate({
    model: OrganizationMember,
    filter,
    page,
    limit,
    populate: [{ path: "userId", select: "userName email" }],
  });
}

async function changeMemberRole({
  organization,
  actor,
  targetMemberId,
  newRole,
}) {
  // 1️⃣ Fetch target member
  const targetMember = await OrganizationMember.findOne({
    userId: targetMemberId,
    organizationId: organization._id,
    status: "ACTIVE",
  });

  if (!targetMember) {
    throw new AppError(404, "Organization member not found");
  }

  // 2️⃣ Self-role change check
  if (String(actor.userId) === String(targetMember.userId)) {
    throw new AppError(400, "You cannot change your own role");
  }

  // 3️⃣ Owner protection
  if (targetMember.role === "ADMIN") {
    throw new AppError(403, "Admin role cannot be changed");
  }

  // 4️⃣ Permission rules
  if (actor.role === "ADMIN") {
    if (targetMember.role !== "MEMBER") {
      throw new AppError(403, "Admins can only modify members");
    }
    if (newRole === "ADMIN") {
      throw new AppError(403, "Admins cannot promote members to admin");
    }
  }

  if (!["OWNER", "ADMIN"].includes(actor.role)) {
    throw new AppError(403, "Insufficient permissions");
  }

  // 5️⃣ No-op (idempotent)
  if (targetMember.role === newRole) {
    return;
  }

  // 6️⃣ Update role
  targetMember.role = newRole;
  await targetMember.save();
}

async function removeMember({ organizationId, actorUserId, targetUserId }) {
  // 1️⃣ Cannot remove yourself
  if (String(actorUserId) === String(targetUserId)) {
    throw new AppError(400, "You cannot remove yourself from the organization");
  }

  // 2️⃣ Get actor (who is performing action)
  const actor = await OrganizationMember.findOne({
    organizationId,
    userId: actorUserId,
    status: "ACTIVE",
  });

  if (!actor) {
    throw new AppError(403, "You are not part of this organization");
  }

  // 3️⃣ Get target member
  const member = await OrganizationMember.findOne({
    organizationId,
    userId: targetUserId,
  });

  if (!member) {
    throw new AppError(404, "Member not found");
  }

  // 4️⃣ Idempotent success
  if (member.status === "REMOVED") {
    return member;
  }

  // 5️⃣ RBAC CHECK (🔥 MAIN FIX)

  // MEMBER cannot remove anyone
  if (actor.role === "MEMBER") {
    throw new AppError(403, "You do not have permission to remove members");
  }

  // ADMIN cannot remove OWNER
  if (actor.role === "ADMIN" && member.role === "OWNER") {
    throw new AppError(403, "Admin cannot remove the owner");
  }

  // ADMIN cannot remove ADMIN
  if (actor.role === "ADMIN" && member.role === "ADMIN") {
    throw new AppError(403, "Admin cannot remove another admin");
  }

  // OWNER can remove anyone (except self already handled)

  // 6️⃣ Prevent removing last admin
  if (member.role === "ADMIN" && member.status === "ACTIVE") {
    const adminCount = await OrganizationMember.countDocuments({
      organizationId,
      role: "ADMIN",
      status: "ACTIVE",
    });

    if (adminCount === 1) {
      throw new AppError(400, "Cannot remove the last admin");
    }
  }

  // 7️⃣ Soft remove
  member.status = "REMOVED";
  member.removedAt = new Date();
  member.removedBy = actorUserId;

  await member.save();

  return member;
}

module.exports = {
  createOrgMember,
  getMyOrganizations,
  findMember,
  getOrgMembers,
  changeMemberRole,
  removeMember,
};
