const mongoose = require("mongoose");
const orgService = require("../services/orgService");
const generateSlug = require("../utils/generateSlug");
const orgMemberService = require("../services/orgMemberService");
const { successResponse } = require("../utils/apiResponse");
const { AppError } = require("../utils/AppError");
const ORG_PERMISSIONS = require("../constant/organizationPermissions");
const userService = require("../services/userService");
const organizationInviteService = require("../services/orgMemberInviteService");
const emailService = require("../services/email/email.service");
const {generateHash,verifyHash} = require("../utils/generateAndVerifyHash");

async function createOrg(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const baseSlug = generateSlug(req.body.name);
    let slug = baseSlug;
    let counter = 1;

    while (await orgService.isSlugExist(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const orgData = {
      name: req.body.name,
      slug,
      owner: req.user.id,
      isActive: true,
    };

    let organization;

    await session.withTransaction(async () => {
      organization = await orgService.createOrg(orgData, session);

      console.log("Organization created:", organization);
      const orgMember = {
        organizationId: organization._id,
        userId: req.user.id,
        role: "ADMIN",
        status: "ACTIVE",
        joinedAt: new Date(),
        invitedBy: null,
      };
      await orgMemberService.createOrgMember(orgMember, session);
    });
    successResponse(
      res,
      201,
      "Organization created successfully",
      organization,
    );
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function getMyOrganizations(req, res, next) {
  try {
    console.log("Fetching organizations for user:", req.user.id);
    const memberShip = await orgMemberService.getMyOrganizations(req.user.id);
    console.log("Organizations found:", memberShip);
    const formattedOrgs = memberShip.map((member) => ({
      organizationId: member.organizationId._id,
      name: member.organizationId.name,
      slug: member.organizationId.slug,
      role: member.role,
      isOwner: String(member.organizationId.owner) === String(req.user.id),
    }));
    successResponse(
      res,
      200,
      "Organizations fetched successfully",
      formattedOrgs,
    );
  } catch (err) {
    next(err);
  }
}

async function getOrganizationBySlug(req, res, next) {
  try {
    console.log("Fetching organization with slug:", req.params.slug);

    const org = await orgService.getOrgBySlug(req.params.slug);
    if (!org) {
      return next(new AppError(404, "Organization not found"));
    }
    if (!org.isActive) {
      return next(new AppError(403, "Organization is inactive"));
    }
    const member = await orgMemberService.findMember(org._id, req.user.id);
    const isMember = member;
    if (!isMember) {
      return next(new AppError(403, "Access denied to this organization"));
    }
    let organization = {
      id: org._id,
      name: org.name,
      slug: org.slug,
      owner: String(org.owner) === String(req.user.id),
    };
    let membership = {
      role: member.role,
      status: member.status,
      joinedAt: member.joinedAt,
    };
    const permissions = ORG_PERMISSIONS[member.role] || {};
    successResponse(res, 200, "Organization fetched successfully", {
      organization,
      membership,
      permissions,
    });
  } catch (err) {
    console.log("Error fetching organization:", err);
    next(err);
  }
}

async function sendInvite(req, res, next) {
  try {
    const { email, role } = req.body;
    const { organization, membership: inviterMembership } = req;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userService.isEmailExist(normalizedEmail);

    if (existingUser) {
      const existingMember = await orgMemberService.findMember(
        organization._id,
        existingUser._id,
      );

      if (existingMember) {
        throw new AppError("User is already a member", 409);
      }
    }
    // 3️⃣ Check for existing pending invite
    let invite = await organizationInviteService.getInviteByEmailAndStatus(
      organization._id,
      normalizedEmail,
      "PENDING",
    );
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    const { rawToken, tokenHash } = generateHash();
    console.log("Generated invite token for email:", role);
    if (invite) {
      // Update existing invite
      invite.tokenHash = tokenHash;
      invite.expiresAt = expiresAt;
      invite.role = role;
      invite.invitedBy = req.user.id;
      await invite.save();
    } else {
      // Create new invite
      invite = await organizationInviteService.inviteMember({
        organizationId: organization._id,
        email: normalizedEmail,
        role: role,
        tokenHash,
        expiresAt,
        invitedBy: req.user.id,
      });
    }

    // 5️⃣ Send invite email
    const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${rawToken}`;
    await emailService.sendOrganizationInvite({
      to: normalizedEmail,
      inviterName: req.user.firstName,
      organizationName: organization.name,
      inviteLink,
    });

    // 6️⃣ Send response
    return res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function acceptInvite(req, res, next) {
  try {
    const { token } = req.body;

    // 1️⃣ Find invite by token
    const tokenHash = verifyHash(token);
    console.log("Accepting invite with token hash:", tokenHash);
    const invite = await organizationInviteService.getInviteByTokenHash(tokenHash);
    if (!invite) {
      throw new AppError(400, "Invalid or expired invite token");
    }

    if (invite.status !== "PENDING" ) {
      throw new AppError(400, "Invite is already used or expired");
    }

    if (invite.expiresAt < new Date()) {
      invite.status = "EXPIRED";
      await invite.save();
      throw new AppError(400, "Invite has expired");
    }

    let user = await userService.isEmailExist(invite.email);
    if (!user) {
      return successResponse(
        res,
        200,
        "User not found. Please register first.",
        { email: invite.email },
      );
    }
     const existingMember = await orgMemberService.findMember(
      invite.organizationId,
      user._id,
    );

    if (existingMember) {
      return next(new AppError("User already a member", 409));
    }
    
        const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // 2️⃣ Add user to organization
      await orgMemberService.createOrgMember({
        organizationId: invite.organizationId,
        userId: user._id,
        role: invite.role,
        status: "ACTIVE",
        joinedAt: new Date(),
        invitedBy: invite.invitedBy,
      }, session);

      // 3️⃣ Update invite status
      invite.status = "ACCEPTED";
      await invite.save({ session });
    });
    session.endSession();
    // 4️⃣ Send response
    return successResponse(res, 200, "Invitation accepted successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrg,
  getMyOrganizations,
  getOrganizationBySlug,
  sendInvite,
  acceptInvite,
};
