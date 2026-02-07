const OrganizationMember = require("../models/OrganizationMember");
const { paginate } = require("../utils/paginate");

async function createOrgMember(data, session) {
  console.log("Creating organization member with data:", data);
  const [orgMember] = await OrganizationMember.create([data], { session });
  return orgMember;
}

async function getMyOrganizations(userId, page, limit, status) {
  
  return paginate({
    model: OrganizationMember,
    filter: { userId, status: status || "ACTIVE" },
    page,
    limit,
    populate: [{ path: "organizationId", select: "name slug owner isActive" }],
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

module.exports = {
  createOrgMember,
  getMyOrganizations,
  findMember,
  getOrgMembers,
};
