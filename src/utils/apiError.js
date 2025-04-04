class ApiError extends Error {

    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad request') {
        return new ApiError(400, message);
    }

    static notFound(message = 'Not found') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Conflict') {
        return new ApiError(409, message);
    }

    static internalError(message = 'An internal server error occurred') {
        return new ApiError(500, message, false);
    }

}

module.exports = ApiError;