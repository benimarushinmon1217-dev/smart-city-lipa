/**
 * Announcement Controller
 * HTTP handlers for system announcements and alerts
 */

const announcementService = require('../services/announcementService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all announcements
 * @route   GET /api/v1/announcements
 * @access  Public/Optional Auth
 */
exports.getAllAnnouncements = asyncHandler(async (req, res) => {
    const filters = {
        type: req.query.type,
        priority: req.query.priority,
        is_active: req.query.is_active,
        page: req.query.page,
        limit: req.query.limit
    };

    const result = await announcementService.getAllAnnouncements(filters);

    successResponse(res, result, 'Announcements retrieved successfully');
});

/**
 * @desc    Get active announcements
 * @route   GET /api/v1/announcements/active
 * @access  Public/Optional Auth
 */
exports.getActiveAnnouncements = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10;
    const announcements = await announcementService.getActiveAnnouncements(limit);

    successResponse(res, { announcements }, 'Active announcements retrieved successfully');
});

/**
 * @desc    Get urgent announcements
 * @route   GET /api/v1/announcements/urgent
 * @access  Public/Optional Auth
 */
exports.getUrgentAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await announcementService.getUrgentAnnouncements();

    successResponse(res, { announcements }, 'Urgent announcements retrieved successfully');
});

/**
 * @desc    Get announcements by type
 * @route   GET /api/v1/announcements/type/:type
 * @access  Public/Optional Auth
 */
exports.getByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const limit = req.query.limit || 10;

    const announcements = await announcementService.getAnnouncementsByType(type, limit);

    successResponse(res, { announcements }, `${type} announcements retrieved successfully`);
});

/**
 * @desc    Get announcement by ID
 * @route   GET /api/v1/announcements/:id
 * @access  Public/Optional Auth
 */
exports.getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await announcementService.getAnnouncementById(req.params.id);

    successResponse(res, { announcement }, 'Announcement retrieved successfully');
});

/**
 * @desc    Create new announcement
 * @route   POST /api/v1/announcements
 * @access  Protected (Admin/Staff)
 */
exports.createAnnouncement = asyncHandler(async (req, res) => {
    const announcementData = {
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        priority: req.body.priority,
        target_audience: req.body.target_audience,
        target_barangays: req.body.target_barangays,
        is_active: req.body.is_active !== undefined ? req.body.is_active : true
    };

    const announcement = await announcementService.createAnnouncement(
        announcementData,
        req.user.id
    );

    successResponse(res, { announcement }, 'Announcement created successfully', 201);
});

/**
 * @desc    Update announcement
 * @route   PUT /api/v1/announcements/:id
 * @access  Protected (Admin/Staff)
 */
exports.updateAnnouncement = asyncHandler(async (req, res) => {
    const updateData = {
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        priority: req.body.priority,
        target_audience: req.body.target_audience,
        target_barangays: req.body.target_barangays,
        is_active: req.body.is_active
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    const announcement = await announcementService.updateAnnouncement(req.params.id, updateData);

    successResponse(res, { announcement }, 'Announcement updated successfully');
});

/**
 * @desc    Deactivate announcement
 * @route   PUT /api/v1/announcements/:id/deactivate
 * @access  Protected (Admin/Staff)
 */
exports.deactivateAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await announcementService.deactivateAnnouncement(req.params.id);

    successResponse(res, { announcement }, 'Announcement deactivated successfully');
});

/**
 * @desc    Delete announcement
 * @route   DELETE /api/v1/announcements/:id
 * @access  Protected (Admin only)
 */
exports.deleteAnnouncement = asyncHandler(async (req, res) => {
    const result = await announcementService.deleteAnnouncement(req.params.id);

    successResponse(res, result, 'Announcement deleted successfully');
});
