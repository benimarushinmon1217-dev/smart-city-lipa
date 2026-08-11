/**
 * User Routes
 * Admin-only user management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder controller (to be implemented)
const userController = {
    getAllUsers: (req, res) => res.json({ message: 'Get all users - To be implemented' }),
    getUserById: (req, res) => res.json({ message: 'Get user by ID - To be implemented' }),
    updateUser: (req, res) => res.json({ message: 'Update user - To be implemented' }),
    deleteUser: (req, res) => res.json({ message: 'Delete user - To be implemented' })
};

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
