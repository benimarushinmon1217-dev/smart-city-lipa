/**
 * Report Validators
 * Input validation for report endpoints
 */

const { body, param, query } = require('express-validator');

/**
 * Validate create report request
 */
exports.createReportValidator = [
    body('report_type')
        .trim()
        .notEmpty().withMessage('Report type is required')
        .isIn([
            'flood',
            'road_damage',
            'road_blockage',
            'street_light',
            'garbage',
            'water_supply',
            'noise_complaint',
            'illegal_activity',
            'hazard',
            'hazard_report',
            'infrastructure',
            'infrastructure_issue',
            'other'
        ])
        .withMessage('Invalid report type'),

    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 255 })
        .withMessage('Title must be between 5 and 255 characters')
        .trim(),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters')
        .trim(),

    body('barangay_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer'),

    body('location')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Location must not exceed 255 characters')
        .trim(),

    body('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority level'),

    body('is_anonymous')
        .optional()
        .isBoolean()
        .withMessage('is_anonymous must be a boolean'),

    body('contact_number')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Contact number must not exceed 20 characters')
        .trim()
];

/**
 * Validate update report request
 */
exports.updateReportValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID'),

    body('title')
        .optional()
        .isLength({ min: 5, max: 255 })
        .withMessage('Title must be between 5 and 255 characters')
        .trim(),

    body('description')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters')
        .trim(),

    body('location')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Location must not exceed 255 characters')
        .trim(),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority level'),

    body('status')
        .optional()
        .isIn(['pending', 'verified', 'reviewing', 'in_progress', 'resolved', 'rejected'])
        .withMessage('Invalid status'),

    body('resolution_notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Resolution notes must not exceed 2000 characters')
        .trim()
];

/**
 * Validate assign report request
 */
exports.assignReportValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID'),

    body('assigned_to')
        .notEmpty().withMessage('Assigned user ID is required')
        .isInt({ min: 1 })
        .withMessage('Assigned user ID must be a valid integer')
];

/**
 * Validate resolve report request
 */
exports.resolveReportValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID'),

    body('resolution_notes')
        .notEmpty().withMessage('Resolution notes are required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Resolution notes must be between 10 and 2000 characters')
        .trim()
];

/**
 * Validate reject report request
 */
exports.rejectReportValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID'),

    body('reason')
        .notEmpty().withMessage('Rejection reason is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Reason must be between 10 and 1000 characters')
        .trim()
];

/**
 * Validate get report by ID
 */
exports.getReportByIdValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID')
];

/**
 * Validate delete report
 */
exports.deleteReportValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid report ID')
];

/**
 * Validate get reports query
 */
exports.getReportsValidator = [
    query('report_type')
        .optional()
        .isIn([
            'flood',
            'road_damage',
            'road_blockage',
            'street_light',
            'garbage',
            'water_supply',
            'noise_complaint',
            'illegal_activity',
            'hazard',
            'hazard_report',
            'infrastructure',
            'infrastructure_issue',
            'other'
        ])
        .withMessage('Invalid report type'),

    query('status')
        .optional()
        .isIn(['pending', 'verified', 'reviewing', 'in_progress', 'resolved', 'rejected'])
        .withMessage('Invalid status'),

    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority level'),

    query('barangay_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sort_by')
        .optional()
        .isIn(['created_at', 'priority', 'status', 'report_type'])
        .withMessage('Invalid sort field'),

    query('sort_order')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('Sort order must be ASC or DESC')
];

/**
 * Validate get report stats query
 */
exports.getReportStatsValidator = [
    query('barangay_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer'),

    query('start_date')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),

    query('end_date')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date')
];
