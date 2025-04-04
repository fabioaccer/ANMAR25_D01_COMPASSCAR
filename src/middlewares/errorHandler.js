const ApiError = require('../utils/apiError');

function errorHandler(err, req, res, next) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            errors: [err.message]
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            errors: ['car already registered']
        });
    }

    console.error('Error:', err);
    return res.status(500).json({
        errors: ['an internal server error occurred']
    });

}

module.exports = errorHandler;