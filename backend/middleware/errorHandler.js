/**
 * Global Error Handler Middleware
 * Centralized error handling
 */

const logger = require('../utils/logger');
const ApiResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return ApiResponse.validationError(res, errors);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0].path;
        return ApiResponse.error(res, `${field} already exists`, 409);
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return ApiResponse.error(res, 'Invalid reference to related resource', 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ApiResponse.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Token expired');
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return ApiResponse.error(res, 'File size too large', 400);
        }
        return ApiResponse.error(res, err.message, 400);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
