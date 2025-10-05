const reqKeys = ['body', 'query', 'params', 'headers'];

export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const validationErrors = []

        for (const key of reqKeys) {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], {abortEarly: false});
                if (error) {
                    validationErrors.push(...error.details);
                }
            }
        }
        if (validationErrors.length) {
            return res.status(400).json({ message: "validation failed", error: validationErrors });
        }
        next();
    };
};