/**
 * Report Controller
 * HTTP handlers for user report management
 */

const reportService = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Protected
 */
exports.getAllReports = asyncHandler(async (req, res) => {
    const filters = {
        report_type: req.query.report_type,
        status: req.query.status,
        priority: req.query.priority,
        barangay_id: req.query.barangay_id,
        search: req.query.search,
        start_date: req.query.start_date,
        end_date: req.query.end_date
    };

    const pagination = {
        page: req.query.page,
        limit: req.query.limit,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order
    };

    const result = await reportService.getAllReports(
        filters,
        pagination,
        req.user.id,
        req.user.role
    );

    successResponse(res, result, 'Reports retrieved successfully');
});

/**
 * @desc    Get report by ID
 * @route   GET /api/reports/:id
 * @access  Protected
 */
exports.getReportById = asyncHandler(async (req, res) => {
    const report = await reportService.getReportById(
        req.params.id,
        req.user.id,
        req.user.role
    );

    if (!report) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report }, 'Report retrieved successfully');
});

/**
 * @desc    Create new report
 * @route   POST /api/reports
 * @access  Protected
 */
exports.createReport = asyncHandler(async (req, res) => {
    console.log('📥 [createReport] Received request');
    console.log('📥 [createReport] Body:', req.body);
    console.log('📥 [createReport] Files:', req.files);
    console.log('📥 [createReport] User:', req.user?.id);

    // Validate report_type is not empty
    if (!req.body.report_type || req.body.report_type.trim() === '') {
        return errorResponse(res, 'Report type is required', 400);
    }

    const reportData = {
        report_type: req.body.report_type,
        title: req.body.title,
        description: req.body.description,
        barangay_id: req.body.barangay_id,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        priority: req.body.priority,
        is_anonymous: req.body.is_anonymous === 'true' || req.body.is_anonymous === true,
        contact_number: req.body.contact_number
    };

    console.log('📋 [createReport] Report data:', reportData);

    // Get uploaded files
    const imageFiles = req.files || [];
    console.log('📷 [createReport] Image files count:', imageFiles.length);

    const report = await reportService.createReport(
        reportData,
        req.user.id,
        imageFiles
    );

    console.log('✅ [createReport] Report created:', report.id);
    successResponse(res, { report }, 'Report submitted successfully', 201);
});

/**
 * @desc    Update report
 * @route   PUT /api/reports/:id
 * @access  Protected
 */
exports.updateReport = asyncHandler(async (req, res) => {
    const updateData = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        priority: req.body.priority,
        status: req.body.status,
        resolution_notes: req.body.resolution_notes
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    const report = await reportService.updateReport(
        req.params.id,
        updateData,
        req.user.id,
        req.user.role
    );

    if (!report) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report }, 'Report updated successfully');
});

/**
 * @desc    Assign report to staff
 * @route   POST /api/reports/:id/assign
 * @access  Protected (Admin/Staff)
 */
exports.assignReport = asyncHandler(async (req, res) => {
    const { assigned_to } = req.body;

    if (!assigned_to) {
        return errorResponse(res, 'Assigned user ID is required', 400);
    }

    const report = await reportService.assignReport(
        req.params.id,
        assigned_to,
        req.user.id
    );

    if (!report) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report }, 'Report assigned successfully');
});

/**
 * @desc    Verify report
 * @route   POST /api/reports/:id/verify
 * @access  Protected (Admin/Staff)
 */
exports.verifyReport = asyncHandler(async (req, res) => {
    const report = await reportService.verifyReport(
        req.params.id,
        req.user.id
    );

    if (!report) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report }, 'Report verified successfully');
});

/**
 * @desc    Resolve report
 * @route   POST /api/reports/:id/resolve
 * @access  Protected (Admin/Staff)
 */
exports.resolveReport = asyncHandler(async (req, res) => {
    const { resolution_notes } = req.body;

    if (!resolution_notes) {
        return errorResponse(res, 'Resolution notes are required', 400);
    }

    const report = await reportService.resolveReport(
        req.params.id,
        resolution_notes,
        req.user.id
    );

    if (!report) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report }, 'Report resolved successfully');
});

/**
 * @desc    Reject report
 * @route   POST /api/reports/:id/reject
 * @access  Protected (Admin/Staff)
 */
exports.rejectReport = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason) {
        return errorResponse(res, 'Rejection reason is required', 400);
    }

    const result = await reportService.rejectReport(
        req.params.id,
        reason,
        req.user.id
    );

    if (!result) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, result, 'Report rejected successfully');
});

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Protected (Admin or Owner)
 */
exports.deleteReport = asyncHandler(async (req, res) => {
    const result = await reportService.deleteReport(
        req.params.id,
        req.user.id,
        req.user.role
    );

    if (!result) {
        return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, result, 'Report deleted successfully');
});

/**
 * @desc    Get report statistics
 * @route   GET /api/reports/stats/summary
 * @access  Protected (Admin/Staff)
 */
exports.getReportStats = asyncHandler(async (req, res) => {
    const filters = {
        barangay_id: req.query.barangay_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date
    };

    const stats = await reportService.getReportStats(filters);

    successResponse(res, { stats }, 'Report statistics retrieved successfully');
});
