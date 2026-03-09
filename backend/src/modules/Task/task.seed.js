const BoardColumn = require("./boardColumn.model");

const DEFAULT_COLUMNS = [
  { name: "TODO", position: 1 },
  { name: "IN PROGRESS", position: 2 },
  { name: "TESTING", position: 3 },
  { name: "DONE", position: 4 }
];

const seedDefaultColumns = async (projectId) => {

  const columns = DEFAULT_COLUMNS.map((col) => ({
    ...col,
    projectId,
  }));

  await BoardColumn.insertMany(columns);
};

module.exports = {
  seedDefaultColumns
};