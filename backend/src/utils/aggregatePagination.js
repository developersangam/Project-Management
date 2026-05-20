export const aggregatePaginate = async ({
  model,
  pipeline = [],
  page = 1,
  limit = 20,
}) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, parseInt(limit, 10) || 20);

  const skip = (page - 1) * limit;

  const result = await model.aggregate([
    ...pipeline,

    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: "total" },
        ],
      },
    },
  ]);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.total || 0;

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