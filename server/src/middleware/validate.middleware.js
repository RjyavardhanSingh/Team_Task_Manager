export const validate = (schema, source = 'body') => {
    return async (req, res, next) => {
        try {

            req[source] = await schema.parseAsync(req[source]);
            next();
        } catch (error) {
            const zodIssues = error.issues || error.errors || [];
            const errors = Array.isArray(zodIssues)
                ? zodIssues.map((err) => ({
                    field: Array.isArray(err.path) ? err.path.join('.') : 'unknown',
                    message: err.message,
                }))
                : [{ field: 'unknown', message: 'Validation failed' }];

            return res.status(400).json({
                success: false,
                message: 'Invalid request data',
                errors
            });
        }
    };
};
