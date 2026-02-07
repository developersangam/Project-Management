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

// services/organizationInviteService.js
async function revokeInvite({ inviteId, organizationId, revokedBy }) {
  const invite = await OrganizationInvite.findOne({
    _id: inviteId,
    organizationId,
  });

  if (!invite) {
    throw new AppError("Invite not found", 404);
  }

  // ✅ Idempotent behavior
  if (invite.status !== "PENDING") {
    return;
  }

  invite.status = "REVOKED";
  invite.revokedAt = new Date();
  invite.revokedBy = revokedBy;

  await invite.save();
}

module.exports = {
  inviteMember,
  getInviteByEmailAndStatus,
  getInviteByTokenHash,
  getInviteById,
  revokeInvite,
};
