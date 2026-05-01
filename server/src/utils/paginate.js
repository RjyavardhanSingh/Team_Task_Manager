const paginate = async (model, query = {}, options = {}) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await model.countDocuments(query);
    const data = await model.find(query).skip(skip).limit(limit).sort(options.sort || { createdAt: -1 });
    
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            totalRecords: total,
            currentPage: page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
};

export { paginate };