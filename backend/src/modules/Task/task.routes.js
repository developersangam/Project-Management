const express = require("express");
const taskController = require("./task.controller");

const router = express.Router({ mergeParams: true });

router.get("/", taskController.getTasks);

router.post("/", taskController.createTask);

router.get("/:taskId", taskController.getTask);

router.patch("/:taskId", taskController.updateTask);

router.patch("/:taskId/move", taskController.moveTask);

module.exports = router;