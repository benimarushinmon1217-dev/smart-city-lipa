/**
 * Incident Routes
 * Incident reporting and management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const incidentController = require('../controllers/incidentController');
const {
    createIncidentValidator,
    updateIncidentValidator,
    verifyIncidentValidator,
    rejectIncidentValidator,
    getIncidentByIdValidator,
    deleteIncidentValidator,
    getIncidentsValidator,
    getIncidentStatsValidator,
    getLiveFeedValidator
} = require('../validators/incidentValidator');
const { validate } = require('../middleware/validate');
const upload = require('../config/multer');

// Public/Optional auth routes
router.get(
    '/',
    optionalAuth,
    getIncidentsValidator,
    validate,
    incidentController.getAllIncidents
);

router.get(
    '/feed/live',
    optionalAuth,
    getLiveFeedValidator,
    validate,
    incidentController.getLiveFeed
);

router.get(
    '/stats/summary',
    protect,
    authorize('admin', 'staff'),
    getIncidentStatsValidator,
    validate,
    incidentController.getIncidentStats
);

router.get(
    '/:id',
    optionalAuth,
    getIncidentByIdValidator,
    validate,
    incidentController.getIncidentById
);

// Protected routes - Create incident with image upload
router.post(
    '/',
    protect,
    upload.array('incident_image', 5), // Allow up to 5 images
    createIncidentValidator,
    validate,
    incidentController.createIncident
);

// Protected routes - Update incident
router.put(
    '/:id',
    protect,
    authorize('admin', 'staff'),
    updateIncidentValidator,
    validate,
    incidentController.updateIncident
);

// Protected routes - Verify incident
router.post(
    '/:id/verify',
    protect,
    authorize('admin', 'staff'),
    verifyIncidentValidator,
    validate,
    incidentController.verifyIncident
);

// Protected routes - Reject incident
router.post(
    '/:id/reject',
    protect,
    authorize('admin', 'staff'),
    rejectIncidentValidator,
    validate,
    incidentController.rejectIncident
);

// Protected routes - Delete incident
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    deleteIncidentValidator,
    validate,
    incidentController.deleteIncident
);

module.exports = router;
