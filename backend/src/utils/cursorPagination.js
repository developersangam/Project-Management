const buildCursorQuery = ({ query = {}, cursorCreatedAt, cursorId, sortOrder = 1 }) => {
  if (!cursorCreatedAt || !cursorId) return query;

  const operator = sortOrder === 1 ? "$gt" : "$lt";

  return {
    ...query,
    $or: [
      { createdAt: { [operator]: new Date(cursorCreatedAt) } },
      {
        createdAt: new Date(cursorCreatedAt),
        _id: { [operator]: cursorId }
      }
    ]
  };
};

const buildNextCursor = (items, limit) => {
  let hasMore = false;

  if (items.length > limit) {
    hasMore = true;
    items.pop();
  }

  const nextCursor = hasMore
    ? {
        cursorCreatedAt: items[items.length - 1].createdAt,
        cursorId: items[items.length - 1]._id
      }
    : null;

  return {
    data: items,
    nextCursor
  };
};

module.exports = {
  buildCursorQuery,
  buildNextCursor
};