const express = require("express");
const router = express.Router({ mergeParams: true });


const boardColumnController = require("./boardColumn.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware");
const {getOrganizationBySlug} = require("../../middlewares/getOrganizationBySlug.js");
const {getProjectBySlug} = require("../../middlewares/getProjectBySlug.middleware.js");
const {requireProjectMember} = require("../../middlewares/requireProjectMember.middleware.js");

router.get(
  "/",
  authMiddleware,
  getOrganizationBySlug,
  getProjectBySlug,
  requireProjectMember,
  boardColumnController.getColumns
);

module.exports = router;