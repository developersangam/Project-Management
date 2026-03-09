const BoardColumn = require("./boardColumn.model");

const getColumns = async (projectId) => {
  const columns = await BoardColumn.find({
    projectId,
    isDeleted: false,
  })
    .sort({ position: 1 })
    .lean();

  return columns;
};

module.exports = {
  getColumns,
};