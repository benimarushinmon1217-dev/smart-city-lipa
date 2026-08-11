/**
 * Establishment Routes
 * Facilities and establishment management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const establishmentController = require('../controllers/establishmentController');

// Public routes
router.get('/', optionalAuth, establishmentController.getAllEstablishments);
router.get('/evacuation/centers', optionalAuth, establishmentController.getEvacuationCenters);
router.get('/hospitals/list', optionalAuth, establishmentController.getHospitals);
router.get('/nearest/:type', optionalAuth, establishmentController.findNearest);
router.get('/type/:type', optionalAuth, establishmentController.getByType);
router.get('/:id', optionalAuth, establishmentController.getEstablishmentById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), establishmentController.createEstablishment);
router.put('/:id', protect, authorize('admin'), establishmentController.updateEstablishment);
router.delete('/:id', protect, authorize('admin'), establishmentController.deleteEstablishment);

module.exports = router;
