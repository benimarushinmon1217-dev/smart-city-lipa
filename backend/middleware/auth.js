/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const jwtConfig = require('../config/jwt');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return ApiResponse.unauthorized(res, 'Not authorized to access this route');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Get user from database
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return ApiResponse.unauthorized(res, 'User not found');
        }

        if (!user.is_active) {
            return ApiResponse.forbidden(res, 'Account is deactivated');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.unauthorized(res, 'Token expired');
        }
        return ApiResponse.unauthorized(res, 'Invalid token');
    }
});

/**
 * Role-based access control
 * @param {...string} roles - Allowed roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ApiResponse.unauthorized(res, 'User not authenticated');
        }

        if (!roles.includes(req.user.role)) {
            return ApiResponse.forbidden(
                res,
                `Role '${req.user.role}' is not authorized to access this route`
            );
        }

        next();
    };
};

/**
 * Optional authentication - Attach user if token exists
 */
exports.optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtConfig.secret);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (user && user.is_active) {
                req.user = user;
            }
        } catch (error) {
            // Continue without user
        }
    }

    next();
});
