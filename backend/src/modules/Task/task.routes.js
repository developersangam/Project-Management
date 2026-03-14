const express = require("express");
const router = express.Router({ mergeParams: true });
const taskController = require("./task.controller");
const {
  createTaskValidator,
  getTasksValidator,
  moveTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} = require("../../validations/task.validation");
const { validate } = require("../../middlewares/validator.middleware");
const {
  requireProjectPermission,
} = require("../../middlewares/requireProjectPermission.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  getOrganizationBySlug,
} = require("../../middlewares/getOrganizationBySlug");
const {
  getProjectBySlug,
} = require("../../middlewares/getProjectBySlug.middleware");
const {
  requireProjectMember,
} = require("../../middlewares/requireProjectMember.middleware");

router.post(
  "/",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectPermission("CREATE_TASK"),
  createTaskValidator,
  validate,
  taskController.createTask,
);

router.get(
  "/",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  getTasksValidator,
  validate,
  taskController.getTasks,
);

router.patch(
  "/:taskId/move",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  requireProjectPermission("MOVE_TASK"),
  moveTaskValidator,
  validate,
  taskController.moveTask,
);

router.patch(
  "/:taskId",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  updateTaskValidator,
  validate,
  taskController.updateTask
);

router.delete(
  "/:taskId",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  deleteTaskValidator,
  validate,
  taskController.deleteTask
);

module.exports = router;
