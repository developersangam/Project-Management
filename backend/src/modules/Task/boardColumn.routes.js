const express = require("express");
const router = express.Router({ mergeParams: true });


const boardColumnController = require("./boardColumn.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware");
const {getOrganizationBySlug} = require("../../middlewares/getOrganizationBySlug.js");
const {getProjectBySlug} = require("../../middlewares/getProjectBySlug.middleware.js");
const {requireProjectMember} = require("../../middlewares/requireProjectMember.middleware.js");
const { requireProjectPermission } = require("../../middlewares/requireProjectPermission.middleware.js");
const { validate } = require("../../middlewares/validator.middleware.js");
const { createColumnValidator,updateColumnValidator, deleteColumnValidator } = require("../../validations/boardColumn.validation.js");

router.get(
  "/",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  boardColumnController.getColumns
);

router.post(
  "/",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectPermission("UPDATE_PROJECT"),
  createColumnValidator,
  validate,
  boardColumnController.createColumn
);


router.patch(
  "/:columnId",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectPermission("UPDATE_PROJECT"),
  updateColumnValidator,
  validate,
  boardColumnController.updateColumn
);

router.delete(
  "/:columnId",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectPermission("UPDATE_PROJECT"),
  deleteColumnValidator,
  validate,
  boardColumnController.deleteColumn
);

module.exports = router;