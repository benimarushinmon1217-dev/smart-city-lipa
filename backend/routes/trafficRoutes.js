/**
 * Traffic Routes
 * Traffic monitoring data endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const trafficController = require('../controllers/trafficController');

// Public routes
router.get('/', optionalAuth, trafficController.getAllTrafficData);
router.get('/hotspots', optionalAuth, trafficController.getTrafficHotspots);
router.get('/stats', optionalAuth, trafficController.getTrafficStats);
router.get('/barangay/:id/latest', optionalAuth, trafficController.getLatestByBarangay);
router.get('/:id', optionalAuth, trafficController.getTrafficById);

// Protected routes (Staff/Admin)
router.post('/', protect, authorize('admin', 'staff'), trafficController.createTrafficData);
router.put('/:id', protect, authorize('admin', 'staff'), trafficController.updateTrafficData);
router.delete('/:id', protect, authorize('admin'), trafficController.deleteTrafficData);

module.exports = router;
