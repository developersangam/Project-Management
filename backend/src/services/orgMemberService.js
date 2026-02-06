const OrganizationMember = require("../models/OrganizationMember");
const { paginate } = require("../utils/paginate");

async function createOrgMember(data, session) {
  console.log("Creating organization member with data:", data);
  const [orgMember] = await OrganizationMember.create([data], { session });
  return orgMember;
}

async function getMyOrganizations(userId) {
  return await OrganizationMember.find({
    userId,
    status: "ACTIVE",
  })
    .populate("organizationId", "name slug owner isActive")
    .lean();
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

module.exports = {
  createOrgMember,
  getMyOrganizations,
  findMember,
  getOrgMembers,
};
