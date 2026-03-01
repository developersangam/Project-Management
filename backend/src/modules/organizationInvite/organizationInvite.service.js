const OrganizationInvite = require("./organizationInvite.model");
const userService = require("../user/user.service");
const orgMemberService = require("../organizationMember/organizationMember.service");
const emailService = require("../email/email.service");
const { AppError } = require("../../utils/AppError");
const {
  generateHash,
  hashInviteToken,
} = require("../../utils/generateAndVerifyHash");
const { paginate } = require("../../utils/paginate");
const userModel = require("../user/user.model");
const mongoose = require("mongoose");

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

async function sendInvite({
  organization,
  email,
  role,
  inviterId,
  inviterName,
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await userService.isEmailExist(normalizedEmail);
  if (existingUser) {
    const member = await orgMemberService.findMember(
      organization._id,
      existingUser._id,
    );
    if (member) {
      throw new AppError(409, "User is already a member");
    }
  }

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const { rawToken, tokenHash } = generateHash();

  let invite = await OrganizationInvite.findOne({
    organizationId: organization._id,
    email: normalizedEmail,
    status: "PENDING",
  });

  if (invite) {
    invite.tokenHash = tokenHash;
    invite.expiresAt = expiresAt;
    invite.role = role;
    invite.invitedBy = inviterId;
    await invite.save();
  } else {
    invite = await OrganizationInvite.create({
      organizationId: organization._id,
      email: normalizedEmail,
      role,
      tokenHash,
      expiresAt,
      invitedBy: inviterId,
    });
  }

  const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${rawToken}`;

  await emailService.sendOrganizationInvite({
    to: normalizedEmail,
    inviterName,
    organizationName: organization.name,
    inviteLink,
  });
}
// services/organizationInviteService.js
async function revokeInvite({ inviteId, organizationId, revokedBy }) {
  const invite = await OrganizationInvite.findOne({
    _id: inviteId,
    organizationId,
  });

  if (!invite) {
    throw new AppError(404, "Invite not found");
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

async function acceptInvite({ token }) {
  const tokenHash = hashInviteToken(token);
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const invite = await OrganizationInvite.findOne({
        tokenHash,
      }).session(session);

      if (!invite) {
        throw new AppError(400, "Invalid or expired invite token");
      }

      if (invite.expiresAt < new Date()) {
        invite.status = "EXPIRED";
        await invite.save({ session });
        throw new AppError(400, "Invite has expired");
      }

      // Idempotent success
      if (invite.status === "ACCEPTED") {
        return;
      }

      if (invite.status !== "PENDING") {
        throw new AppError(400, "Invite is no longer valid");
      }

      const user = await userModel
        .findOne({ email: invite.email })
        .session(session);
      if (!user) {
        return { requiresRegistration: true, email: invite.email };
      }

      try {
        await orgMemberService.createOrgMember(
          {
            organizationId: invite.organizationId,
            userId: user._id,
            role: invite.role,
            status: "ACTIVE",
            joinedAt: new Date(),
            invitedBy: invite.invitedBy,
          },
          session,
        );
      } catch (err) {
        if (err.code !== 11000) throw err;
        // duplicate membership → idempotent success
      }

      invite.status = "ACCEPTED";
      await invite.save({ session });
    });
  } finally {
    session.endSession();
  }
}

async function resendInvite({
  organizationId,
  email,
  role,
  invitedBy,
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const invite = await OrganizationInvite.findOne({
    organizationId,
    email: normalizedEmail,
  });

  if (!invite) {
    throw new AppError(404, "Invite not found");
  }

  if (invite.status === "ACCEPTED") {
    throw new AppError(400, "Invite already accepted");
  }

  if (invite.status === "REVOKED") {
    throw new AppError(400, "Invite has been revoked");
  }

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const { rawToken, tokenHash } = generateHash();

  invite.tokenHash = tokenHash;
  invite.expiresAt = expiresAt;
  invite.status = "PENDING";
  invite.role = role ?? invite.role;
  invite.invitedBy = invitedBy;

  await invite.save();

  return {
    invite,
    rawToken,
  };
}

async function listInvitesByOrganization(organizationId, page, limit, status) {
  return await paginate({
    model: OrganizationInvite,
    filter: {
      organizationId,
      status,
    },
    page,
    limit,
    sort: { createdAt: -1 },
  });
}

module.exports = {
  inviteMember,
  getInviteByEmailAndStatus,
  getInviteByTokenHash,
  getInviteById,
  sendInvite,
  acceptInvite,
  revokeInvite,
  resendInvite,
  listInvitesByOrganization,
};
