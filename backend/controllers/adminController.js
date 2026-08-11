/**
 * Admin Controller
 * Handles admin-related HTTP requests
 */

const adminService = require('../services/adminService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
exports.getDashboard = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();

    ApiResponse.success(res, stats, 'Dashboard statistics retrieved successfully');
});

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with filters
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res) => {
    const { page, limit, role, is_active, search } = req.query;

    const result = await adminService.getUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        role,
        is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
        search
    });

    ApiResponse.paginated(
        res,
        result.users,
        result.pagination,
        'Users retrieved successfully'
    );
});

/**
 * @route   PUT /api/v1/admin/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
    const user = await adminService.updateUser(req.params.id, req.body);

    ApiResponse.success(res, user, 'User updated successfully');
});

/**
 * @route   PUT /api/v1/admin/users/:id/activate
 * @desc    Activate user
 * @access  Private/Admin
 */
exports.activateUser = asyncHandler(async (req, res) => {
    const user = await adminService.activateUser(req.params.id);

    ApiResponse.success(res, user, 'User activated successfully');
});

/**
 * @route   PUT /api/v1/admin/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private/Admin
 */
exports.deactivateUser = asyncHandler(async (req, res) => {
    const user = await adminService.deactivateUser(req.params.id);

    ApiResponse.success(res, user, 'User deactivated successfully');
});

/**
 * @route   GET /api/v1/admin/incidents
 * @desc    Get all incidents with filters
 * @access  Private/Admin/Staff
 */
exports.getIncidents = asyncHandler(async (req, res) => {
    const { page, limit, status, severity, incident_type, is_verified, barangay_id, search } = req.query;

    const result = await adminService.getIncidents({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
        severity,
        incident_type,
        is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
        barangay_id,
        search
    });

    ApiResponse.paginated(
        res,
        result.incidents,
        result.pagination,
        'Incidents retrieved successfully'
    );
});

/**
 * @route   PUT /api/v1/admin/incidents/:id/verify
 * @desc    Verify incident
 * @access  Private/Admin/Staff
 */
exports.verifyIncident = asyncHandler(async (req, res) => {
    const incident = await adminService.verifyIncident(req.params.id, req.user.id);

    ApiResponse.success(res, incident, 'Incident verified successfully');
});

/**
 * @route   PUT /api/v1/admin/incidents/:id/reject
 * @desc    Reject incident
 * @access  Private/Admin/Staff
 */
exports.rejectIncident = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason) {
        return ApiResponse.error(res, 'Rejection reason is required', 400);
    }

    const incident = await adminService.rejectIncident(req.params.id, req.user.id, reason);

    ApiResponse.success(res, incident, 'Incident rejected successfully');
});

/**
 * @route   PUT /api/v1/admin/incidents/:id/status
 * @desc    Update incident status
 * @access  Private/Admin/Staff
 */
exports.updateIncidentStatus = asyncHandler(async (req, res) => {
    const { status, notes } = req.body;

    if (!status) {
        return ApiResponse.error(res, 'Status is required', 400);
    }

    const incident = await adminService.updateIncidentStatus(req.params.id, status, notes);

    ApiResponse.success(res, incident, 'Incident status updated successfully');
});

/**
 * @route   GET /api/v1/admin/reports
 * @desc    Get all reports with filters
 * @access  Private/Admin/Staff
 */
exports.getReports = asyncHandler(async (req, res) => {
    const { page, limit, status, report_type, priority, barangay_id } = req.query;

    const result = await adminService.getReports({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
        report_type,
        priority,
        barangay_id
    });

    ApiResponse.paginated(
        res,
        result.reports,
        result.pagination,
        'Reports retrieved successfully'
    );
});

/**
 * @route   PUT /api/v1/admin/reports/:id/status
 * @desc    Update report status
 * @access  Private/Admin/Staff
 */
exports.updateReportStatus = asyncHandler(async (req, res) => {
    const { status, assigned_to, resolution_notes } = req.body;

    if (!status) {
        return ApiResponse.error(res, 'Status is required', 400);
    }

    const report = await adminService.updateReportStatus(
        req.params.id,
        status,
        assigned_to,
        resolution_notes
    );

    ApiResponse.success(res, report, 'Report status updated successfully');
});

/**
 * @route   POST /api/v1/admin/announcements/emergency
 * @desc    Create emergency announcement
 * @access  Private/Admin
 */
exports.createEmergencyAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await adminService.createEmergencyAnnouncement(req.body, req.user.id);

    ApiResponse.success(res, announcement, 'Emergency announcement created successfully', 201);
});

/**
 * @route   POST /api/v1/admin/evacuation-order
 * @desc    Issue evacuation order
 * @access  Private/Admin
 */
exports.issueEvacuationOrder = asyncHandler(async (req, res) => {
    const { barangayIds, reason, urgency } = req.body;

    if (!barangayIds || !Array.isArray(barangayIds) || barangayIds.length === 0) {
        return ApiResponse.error(res, 'Barangay IDs are required', 400);
    }

    if (!reason) {
        return ApiResponse.error(res, 'Reason is required', 400);
    }

    const result = await adminService.issueEvacuationOrder({
        barangayIds,
        reason,
        urgency: urgency || 'immediate',
        createdBy: req.user.id
    });

    ApiResponse.success(res, result, 'Evacuation order issued successfully', 201);
});

/**
 * @route   GET /api/v1/admin/analytics
 * @desc    Get analytics data
 * @access  Private/Admin
 */
exports.getAnalytics = asyncHandler(async (req, res) => {
    const { timeRange = '7d' } = req.query;

    const analytics = await adminService.getAnalytics(timeRange);

    ApiResponse.success(res, analytics, 'Analytics retrieved successfully');
});
