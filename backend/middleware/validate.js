/**
 * Validation Middleware
 * Express-validator wrapper
 */

const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

/**
 * Validate request based on validation rules
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('❌ [Validation] Validation failed');
        console.error('❌ [Validation] Request body:', req.body);
        console.error('❌ [Validation] Errors:', errors.array());

        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));

        console.error('❌ [Validation] Formatted errors:', formattedErrors);
        return ApiResponse.validationError(res, formattedErrors);
    }

    console.log('✅ [Validation] Validation passed');
    next();
};

module.exports = validate;
module.exports.validate = validate;
