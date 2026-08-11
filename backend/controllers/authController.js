/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

const authService = require('../services/authService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password, phone, barangay } = req.body;

    const result = await authService.register({
        first_name,
        last_name,
        email,
        password,
        phone,
        barangay,
        role: 'user' // Default role
    });

    ApiResponse.success(res, result, 'Registration successful', 201);
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    ApiResponse.success(res, result, 'Login successful');
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token is required', 400);
    }

    const result = await authService.refreshToken(refreshToken);

    ApiResponse.success(res, result, 'Token refreshed successfully');
});

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);

    ApiResponse.success(res, user, 'Profile retrieved successfully');
});

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);

    ApiResponse.success(res, user, 'Profile updated successfully');
});

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, currentPassword, newPassword);

    ApiResponse.success(res, null, 'Password changed successfully');
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
    // In a stateless JWT system, logout is handled client-side
    // This endpoint can be used for logging purposes
    ApiResponse.success(res, null, 'Logged out successfully');
});
