/**
 * Incident Controller
 * HTTP handlers for incident management
 */

const incidentService = require('../services/incidentService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 * @access  Public/Optional Auth
 */
exports.getAllIncidents = asyncHandler(async (req, res) => {
    const filters = {
        incident_type: req.query.incident_type,
        severity: req.query.severity,
        status: req.query.status,
        barangay_id: req.query.barangay_id,
        is_verified: req.query.is_verified,
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

    const result = await incidentService.getAllIncidents(filters, pagination);

    successResponse(res, result, 'Incidents retrieved successfully');
});

/**
 * @desc    Get incident by ID
 * @route   GET /api/incidents/:id
 * @access  Public/Optional Auth
 */
exports.getIncidentById = asyncHandler(async (req, res) => {
    const incident = await incidentService.getIncidentById(req.params.id);

    if (!incident) {
        return errorResponse(res, 'Incident not found', 404);
    }

    successResponse(res, { incident }, 'Incident retrieved successfully');
});

/**
 * @desc    Create new incident
 * @route   POST /api/incidents
 * @access  Protected
 */
exports.createIncident = asyncHandler(async (req, res) => {
    const incidentData = {
        incident_type: req.body.incident_type,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        barangay_id: req.body.barangay_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        reporter_name: req.body.reporter_name,
        reporter_contact: req.body.reporter_contact,
        affected_families: req.body.affected_families,
        affected_individuals: req.body.affected_individuals,
        casualties: req.body.casualties,
        estimated_damage: req.body.estimated_damage,
        notes: req.body.notes
    };

    // Get uploaded files
    const imageFiles = req.files || [];

    const incident = await incidentService.createIncident(
        incidentData,
        req.user.id,
        imageFiles
    );

    successResponse(res, { incident }, 'Incident reported successfully', 201);
});

/**
 * @desc    Update incident
 * @route   PUT /api/incidents/:id
 * @access  Protected (Admin/Staff or Owner)
 */
exports.updateIncident = asyncHandler(async (req, res) => {
    const updateData = {
        incident_type: req.body.incident_type,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        status: req.body.status,
        barangay_id: req.body.barangay_id,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        affected_families: req.body.affected_families,
        affected_individuals: req.body.affected_individuals,
        casualties: req.body.casualties,
        estimated_damage: req.body.estimated_damage,
        resolution_notes: req.body.resolution_notes,
        notes: req.body.notes
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    const incident = await incidentService.updateIncident(
        req.params.id,
        updateData,
        req.user.id,
        req.user.role
    );

    if (!incident) {
        return errorResponse(res, 'Incident not found', 404);
    }

    successResponse(res, { incident }, 'Incident updated successfully');
});

/**
 * @desc    Verify incident
 * @route   POST /api/incidents/:id/verify
 * @access  Protected (Admin/Staff)
 */
exports.verifyIncident = asyncHandler(async (req, res) => {
    const verificationData = {
        severity: req.body.severity,
        affected_families: req.body.affected_families,
        affected_individuals: req.body.affected_individuals,
        casualties: req.body.casualties,
        estimated_damage: req.body.estimated_damage,
        notes: req.body.notes
    };

    // Remove undefined values
    Object.keys(verificationData).forEach(key => {
        if (verificationData[key] === undefined) {
            delete verificationData[key];
        }
    });

    const incident = await incidentService.verifyIncident(
        req.params.id,
        req.user.id,
        verificationData
    );

    if (!incident) {
        return errorResponse(res, 'Incident not found', 404);
    }

    successResponse(res, { incident }, 'Incident verified successfully');
});

/**
 * @desc    Reject incident
 * @route   POST /api/incidents/:id/reject
 * @access  Protected (Admin/Staff)
 */
exports.rejectIncident = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason) {
        return errorResponse(res, 'Rejection reason is required', 400);
    }

    const result = await incidentService.rejectIncident(
        req.params.id,
        req.user.id,
        reason
    );

    if (!result) {
        return errorResponse(res, 'Incident not found', 404);
    }

    successResponse(res, result, 'Incident rejected successfully');
});

/**
 * @desc    Delete incident
 * @route   DELETE /api/incidents/:id
 * @access  Protected (Admin only)
 */
exports.deleteIncident = asyncHandler(async (req, res) => {
    const result = await incidentService.deleteIncident(req.params.id, req.user.id);

    if (!result) {
        return errorResponse(res, 'Incident not found', 404);
    }

    successResponse(res, result, 'Incident deleted successfully');
});

/**
 * @desc    Get incident statistics
 * @route   GET /api/incidents/stats/summary
 * @access  Protected (Admin/Staff)
 */
exports.getIncidentStats = asyncHandler(async (req, res) => {
    const filters = {
        barangay_id: req.query.barangay_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date
    };

    const stats = await incidentService.getIncidentStats(filters);

    successResponse(res, { stats }, 'Incident statistics retrieved successfully');
});

/**
 * @desc    Get live incident feed
 * @route   GET /api/incidents/feed/live
 * @access  Public/Optional Auth
 */
exports.getLiveFeed = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10;

    const feed = await incidentService.getLiveFeed(limit);

    successResponse(res, { feed }, 'Live incident feed retrieved successfully');
});
