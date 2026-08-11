/**
 * Standardized API Response Utility
 * Consistent response format across all endpoints
 */

class ApiResponse {
    /**
     * Success response
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Error response
     */
    static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Validation error response
     */
    static validationError(res, errors) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Access forbidden') {
        return res.status(403).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Not found response
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Paginated response
     */
    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                totalPages: Math.ceil(pagination.total / pagination.limit)
            },
            timestamp: new Date().toISOString()
        });
    }
}

// Export class
module.exports = ApiResponse;

// Export convenience functions for backward compatibility
module.exports.successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    return ApiResponse.success(res, data, message, statusCode);
};

module.exports.errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
    return ApiResponse.error(res, message, statusCode, errors);
};
