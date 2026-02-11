const orgMemberService = require("./organizationMember.service");
const { successResponse } = require("../../utils/apiResponse");

async function changeMemberRole(req, res, next) {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    await orgMemberService.changeMemberRole({
      organization: req.organization,
      actor: req.membership,
      targetMemberId: memberId,
      newRole: role,
    });

    return successResponse(
      res,
      200,
      "Member role updated successfully"
    );
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    const { userId } = req.params;
    const { organization } = req;

    await orgMemberService.removeMember({
      organizationId: organization._id,
      actorUserId: req.user.id,
      targetUserId: userId,
    });

    return successResponse(
      res,
      200,
      "Member removed successfully"
    );
  } catch (err) {
    next(err);
  }
}


module.exports = {
changeMemberRole,
removeMember,
};
