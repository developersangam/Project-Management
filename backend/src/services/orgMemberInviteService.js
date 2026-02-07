const OrganizationInvite = require("../models/OrganizationInvite");
const { paginate } = require("../utils/paginate");

async function inviteMember(data) {
  return await OrganizationInvite.create(data);
}

async function getInviteByEmailAndStatus(organizationId, email, status) {
  return await OrganizationInvite.findOne({
    organizationId,
    email,
    status,
    expiresAt: { $gt: new Date() },
  });
}

async function getInviteByTokenHash(tokenHash) {
  return await OrganizationInvite.findOne({ tokenHash });
}

async function getInviteById(id) {
  return await OrganizationInvite.findById(id);
}

async function listInvitesByOrganization(organizationId, page, limit,status) {
  const filter = { organizationId };
  if (status) {
    filter.status = status;
  }
  return await paginate({
    model: OrganizationInvite,
    filter,
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: "invitedBy", select: "userName email" }],
  });
}

module.exports = {
  inviteMember,
  getInviteByEmailAndStatus,
  getInviteByTokenHash,
  getInviteById,
  listInvitesByOrganization,
};
