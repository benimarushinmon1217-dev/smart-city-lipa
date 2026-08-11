/**
 * Rate Limiting Middleware
 * Prevent abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        ApiResponse.error(res, 'Too many requests, please try again later', 429);
    }
});

// Strict limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 1000 : 5, // 1000 in dev, 5 in production
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts, please try again later',
    handler: (req, res) => {
        ApiResponse.error(res, 'Too many login attempts, please try again after 15 minutes', 429);
    }
});

// Upload limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many uploads, please try again later',
    handler: (req, res) => {
        ApiResponse.error(res, 'Upload limit exceeded, please try again later', 429);
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter
};
