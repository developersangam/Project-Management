const Task = require("./task.model");
const BoardColumn = require("./boardColumn.model");
const { AppError } = require("../../utils/AppError");
const {
  buildNextCursor,
  buildCursorQuery,
} = require("../../utils/cursorPagination");

const createTask = async ({
  title,
  description,
  projectId,
  organizationId,
  priority,
  assigneeId,
  dueDate,
  createdBy,
}) => {
  // 1️⃣ find first column
  const firstColumn = await BoardColumn.findOne({
    projectId,
    isDeleted: false,
  })
    .sort({ position: 1 })
    .select("_id")
    .lean();

  if (!firstColumn) {
    throw new AppError(400, "No board column found for project");
  }

  const columnId = firstColumn._id;

  // 2️⃣ find last task position in column
  const lastTask = await Task.findOne({
    columnId,
    projectId,
    isDeleted: false,
  })
    .sort({ position: -1 })
    .select("position")
    .lean();

  const position = lastTask ? lastTask.position + 1 : 1;

  // 3️⃣ create task
  const task = await Task.create({
    title,
    description,
    columnId,
    projectId,
    organizationId,
    priority,
    assigneeId,
    dueDate,
    createdBy,
    position,
  });

  return task;
};

const getTasks = async ({ projectId, query }) => {
  const { view, limit = 20, cursorCreatedAt, cursorId } = query;
  console.log("Fetching tasks with query:", query);

  // BOARD VIEW
  if (view === "board") {
    const columns = await BoardColumn.find({ projectId, isDeleted: false })
      .sort({ position: 1 })
      .lean();

    const tasks = await Task.find({ projectId, isDeleted: false })
      .sort({ position: 1 })
      .lean();

    const columnMap = {};

    columns.forEach((col) => {
      columnMap[col._id] = {
        column: col,
        tasks: [],
      };
    });

    tasks.forEach((task) => {
      if (columnMap[task.columnId]) {
        columnMap[task.columnId].tasks.push(task);
      }
    });

    return Object.values(columnMap);
  }

  // LIST VIEW WITH CURSOR PAGINATION

  const baseQuery = {
    projectId,
    isDeleted: false,
  };

  const finalQuery = buildCursorQuery({
    query: baseQuery,
    cursorCreatedAt,
    cursorId,
    sortOrder: -1,
  });

  const tasks = await Task.find(finalQuery)
    .sort({ createdAt: -1, _id: -1 })
    .limit(Number(limit) + 1)
    .populate({
      path: "columnId",
      select: "name position",
    })
    .populate({
      path: "assigneeId",
      select: "name email firstName lastName",
    })
    .lean();

  const { data, nextCursor } = buildNextCursor(tasks, Number(limit));

  return {
    tasks: data,
    nextCursor,
  };
};

const moveTask = async ({ taskId, columnId, session }) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // 1️⃣ Find Task
  const task = await Task.findById(taskId).session(session);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // 2️⃣ Find Column
  const column = await BoardColumn.findById(columnId).session(session);

  if (!column) {
    throw new AppError("Column not found", 404);
  }

  // 3️⃣ Project Safety Check
  if (task.projectId.toString() !== column.projectId.toString()) {
    throw new AppError("Task and column belong to different projects", 400);
  }

  // 4️⃣ Find Last Task in Target Column
  const lastTask = await Task.findOne({
    columnId,
    isDeleted: false,
  })
    .sort({ position: -1 })
    .select("position")
    .session(session);

  let newPosition = 1000;

  if (lastTask) {
    newPosition = lastTask.position + 1000;
  }

  // 5️⃣ Update Task
  task.columnId = columnId;
  task.position = newPosition;

  await task.save({ session });
  return task;
};

const updateTask = async ({ taskId, projectId, data }) => {
  const task = await Task.findOne({
    _id: taskId,
    projectId,
    isDeleted: false,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }

  if (data.description !== undefined) {
    task.description = data.description;
  }

  if (data.assigneeId !== undefined) {
    if (data.assigneeId === null) {
      task.assigneeId = null;
    } else {
      const isMember = await ProjectMember.exists({
        projectId,
        userId: data.assigneeId,
      });

      if (!isMember) {
        throw new AppError("User is not a project member", 400);
      }

      task.assigneeId = data.assigneeId;
    }
  }

  if (data.priority !== undefined) {
    task.priority = data.priority;
  }

  if (data.dueDate !== undefined) {
    task.dueDate = data.dueDate;
  }

  await task.save();

  return task;
};


const deleteTask = async ({ taskId, projectId }) => {

  const task = await Task.findOne({
    _id: taskId,
    projectId,
    isDeleted: false
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  task.isDeleted = true;

  await task.save();

  return;
};

module.exports = {
  createTask,
  getTasks,
  moveTask,
  updateTask,
  deleteTask
};
