const express = require("express");
const router = express.Router();
const ctrl = require("./organization.controller.js");
const inviteController = require("../organizationInvite/organizationInvite.controller.js");
const protect = require("../../middlewares/auth.middleware.js");
const {
  createOrgValidation,
  inviteValidation,
  listOrgInvitesValidation,
  revokeInviteValidation,
} = require("../../validations/org.validation.js");
const { requireAdmin } = require("../../middlewares/orgAdmin.middleware.js");
const { validate } = require("../../middlewares/validator.middleware.js");
const {
  getOrganizationBySlug,
} = require("../../middlewares/getOrganizationBySlug.js");
const { inviteRateLimiter } = require("../../middlewares/inviteRateLimiter.js");
const requireOrgMember = require("../../middlewares/orgMember.middleware.js");

// Organization routes
router.post("/", createOrgValidation, validate, protect, ctrl.createOrg);
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
  inviteController.resendOrganizationInvite
);

// Uncomment the following line to enable member removal
// router.delete("/:slug/members/:userId", protect, getOrganizationBySlug, requireAdmin, ctrl.removeMember);

module.exports = router;
