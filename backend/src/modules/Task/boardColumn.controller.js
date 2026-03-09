const { successResponse } = require("../../utils/apiResponse");
const boardColumnService = require("./boardColumn.service");

exports.getColumns = async (req, res, next) => {
  try {
    const { project } = req;

    const columns = await boardColumnService.getColumns(project._id);
    return successResponse(res, 200, "Columns retrieved successfully", columns);
  } catch (error) {
    next(error);
  }
};