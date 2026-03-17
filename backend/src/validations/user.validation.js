const { body } = require("express-validator");

const registerValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body('userName').notEmpty().withMessage("Username is required").bail(),
  body("email").notEmpty().withMessage("Email is required").bail()
  .isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required").bail()
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
];

module.exports = { registerValidation, loginValidation };