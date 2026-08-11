/**
 * Incident Validators
 * Input validation for incident endpoints
 */

const { body, param, query } = require('express-validator');

/**
 * Validate create incident request
 */
exports.createIncidentValidator = [
    body('incident_type')
        .notEmpty().withMessage('Incident type is required')
        .isIn([
            'flood',
            'fire',
            'earthquake',
            'landslide',
            'typhoon',
            'volcanic_activity',
            'traffic_accident',
            'medical_emergency',
            'other'
        ])
        .withMessage('Invalid incident type'),

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

    body('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Invalid severity level'),

    body('barangay_id')
        .notEmpty().withMessage('Barangay ID is required')
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer'),

    body('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
        .trim(),

    body('reporter_name')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Reporter name must not exceed 100 characters')
        .trim(),

    body('reporter_contact')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Reporter contact must not exceed 20 characters')
        .trim(),

    body('affected_families')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected families must be a non-negative integer'),

    body('affected_individuals')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected individuals must be a non-negative integer'),

    body('casualties')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Casualties must be a non-negative integer'),

    body('estimated_damage')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Estimated damage must be a non-negative number'),

    body('notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Notes must not exceed 2000 characters')
        .trim()
];

/**
 * Validate update incident request
 */
exports.updateIncidentValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid incident ID'),

    body('incident_type')
        .optional()
        .isIn([
            'flood',
            'fire',
            'earthquake',
            'landslide',
            'typhoon',
            'volcanic_activity',
            'traffic_accident',
            'medical_emergency',
            'other'
        ])
        .withMessage('Invalid incident type'),

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

    body('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Invalid severity level'),

    body('status')
        .optional()
        .isIn(['reported', 'verified', 'responding', 'resolved', 'closed'])
        .withMessage('Invalid status'),

    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
        .trim(),

    body('affected_families')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected families must be a non-negative integer'),

    body('affected_individuals')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected individuals must be a non-negative integer'),

    body('casualties')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Casualties must be a non-negative integer'),

    body('estimated_damage')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Estimated damage must be a non-negative number'),

    body('resolution_notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Resolution notes must not exceed 2000 characters')
        .trim(),

    body('notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Notes must not exceed 2000 characters')
        .trim()
];

/**
 * Validate verify incident request
 */
exports.verifyIncidentValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid incident ID'),

    body('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Invalid severity level'),

    body('affected_families')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected families must be a non-negative integer'),

    body('affected_individuals')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Affected individuals must be a non-negative integer'),

    body('casualties')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Casualties must be a non-negative integer'),

    body('estimated_damage')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Estimated damage must be a non-negative number'),

    body('notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Notes must not exceed 2000 characters')
        .trim()
];

/**
 * Validate reject incident request
 */
exports.rejectIncidentValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid incident ID'),

    body('reason')
        .notEmpty().withMessage('Rejection reason is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Reason must be between 10 and 1000 characters')
        .trim()
];

/**
 * Validate get incident by ID
 */
exports.getIncidentByIdValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid incident ID')
];

/**
 * Validate delete incident
 */
exports.deleteIncidentValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid incident ID')
];

/**
 * Validate get incidents query
 */
exports.getIncidentsValidator = [
    query('incident_type')
        .optional()
        .isIn([
            'flood',
            'fire',
            'earthquake',
            'landslide',
            'typhoon',
            'volcanic_activity',
            'traffic_accident',
            'medical_emergency',
            'other'
        ])
        .withMessage('Invalid incident type'),

    query('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Invalid severity level'),

    query('status')
        .optional()
        .isIn(['reported', 'verified', 'responding', 'resolved', 'closed'])
        .withMessage('Invalid status'),

    query('barangay_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer'),

    query('is_verified')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('is_verified must be true or false'),

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
        .isIn(['created_at', 'severity', 'status', 'incident_type'])
        .withMessage('Invalid sort field'),

    query('sort_order')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('Sort order must be ASC or DESC')
];

/**
 * Validate get incident stats query
 */
exports.getIncidentStatsValidator = [
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

/**
 * Validate get live feed query
 */
exports.getLiveFeedValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];
