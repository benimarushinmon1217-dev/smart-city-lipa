/**
 * Admin Validators
 * Input validation rules for admin routes
 */

const { body, query } = require('express-validator');

exports.updateUserValidator = [
    body('role')
        .optional()
        .isIn(['admin', 'staff', 'user'])
        .withMessage('Role must be admin, staff, or user'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean'),

    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),

    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Last name must be between 2 and 100 characters')
];

exports.verifyIncidentValidator = [
    // No body validation needed, just ID from params
];

exports.rejectIncidentValidator = [
    body('reason')
        .notEmpty()
        .withMessage('Rejection reason is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Reason must be between 10 and 500 characters')
];

exports.updateIncidentStatusValidator = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['reported', 'verified', 'responding', 'resolved', 'closed'])
        .withMessage('Invalid status'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes must not exceed 1000 characters')
];

exports.updateReportStatusValidator = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'reviewing', 'in_progress', 'resolved', 'rejected'])
        .withMessage('Invalid status'),

    body('assigned_to')
        .optional()
        .isInt()
        .withMessage('assigned_to must be a valid user ID'),

    body('resolution_notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Resolution notes must not exceed 1000 characters')
];

exports.createEmergencyAnnouncementValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5, max: 255 })
        .withMessage('Title must be between 5 and 255 characters'),

    body('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters'),

    body('type')
        .optional()
        .isIn(['general', 'emergency', 'weather', 'event', 'maintenance', 'advisory'])
        .withMessage('Invalid announcement type'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),

    body('target_audience')
        .notEmpty()
        .withMessage('Target audience is required')
        .isIn(['all', 'admin', 'staff', 'user', 'specific_barangay'])
        .withMessage('Invalid target audience'),

    body('target_barangays')
        .optional()
        .custom((value) => {
            // Allow null or undefined
            if (value === null || value === undefined) {
                return true;
            }
            if (typeof value === 'string') {
                try {
                    JSON.parse(value);
                    return true;
                } catch {
                    throw new Error('target_barangays must be valid JSON');
                }
            }
            if (Array.isArray(value)) {
                return true;
            }
            throw new Error('target_barangays must be an array or JSON string');
        })
];

exports.issueEvacuationOrderValidator = [
    body('barangayIds')
        .notEmpty()
        .withMessage('Barangay IDs are required')
        .isArray({ min: 1 })
        .withMessage('At least one barangay ID is required'),

    body('barangayIds.*')
        .isInt()
        .withMessage('Each barangay ID must be a valid integer'),

    body('reason')
        .notEmpty()
        .withMessage('Reason is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Reason must be between 10 and 500 characters'),

    body('urgency')
        .optional()
        .isIn(['low', 'medium', 'high', 'immediate'])
        .withMessage('Invalid urgency level')
];

exports.getUsersQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('role')
        .optional()
        .isIn(['admin', 'staff', 'user'])
        .withMessage('Invalid role'),

    query('is_active')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('is_active must be true or false')
];

exports.getIncidentsQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('status')
        .optional()
        .isIn(['reported', 'verified', 'responding', 'resolved', 'closed'])
        .withMessage('Invalid status'),

    query('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Invalid severity'),

    query('is_verified')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('is_verified must be true or false')
];

exports.getReportsQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('status')
        .optional()
        .isIn(['pending', 'reviewing', 'in_progress', 'resolved', 'rejected'])
        .withMessage('Invalid status'),

    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority')
];

exports.getAnalyticsQueryValidator = [
    query('timeRange')
        .optional()
        .matches(/^\d+d$/)
        .withMessage('Time range must be in format: 7d, 30d, etc.')
];
