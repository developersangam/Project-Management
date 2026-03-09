const { body, param } = require("express-validator");

const createColumnValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Column name is required")
    .isLength({ max: 100 })
    .withMessage("Column name must be less than 100 characters"),
];

const updateColumnValidator = [
  param("columnId").isMongoId().withMessage("Invalid column id"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Column name is required")
    .isLength({ max: 100 })
    .withMessage("Column name cannot exceed 100 characters"),
];

const deleteColumnValidator = [
  param("columnId")
    .isMongoId()
    .withMessage("Invalid column id")
];

module.exports = {
  createColumnValidator,
  updateColumnValidator,
    deleteColumnValidator
};
