/**
 * Announcement Routes
 * System announcements and alerts
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

// Public routes
router.get('/', optionalAuth, announcementController.getAllAnnouncements);
router.get('/active', optionalAuth, announcementController.getActiveAnnouncements);
router.get('/urgent', optionalAuth, announcementController.getUrgentAnnouncements);
router.get('/type/:type', optionalAuth, announcementController.getByType);
router.get('/:id', optionalAuth, announcementController.getAnnouncementById);

// Protected routes (Admin/Staff)
router.post('/', protect, authorize('admin', 'staff'), announcementController.createAnnouncement);
router.put('/:id', protect, authorize('admin', 'staff'), announcementController.updateAnnouncement);
router.put('/:id/deactivate', protect, authorize('admin', 'staff'), announcementController.deactivateAnnouncement);
router.delete('/:id', protect, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;
