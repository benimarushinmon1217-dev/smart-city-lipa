/**
 * Admin Routes
 * Admin dashboard and management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const adminController = require('../controllers/adminController');
const {
    updateUserValidator,
    rejectIncidentValidator,
    updateIncidentStatusValidator,
    updateReportStatusValidator,
    createEmergencyAnnouncementValidator,
    issueEvacuationOrderValidator,
    getUsersQueryValidator,
    getIncidentsQueryValidator,
    getReportsQueryValidator,
    getAnalyticsQueryValidator
} = require('../validators/adminValidator');

// All routes require authentication
router.use(protect);

// Dashboard (Admin only)
router.get('/dashboard', authorize('admin'), adminController.getDashboard);

// User Management (Admin only)
router.get('/users', authorize('admin'), getUsersQueryValidator, validate, adminController.getUsers);
router.put('/users/:id', authorize('admin'), updateUserValidator, validate, adminController.updateUser);
router.put('/users/:id/activate', authorize('admin'), adminController.activateUser);
router.put('/users/:id/deactivate', authorize('admin'), adminController.deactivateUser);
router.delete('/users/:id', authorize('admin'), adminController.deleteUser);

// Incident Management (Admin & Staff)
router.get('/incidents', authorize('admin', 'staff'), getIncidentsQueryValidator, validate, adminController.getIncidents);
router.put('/incidents/:id/verify', authorize('admin', 'staff'), adminController.verifyIncident);
router.put('/incidents/:id/reject', authorize('admin', 'staff'), rejectIncidentValidator, validate, adminController.rejectIncident);
router.put('/incidents/:id/status', authorize('admin', 'staff'), updateIncidentStatusValidator, validate, adminController.updateIncidentStatus);

// Report Management (Admin & Staff)
router.get('/reports', authorize('admin', 'staff'), getReportsQueryValidator, validate, adminController.getReports);
router.put('/reports/:id/status', authorize('admin', 'staff'), updateReportStatusValidator, validate, adminController.updateReportStatus);

// Emergency Management (Admin only)
router.post('/announcements/emergency', authorize('admin'), createEmergencyAnnouncementValidator, validate, adminController.createEmergencyAnnouncement);
router.post('/evacuation-order', authorize('admin'), issueEvacuationOrderValidator, validate, adminController.issueEvacuationOrder);
router.post('/alerts/send', authorize('admin'), createEmergencyAnnouncementValidator, validate, adminController.createEmergencyAnnouncement); // Alias for emergency announcement

// Analytics (Admin only)
router.get('/analytics', authorize('admin'), getAnalyticsQueryValidator, validate, adminController.getAnalytics);

module.exports = router;
