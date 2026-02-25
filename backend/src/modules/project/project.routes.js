const express = require("express");
const router = express.Router({ mergeParams: true });

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
const { requireProjectRole } = require("../../middlewares/requireProjectRole.middlewarejs");

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

router.get(
  "/",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  listProjectsValidation,
  validate,
  projectController.listProjects
);

router.post(
  "/:projectSlug/members",
  protect,
  getOrganizationBySlug,
  requireOrgMember,
  getProjectBySlug,
  requireProjectRole(["PROJECT_MANAGER"]),
  addProjectMemberValidation,
  validate,
  projectController.addProjectMember
);


// LIST projects
// router.get(
//   "/",
//   auth,
//   getOrganizationBySlug,
//   listProjectsValidation,
//   validate,
//   projectController.listProjects
// );

module.exports = router;
