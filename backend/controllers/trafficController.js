/**
 * Traffic Controller
 * HTTP handlers for traffic monitoring data
 */

const trafficService = require('../services/trafficService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all traffic data
 * @route   GET /api/v1/traffic
 * @access  Public/Optional Auth
 */
exports.getAllTrafficData = asyncHandler(async (req, res) => {
    const filters = {
        barangay_id: req.query.barangay_id,
        traffic_level: req.query.traffic_level,
        road_condition: req.query.road_condition,
        page: req.query.page,
        limit: req.query.limit
    };

    const result = await trafficService.getAllTrafficData(filters);

    successResponse(res, result, 'Traffic data retrieved successfully');
});

/**
 * @desc    Get traffic data by ID
 * @route   GET /api/v1/traffic/:id
 * @access  Public/Optional Auth
 */
exports.getTrafficById = asyncHandler(async (req, res) => {
    const trafficData = await trafficService.getTrafficDataById(req.params.id);

    successResponse(res, { traffic_data: trafficData }, 'Traffic data retrieved successfully');
});

/**
 * @desc    Get latest traffic data for barangay
 * @route   GET /api/v1/traffic/barangay/:id/latest
 * @access  Public/Optional Auth
 */
exports.getLatestByBarangay = asyncHandler(async (req, res) => {
    const trafficData = await trafficService.getLatestByBarangay(req.params.id);

    if (!trafficData) {
        return errorResponse(res, 'No traffic data found for this barangay', 404);
    }

    successResponse(res, { traffic_data: trafficData }, 'Latest traffic data retrieved successfully');
});

/**
 * @desc    Get traffic hotspots
 * @route   GET /api/v1/traffic/hotspots
 * @access  Public/Optional Auth
 */
exports.getTrafficHotspots = asyncHandler(async (req, res) => {
    const hotspots = await trafficService.getTrafficHotspots();

    successResponse(res, { hotspots }, 'Traffic hotspots retrieved successfully');
});

/**
 * @desc    Get traffic statistics
 * @route   GET /api/v1/traffic/stats
 * @access  Public/Optional Auth
 */
exports.getTrafficStats = asyncHandler(async (req, res) => {
    const stats = await trafficService.getTrafficStats();

    successResponse(res, { stats }, 'Traffic statistics retrieved successfully');
});

/**
 * @desc    Create new traffic data
 * @route   POST /api/v1/traffic
 * @access  Protected (Staff/Admin)
 */
exports.createTrafficData = asyncHandler(async (req, res) => {
    const trafficData = {
        barangay_id: req.body.barangay_id,
        location: req.body.location,
        traffic_level: req.body.traffic_level,
        road_condition: req.body.road_condition,
        average_speed: req.body.average_speed,
        vehicle_count: req.body.vehicle_count,
        notes: req.body.notes,
        timestamp: req.body.timestamp || new Date()
    };

    const result = await trafficService.createTrafficData(trafficData);

    successResponse(res, { traffic_data: result }, 'Traffic data created successfully', 201);
});

/**
 * @desc    Update traffic data
 * @route   PUT /api/v1/traffic/:id
 * @access  Protected (Staff/Admin)
 */
exports.updateTrafficData = asyncHandler(async (req, res) => {
    const updateData = {
        barangay_id: req.body.barangay_id,
        location: req.body.location,
        traffic_level: req.body.traffic_level,
        road_condition: req.body.road_condition,
        average_speed: req.body.average_speed,
        vehicle_count: req.body.vehicle_count,
        notes: req.body.notes,
        timestamp: req.body.timestamp
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    const trafficData = await trafficService.updateTrafficData(req.params.id, updateData);

    successResponse(res, { traffic_data: trafficData }, 'Traffic data updated successfully');
});

/**
 * @desc    Delete traffic data
 * @route   DELETE /api/v1/traffic/:id
 * @access  Protected (Admin only)
 */
exports.deleteTrafficData = asyncHandler(async (req, res) => {
    const result = await trafficService.deleteTrafficData(req.params.id);

    successResponse(res, result, 'Traffic data deleted successfully');
});
