const { body, query } = require("express-validator");

const createProjectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 100 })
    .withMessage("Project name cannot exceed 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

const listProjectsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["ACTIVE", "ARCHIVED"])
    .withMessage("Invalid project status"),
];

module.exports = {
  createProjectValidation,
  listProjectsValidation,
};
