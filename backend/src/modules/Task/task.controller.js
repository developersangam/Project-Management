const taskService = require("./task.service");
const { successResponse } = require("../../utils/apiResponse");
const { default: mongoose } = require("mongoose");

const createTask = async (req, res, next) => {
  console.log("Creating task with data:", req.body);
  try {
    const { project, organization, user } = req;

    const { title, description, priority, assigneeId, dueDate } = req.body;

    const task = await taskService.createTask({
      title,
      description,
      projectId: project._id,
      organizationId: organization._id,
      priority,
      assigneeId,
      dueDate,
      createdBy: user._id,
    });

    return successResponse(res, 201, "Task created successfully", task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { project } = req;

    const data = await taskService.getTasks({
      projectId: project._id,
      query: req.query,
    });

    return successResponse(res, 200, "Tasks fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { taskId } = req.params;
    const { columnId } = req.body;
    let task;
    await session.withTransaction(async () => {
      task = await taskService.moveTask({
        taskId,
        columnId,
        session,
      });
    });
    return successResponse(res, 200, "Task moved successfully", task);
  } catch (error) {
    session.endSession();
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {

    const { taskId } = req.params;
    const { project } = req;

    const task = await taskService.updateTask({
      taskId,
      projectId: project._id,
      data: req.body
    });

    return successResponse(res, 200, "Task updated successfully", task);

  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {

    const { taskId } = req.params;
    const { project } = req;

    await taskService.deleteTask({
      taskId,
      projectId: project._id
    });

    return successResponse(res, 200, "Task deleted successfully");

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  moveTask,
  updateTask,
  deleteTask
};
