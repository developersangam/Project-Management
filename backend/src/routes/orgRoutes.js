const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orgController");
const protect = require("../middlewares/auth.middleware");
const {
  createOrgValidation,
  inviteValidation,
} = require("../validations/org.validation");
const { requireAdmin } = require("../middlewares/orgAdmin.middleware.js");
const { validate } = require("../middlewares/validator.middleware.js");
const {
  getOrganizationBySlug,
} = require("../middlewares/getOrganizationBySlug.js");
const { inviteRateLimiter } = require("../middlewares/inviteRateLimiter.js");

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

module.exports = router;
