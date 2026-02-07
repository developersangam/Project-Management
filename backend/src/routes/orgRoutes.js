const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orgController");
const protect = require("../middlewares/auth.middleware");
const {
  createOrgValidation,
  inviteValidation,
  listOrgInvitesValidation,
  revokeInviteValidation,
} = require("../validations/org.validation");
const { requireAdmin } = require("../middlewares/orgAdmin.middleware.js");
const { validate } = require("../middlewares/validator.middleware.js");
const {
  getOrganizationBySlug,
} = require("../middlewares/getOrganizationBySlug.js");
const { inviteRateLimiter } = require("../middlewares/inviteRateLimiter.js");
const requireOrgMember = require("../middlewares/orgMember.middleware.js");

router.post("/", createOrgValidation, validate, protect, ctrl.createOrg);
router.get("/my", protect, ctrl.getMyOrganizations);
router.get("/:slug", protect, ctrl.getOrganizationBySlug);
router.post(
  "/:slug/invites",
  inviteValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  ctrl.sendInvite,
);
router.post("/accept", inviteRateLimiter, ctrl.acceptInvite);
router.get("/:slug/members", protect, getOrganizationBySlug, requireOrgMember, ctrl.getOrgMembers);
router.get(
  "/:slug/invitees",
  listOrgInvitesValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  ctrl.listOrganizationInvites,
);

router.delete(
  "/:slug/invites/:inviteId",
  revokeInviteValidation,
  validate,
  protect,
  getOrganizationBySlug,
  requireAdmin,
  ctrl.revokeInvite,
);
// Uncomment the following line to enable member removal
// router.delete("/:slug/members/:userId", protect, getOrganizationBySlug, requireAdmin, ctrl.removeMember);

module.exports = router;
