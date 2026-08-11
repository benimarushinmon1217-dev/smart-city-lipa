/**
 * Report Routes
 * User report submission and management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const reportController = require('../controllers/reportController');
const {
    createReportValidator,
    updateReportValidator,
    assignReportValidator,
    resolveReportValidator,
    rejectReportValidator,
    getReportByIdValidator,
    deleteReportValidator,
    getReportsValidator,
    getReportStatsValidator
} = require('../validators/reportValidator');
const { validate } = require('../middleware/validate');
const upload = require('../config/multer');

// All routes require authentication
router.use(protect);

// Get all reports
router.get(
    '/',
    getReportsValidator,
    validate,
    reportController.getAllReports
);

// Get report statistics
router.get(
    '/stats/summary',
    authorize('admin', 'staff'),
    getReportStatsValidator,
    validate,
    reportController.getReportStats
);

// Get report by ID
router.get(
    '/:id',
    getReportByIdValidator,
    validate,
    reportController.getReportById
);

// Create report with image upload
router.post(
    '/',
    upload.array('report_image', 5), // Allow up to 5 images
    createReportValidator,
    validate,
    reportController.createReport
);

// Update report
router.put(
    '/:id',
    updateReportValidator,
    validate,
    reportController.updateReport
);

// Assign report to staff
router.post(
    '/:id/assign',
    authorize('admin', 'staff'),
    assignReportValidator,
    validate,
    reportController.assignReport
);

// Verify report
router.post(
    '/:id/verify',
    authorize('admin', 'staff'),
    reportController.verifyReport
);

// Resolve report
router.post(
    '/:id/resolve',
    authorize('admin', 'staff'),
    resolveReportValidator,
    validate,
    reportController.resolveReport
);

// Reject report
router.post(
    '/:id/reject',
    authorize('admin', 'staff'),
    rejectReportValidator,
    validate,
    reportController.rejectReport
);

// Delete report
router.delete(
    '/:id',
    deleteReportValidator,
    validate,
    reportController.deleteReport
);

module.exports = router;
