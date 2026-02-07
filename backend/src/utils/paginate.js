export const paginate = async ({
  model,
  filter = {},
  page = 1,
  limit = 20,
  sort = { createdAt: -1 },
  populate = [],
}) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, parseInt(limit, 10) || 20);
  
  const skip = (page - 1) * limit;

  const query = model.find(filter).sort(sort).skip(skip).limit(limit);

  populate.forEach((p) => query.populate(p));

  const [data, total] = await Promise.all([
    query,
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
