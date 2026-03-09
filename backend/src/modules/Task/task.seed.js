const BoardColumn = require("./boardColumn.model");

const DEFAULT_COLUMNS = [
  { name: "TODO", position: 1000 },
  { name: "IN PROGRESS", position: 2000 },
  { name: "TESTING", position: 3000 },
  { name: "DONE", position: 4000 }
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