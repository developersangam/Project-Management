const { body } = require("express-validator");

const createOrgValidation = [
  body("name").notEmpty().withMessage("Organization name is required"),
];

const inviteValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("role")
    .isIn(["MEMBER", "PROJECT_MANAGER"])
    .withMessage("Role must be MEMBER or PROJECT_MANAGER"),
];


module.exports = { createOrgValidation, inviteValidation };