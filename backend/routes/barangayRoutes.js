/**
 * Barangay Routes
 * Barangay management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const barangayController = require('../controllers/barangayController');

// Public routes
router.get('/', optionalAuth, barangayController.getAllBarangays);
router.get('/risk/high', optionalAuth, barangayController.getHighRiskBarangays);
router.get('/:id', optionalAuth, barangayController.getBarangayById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), barangayController.createBarangay);
router.put('/:id', protect, authorize('admin'), barangayController.updateBarangay);
router.delete('/:id', protect, authorize('admin'), barangayController.deleteBarangay);

module.exports = router;
