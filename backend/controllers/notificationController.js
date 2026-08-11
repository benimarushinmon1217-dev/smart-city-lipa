/**
 * Notification Controller
 * Handles notification-related HTTP requests
 */

const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/notifications
 * @desc    Get user notifications
 * @access  Private
 */
exports.getUserNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    console.log('📋 [NOTIFICATION CONTROLLER] GET /notifications - User:', req.user.id, req.user.email);
    console.log('📋 [NOTIFICATION CONTROLLER] Query params:', { page, limit, unreadOnly });

    const result = await notificationService.getUserNotifications(req.user.id, {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadOnly: unreadOnly === 'true'
    });

    console.log('📋 [NOTIFICATION CONTROLLER] Returning', result.notifications.length, 'notifications');

    ApiResponse.paginated(
        res,
        result.notifications,
        result.pagination,
        'Notifications retrieved successfully'
    );
});

/**
 * @route   GET /api/v1/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
    console.log('📋 [NOTIFICATION CONTROLLER] GET /notifications/unread-count - User:', req.user.id, req.user.email);

    const count = await notificationService.getUnreadCount(req.user.id);

    console.log('📋 [NOTIFICATION CONTROLLER] Returning unread count:', count);

    ApiResponse.success(res, { count }, 'Unread count retrieved successfully');
});

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(
        req.params.id,
        req.user.id
    );

    ApiResponse.success(res, notification, 'Notification marked as read');
});

/**
 * @route   PUT /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAsRead(req.user.id);

    ApiResponse.success(res, null, 'All notifications marked as read');
});

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.user.id);

    ApiResponse.success(res, null, 'Notification deleted successfully');
});

/**
 * @route   DELETE /api/v1/notifications/read
 * @desc    Delete all read notifications
 * @access  Private
 */
exports.deleteReadNotifications = asyncHandler(async (req, res) => {
    const count = await notificationService.deleteReadNotifications(req.user.id);

    ApiResponse.success(
        res,
        { deletedCount: count },
        `${count} read notifications deleted`
    );
});

/**
 * @route   DELETE /api/v1/notifications/clear-all
 * @desc    Delete all notifications for user
 * @access  Private
 */
exports.clearAll = asyncHandler(async (req, res) => {
    const count = await notificationService.clearAll(req.user.id);

    ApiResponse.success(
        res,
        { deletedCount: count },
        `${count} notifications cleared`
    );
});
