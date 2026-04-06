const express = require("express");
const router = express.Router();
const ctrl = require("./organization.controller.js");
const inviteController = require("../organizationInvite/organizationInvite.controller.js");
const orgMemberController = require("../organizationMember/organizationMember.controller.js");
const protect = require("../../middlewares/auth.middleware.js");
const {
  createOrgValidation,
  inviteValidation,
  listOrgInvitesValidation,
  revokeInviteValidation,
  resendInviteValidation,
  changeMemberRoleValidation,
} = require("../../validations/org.validation.js");
const { requireAdmin } = require("../../middlewares/orgAdmin.middleware.js");
const { validate } = require("../../middlewares/validator.middleware.js");
const {
  getOrganizationBySlug,
} = require("../../middlewares/getOrganizationBySlug.js");
const { inviteRateLimiter } = require("../../middlewares/inviteRateLimiter.js");
const requireOrgMember = require("../../middlewares/orgMember.middleware.js");
const projectRoutes = require("../project/project.routes");

// Organization routes
router.post("/", createOrgValidation, validate, protect, ctrl.createOrg);

router.patch(
  "/:slug",
  createOrgValidation,
  validate,
  protect,
  getOrganizationBySlug,
  ctrl.updateOrganization,
);

router.post("/getOrgSlug", ctrl.generateOrgSlug)

router.get("/my", protect, ctrl.getMyOrganizations);

router.get(
  "/:slug",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  ctrl.getOrganizationBySlug,
);

router.get(
  "/:slug/members",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  ctrl.getOrgMembers,
);

//invite routes
router.post(
  "/:slug/invites",
  inviteValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  inviteController.sendInvite,
);

router.post("/accept", inviteRateLimiter, inviteController.acceptInvite);

router.get(
  "/:slug/invitees",
  listOrgInvitesValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  inviteController.listOrganizationInvites,
);

router.delete(
  "/:slug/invites/:inviteId",
  revokeInviteValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  inviteController.revokeInvite,
);

router.post(
  "/resend",
  protect,
  resendInviteValidation,
  getOrganizationBySlug,
  requireAdmin,
  inviteController.resendOrganizationInvite,
);

router.patch(
  "/:slug/members/:memberId/role",
  protect,
  getOrganizationBySlug,
  requireAdmin,
  changeMemberRoleValidation, // or OWNER logic inside service
  validate,
  orgMemberController.changeMemberRole,
);

router.delete(
  "/:slug/members/:userId",
  protect,
  getOrganizationBySlug,
  requireAdmin,
  orgMemberController.removeMember,
);

router.delete(
  "/:slug",
  protect,
  getOrganizationBySlug,
  requireAdmin,
  ctrl.deleteOrganization,
);

router.use("/:slug/projects", projectRoutes);

// Uncomment the following line to enable member removal
// router.delete("/:slug/members/:userId", protect, getOrganizationBySlug, requireAdmin, ctrl.removeMember);

module.exports = router;
