/**
 * Emergency Contact Routes
 * Emergency hotlines and contact information
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const emergencyContactController = require('../controllers/emergencyContactController');

// Public routes
router.get('/', optionalAuth, emergencyContactController.getAllContacts);
router.get('/active', optionalAuth, emergencyContactController.getActiveContacts);
router.get('/hotlines', optionalAuth, emergencyContactController.getEmergencyHotlines);
router.get('/stats', optionalAuth, emergencyContactController.getContactStats);
router.get('/category/:category', optionalAuth, emergencyContactController.getByCategory);
router.get('/:id', optionalAuth, emergencyContactController.getContactById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), emergencyContactController.createContact);
router.put('/:id', protect, authorize('admin'), emergencyContactController.updateContact);
router.put('/:id/deactivate', protect, authorize('admin'), emergencyContactController.deactivateContact);
router.delete('/:id', protect, authorize('admin'), emergencyContactController.deleteContact);

module.exports = router;
