const organizationInviteService = require("./organizationInvite.service");
const { successResponse } = require("../../utils/apiResponse");

async function sendInvite(req, res, next) {
  try {
    const { email, role } = req.body;
    const { organization, user } = req;

    await organizationInviteService.sendInvite({
      organization,
      email,
      role,
      inviterId: user.id,
      inviterName: user.firstName,
    });

    return successResponse(res, 200, "Invitation sent successfully",{});
  } catch (err) {
    next(err);
  }
}

async function acceptInvite(req, res, next) {
  try {
    const result = await organizationInviteService.acceptInvite({
      token: req.body.token,
    });

    if (result?.requiresRegistration) {
      return successResponse(
        res,
        200,
        "User not found. Please register first.",
        { email: result.email }
      );
    }

    return successResponse(res, 200, "Invitation accepted successfully");
  } catch (err) {
    next(err);
  }
}

async function revokeInvite(req, res, next) {
  try {
    const { organization, user } = req;
    const { inviteId } = req.params;

    await organizationInviteService.revokeInvite({
      inviteId,
      organizationId: organization._id,
      revokedBy: user.id,
    });

    return successResponse(res, 200, "Invite revoked successfully");
  } catch (err) {
    next(err);
  }
}

async function listOrganizationInvites(req, res, next) {
  try {
    const { organization } = req;
    const { page, limit, status } = req.query;
    const invites = await organizationInviteService.listInvitesByOrganization(
      organization._id,
      page,
      limit,
      status,
    );
    return successResponse(
      res,
      200,
      "Organization invites fetched successfully",
      invites,
    );
  } catch (err) {
    next(err);
  }
}

async function resendOrganizationInvite(req, res, next) {
  try {
    const { email, role } = req.body;
    const { organization } = req;

    const { invite, rawToken } = await organizationInviteService.resendInvite({
      organizationId: organization._id,
      email,
      role,
      invitedBy: req.user.id,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${rawToken}`;

    await emailService.sendOrganizationInvite({
      to: invite.email,
      inviterName: req.user.firstName,
      organizationName: organization.name,
      inviteLink,
    });

    return successResponse(res, 200, "Invitation resent successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = { sendInvite,revokeInvite,acceptInvite,listOrganizationInvites ,resendOrganizationInvite};