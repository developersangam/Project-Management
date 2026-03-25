const express = require("express");
const router = express.Router({ mergeParams: true });
const taskRoutes = require("../Task/task.routes");
const columnRoutes = require("../Task/boardColumn.routes");
const projectController = require("./project.controller");
const {
  createProjectValidation,
  listProjectsValidation,
    addProjectMemberValidation,
} = require("../../validations/project.validation");

const protect = require("../../middlewares/auth.middleware");
const { getOrganizationBySlug } = require("../../middlewares/getOrganizationBySlug.js");
const {requireAdmin} = require("../../middlewares/orgAdmin.middleware.js");
const { validate } = require("../../middlewares/validator.middleware.js");
const requireOrgMember = require("../../middlewares/orgMember.middleware.js");
const { getProjectBySlug } = require("../../middlewares/getProjectBySlug.middleware.js");
const { requireProjectPermission } = require("../../middlewares/requireProjectPermission.middleware.js");

// CREATE project
router.post(
  "/",
  protect,
  getOrganizationBySlug,
  requireAdmin,
  createProjectValidation,
  validate,
  projectController.createProject
);
// LIST projects
router.get(
  "/",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  listProjectsValidation,
  validate,
  projectController.listProjects
);

// ADD project member
router.post(
  "/:projectSlug/members",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("ADD_PROJECT_MEMBER"),
  addProjectMemberValidation,
  validate,
  projectController.addProjectMember
);

// REMOVE project member
router.delete(
  "/:projectSlug/members/:userId",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("REMOVE_PROJECT_MEMBER"),
  projectController.removeProjectMember
);


// CHANGE project member role
router.patch(
  "/:projectSlug/members/:userId/role",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("CHANGE_PROJECT_ROLE"),
  projectController.changeProjectMemberRole
);

// GET project members
router.get(
  "/:projectSlug/members",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("VIEW_PROJECT"),
  projectController.getProjectMembers
);

// UPDATE project
router.patch(
  "/:projectSlug",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("UPDATE_PROJECT"),
  projectController.updateProject
);

// ARCHIVE project
router.patch(
  "/:projectSlug/archive",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectPermission("ARCHIVE_PROJECT"),
  projectController.archiveProject
);

router.use("/:projectSlug/tasks", taskRoutes);
router.use("/:projectSlug/columns", columnRoutes);

module.exports = router;
