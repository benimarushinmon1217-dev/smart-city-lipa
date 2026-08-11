/**
 * AI Validators
 * Input validation for AI endpoints
 */

const { body, param, query } = require('express-validator');

/**
 * Validate chatbot request
 */
exports.chatbotValidator = [
    body('question')
        .notEmpty().withMessage('Question is required')
        .isLength({ min: 3, max: 500 })
        .withMessage('Question must be between 3 and 500 characters')
        .trim(),

    body('hazard_data')
        .optional()
        .isObject()
        .withMessage('Hazard data must be an object'),

    body('hazard_data.flood_risk')
        .optional()
        .isString()
        .withMessage('Flood risk must be a string'),

    body('hazard_data.ashfall_risk')
        .optional()
        .isString()
        .withMessage('Ashfall risk must be a string'),

    body('hazard_data.wind_direction')
        .optional()
        .isString()
        .withMessage('Wind direction must be a string'),

    body('hazard_data.barangay_name')
        .optional()
        .isString()
        .withMessage('Barangay name must be a string')
];

/**
 * Validate chatbot suggestions request
 */
exports.chatbotSuggestionsValidator = [
    body('hazard_data')
        .optional()
        .isObject()
        .withMessage('Hazard data must be an object')
];

/**
 * Validate analyze risk request
 */
exports.analyzeRiskValidator = [
    body('latitude')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('longitude')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('risk_score')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Risk score must be between 0 and 1'),

    body('q50')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Q50 must be between 0 and 1'),

    body('q80')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Q80 must be between 0 and 1'),

    body('flood_risk')
        .optional()
        .isString()
        .withMessage('Flood risk must be a string'),

    body('ashfall_risk')
        .optional()
        .isString()
        .withMessage('Ashfall risk must be a string'),

    body('elevation')
        .optional()
        .isNumeric()
        .withMessage('Elevation must be a number'),

    body('distance_to_volcano')
        .optional()
        .isNumeric()
        .withMessage('Distance to volcano must be a number')
];

/**
 * Validate analyze barangay risk request
 */
exports.analyzeBarangayRiskValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid barangay ID')
];

/**
 * Validate multi-hazard analysis request
 */
exports.multiHazardAnalysisValidator = [
    body('hazard_data')
        .notEmpty().withMessage('Hazard data is required')
        .isObject()
        .withMessage('Hazard data must be an object'),

    body('hazard_data.flood_risk')
        .optional()
        .isString()
        .withMessage('Flood risk must be a string'),

    body('hazard_data.ashfall_risk')
        .optional()
        .isString()
        .withMessage('Ashfall risk must be a string')
];

/**
 * Validate route recommendation request
 */
exports.routeRecommendationValidator = [
    body('origin')
        .notEmpty().withMessage('Origin is required')
        .isObject()
        .withMessage('Origin must be an object with lat/lng'),

    body('origin.lat')
        .notEmpty().withMessage('Origin latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Origin latitude must be between -90 and 90'),

    body('origin.lng')
        .notEmpty().withMessage('Origin longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Origin longitude must be between -180 and 180'),

    body('destination')
        .notEmpty().withMessage('Destination is required')
        .isObject()
        .withMessage('Destination must be an object with lat/lng'),

    body('destination.lat')
        .notEmpty().withMessage('Destination latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Destination latitude must be between -90 and 90'),

    body('destination.lng')
        .notEmpty().withMessage('Destination longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Destination longitude must be between -180 and 180'),

    body('flood_risk')
        .optional()
        .isString()
        .withMessage('Flood risk must be a string'),

    body('ashfall_risk')
        .optional()
        .isString()
        .withMessage('Ashfall risk must be a string'),

    body('wind_direction')
        .optional()
        .isString()
        .withMessage('Wind direction must be a string'),

    body('avoid_high_risk')
        .optional()
        .isBoolean()
        .withMessage('Avoid high risk must be a boolean')
];

/**
 * Validate find evacuation center request
 */
exports.findEvacuationCenterValidator = [
    body('latitude')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('longitude')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('barangay_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Barangay ID must be a valid integer')
];

/**
 * Validate route hazard score request
 */
exports.routeHazardScoreValidator = [
    body('route_points')
        .notEmpty().withMessage('Route points are required')
        .isArray({ min: 1 })
        .withMessage('Route points must be a non-empty array'),

    body('route_points.*.lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Each point must have valid latitude'),

    body('route_points.*.lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Each point must have valid longitude'),

    body('hazard_data')
        .optional()
        .isObject()
        .withMessage('Hazard data must be an object')
];

/**
 * Validate check route incidents request
 */
exports.checkRouteIncidentsValidator = [
    body('barangay_ids')
        .notEmpty().withMessage('Barangay IDs are required')
        .isArray({ min: 1 })
        .withMessage('Barangay IDs must be a non-empty array'),

    body('barangay_ids.*')
        .isInt({ min: 1 })
        .withMessage('Each barangay ID must be a valid integer')
];
