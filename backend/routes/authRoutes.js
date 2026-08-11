/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
    registerValidator,
    loginValidator,
    changePasswordValidator,
    updateProfileValidator
} = require('../validators/authValidator');

// Public routes
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, updateProfileValidator, validate, authController.updateProfile);
router.post('/change-password', protect, changePasswordValidator, validate, authController.changePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
