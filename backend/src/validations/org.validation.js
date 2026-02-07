const { body, query, param} = require("express-validator");

const createOrgValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Organization name is required")
    .isLength({ min: 3 }).withMessage("Organization name must be at least 3 characters"),
];

const inviteValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("role")
    .isIn(["MEMBER", "PROJECT_MANAGER"])
    .withMessage("Role must be MEMBER or PROJECT_MANAGER"),
];

const organizationMemberValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("role")
    .isIn(["OWNER", "ADMIN", "MEMBER"])
    .withMessage("Role must be OWNER, ADMIN, or MEMBER"),
];

const listOrgInvitesValidation = [
  query("status")
    .optional()
    .isIn(["PENDING", "ACCEPTED", "EXPIRED"])
    .withMessage("Status must be PENDING, ACCEPTED, or EXPIRED"),
];

const revokeInviteValidation = [
  param("inviteId").isMongoId().withMessage("Invalid invite ID"),
];

module.exports = { createOrgValidation, inviteValidation, organizationMemberValidation, listOrgInvitesValidation, revokeInviteValidation };

