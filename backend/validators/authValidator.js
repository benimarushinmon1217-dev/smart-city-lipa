/**
 * Authentication Validators
 * Input validation rules for authentication routes
 */

const { body } = require('express-validator');

exports.registerValidator = [
    body('first_name')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters'),

    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('phone')
        .optional()
        .matches(/^[0-9+\-\s()]*$/).withMessage('Please provide a valid phone number'),

    body('barangay')
        .optional()
        .trim()
];

exports.loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
];

exports.changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.updateProfileValidator = [
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters'),

    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters'),

    body('phone')
        .optional()
        .matches(/^[0-9+\-\s()]*$/).withMessage('Please provide a valid phone number'),

    body('address')
        .optional()
        .trim(),

    body('barangay')
        .optional()
        .trim()
];
