const { AppError } = require("../../utils/AppError");
const BoardColumn = require("./boardColumn.model");
const Task = require("../Task/task.model");

const getColumns = async (projectId) => {
  const columns = await BoardColumn.find({
    projectId,
    isDeleted: false,
  })
    .sort({ position: 1 })
    .lean();

  return columns;
};

const createColumn = async ({ projectId, name, position }) => {
  if (!position) {
    const lastColumn = await BoardColumn.findOne({
      projectId,
      isDeleted: false,
    })
      .sort({ position: -1 })
      .select("position")
      .lean();

    position = lastColumn ? lastColumn.position + 1 : 1;
  } else {
    // Step 1: move to safe range
    await BoardColumn.updateMany(
      { projectId, position: { $gte: position }, isDeleted: false },
      { $inc: { position: 1000 } },
    );

    // Step 2: shift back by +1
    await BoardColumn.updateMany(
      { projectId, position: { $gte: position + 1000 }, isDeleted: false },
      { $inc: { position: -999 } },
    );
  }

  return BoardColumn.create({
    projectId,
    name,
    position,
  });
};

const updateColumn = async ({ columnId, projectId, name }) => {
  const column = await BoardColumn.findOneAndUpdate(
    {
      _id: columnId,
      projectId,
      isDeleted: false,
    },
    {
      name,
    },
    {
      new: true,
    },
  );

  if (!column) {
    throw new AppError(404, "Column not found");
  }

  return column;
};

const deleteColumn = async ({ columnId, projectId }) => {
  const taskCount = await Task.countDocuments({
    columnId,
    isDeleted: false,
  });

  if (taskCount > 0) {
    throw new AppError(400, "Cannot delete column with tasks");
  }
  const column = await BoardColumn.findOneAndUpdate(
    {
      _id: columnId,
      projectId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!column) {
    throw new AppError(404, "Column not found");
  }

  return column;
};

module.exports = {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
};
