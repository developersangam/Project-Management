const OrganizationMember = require("../models/OrganizationMember");

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

module.exports = { createOrgMember, getMyOrganizations, findMember };
