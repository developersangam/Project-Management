const { successResponse } = require("../utils/apiResponse");

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

module.exports = { revokeInvite };