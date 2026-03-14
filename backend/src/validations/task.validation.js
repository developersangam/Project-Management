const { body,query, param } = require("express-validator");
const { TASK_PRIORITY } = require("../constant/task.constant");

exports.createTaskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 200 }),

  body("description")
    .optional()
    .isString(),

  body("priority")
    .optional()
    .isIn(Object.values(TASK_PRIORITY)),

  body("assigneeId")
    .optional()
    .isMongoId(),

  body("dueDate")
    .optional()
    .isISO8601()
];

exports.getTasksValidator = [
  query("view")
    .optional()
    .isIn(["board", "list"])
    .withMessage("Invalid view type"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }),

  query("cursor")
    .optional()
    .isString(),

  query("assigneeId")
    .optional()
    .isMongoId(),

  query("priority")
    .optional()
    .isString()
];

exports.updateTaskValidator = [
  body("title")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be less than 200 characters"),

  body("description")
    .optional()
    .isString(),

  body("assigneeId")
    .optional()
    .isMongoId()
    .withMessage("Invalid assigneeId"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid dueDate"),
];

exports.moveTaskValidator = [
  body("columnId")
    .isMongoId()
    .withMessage("Invalid columnId")
];

exports.deleteTaskValidator = [
  param("taskId")
    .isMongoId()
    .withMessage("Invalid taskId")
];