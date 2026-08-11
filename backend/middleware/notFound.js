/**
 * 404 Not Found Middleware
 * Handle undefined routes
 */

const ApiResponse = require('../utils/response');

const notFound = (req, res, next) => {
    ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = notFound;
