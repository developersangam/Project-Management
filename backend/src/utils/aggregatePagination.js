export const aggregatePaginate = async ({
  model,
  pipeline = [],
  page = 1,
  limit = 20,
}) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, parseInt(limit, 10) || 20);

  const skip = (page - 1) * limit;

  const dataPipeline = [
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ];

  const countPipeline = [
    ...pipeline,
    { $count: "total" },
  ];

  const [data, totalResult] = await Promise.all([
    model.aggregate(dataPipeline),
    model.aggregate(countPipeline),
  ]);

  const total = totalResult[0]?.total || 0;
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