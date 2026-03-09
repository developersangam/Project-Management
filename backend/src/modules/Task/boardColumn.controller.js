const { successResponse } = require("../../utils/apiResponse");
const boardColumnService = require("./boardColumn.service");

const getColumns = async (req, res, next) => {
  try {
    const { project } = req;

    const columns = await boardColumnService.getColumns(project._id);
    return successResponse(res, 200, "Columns retrieved successfully", columns);
  } catch (error) {
    next(error);
  }
};

const createColumn = async (req, res, next) => {
  try {
    const { project } = req;
    const { name, position } = req.body;

    const column = await boardColumnService.createColumn({
      projectId: project._id,
      name,
      position
    });
    return successResponse(res, 201, "Column created successfully", column);
  } catch (error) {
    next(error);
  }
};

const updateColumn = async (req, res, next) => {
  try {
    const { project } = req;
    const { columnId } = req.params;
    const { name } = req.body;

    const column = await boardColumnService.updateColumn({
      columnId,
      projectId: project._id,
      name
    });

    return successResponse(
      res,
      200,
      "Column updated successfully",
      column
    );
  } catch (error) {
    next(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const { project } = req;
    const { columnId } = req.params;

    await boardColumnService.deleteColumn({
      columnId,
      projectId: project._id
    });

    return successResponse(
      res,
      200,
      "Column deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createColumn,
  getColumns,
  updateColumn,
  deleteColumn
};