/**
 * Barangay Controller
 * HTTP handlers for barangay management
 */

const barangayService = require('../services/barangayService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all barangays
 * @route   GET /api/v1/barangays
 * @access  Public/Optional Auth
 */
exports.getAllBarangays = asyncHandler(async (req, res) => {
    const filters = {
        flood_risk_level: req.query.flood_risk_level,
        ashfall_risk_level: req.query.ashfall_risk_level,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
    };

    const result = await barangayService.getAllBarangays(filters);

    successResponse(res, result, 'Barangays retrieved successfully');
});

/**
 * @desc    Get barangay by ID
 * @route   GET /api/v1/barangays/:id
 * @access  Public/Optional Auth
 */
exports.getBarangayById = asyncHandler(async (req, res) => {
    const includeGeoJSON = req.query.include_geojson === 'true';
    const barangay = await barangayService.getBarangayById(req.params.id, includeGeoJSON);

    successResponse(res, { barangay }, 'Barangay retrieved successfully');
});

/**
 * @desc    Get high-risk barangays
 * @route   GET /api/v1/barangays/risk/high
 * @access  Public/Optional Auth
 */
exports.getHighRiskBarangays = asyncHandler(async (req, res) => {
    const barangays = await barangayService.getHighRiskBarangays();

    successResponse(res, { barangays }, 'High-risk barangays retrieved successfully');
});

/**
 * @desc    Create new barangay
 * @route   POST /api/v1/barangays
 * @access  Protected (Admin only)
 */
exports.createBarangay = asyncHandler(async (req, res) => {
    const barangayData = {
        name: req.body.name,
        population: req.body.population,
        area: req.body.area,
        risk_level: req.body.risk_level,
        geojson: req.body.geojson,
        centroid_lat: req.body.centroid_lat,
        centroid_lng: req.body.centroid_lng
    };

    const barangay = await barangayService.createBarangay(barangayData);

    successResponse(res, { barangay }, 'Barangay created successfully', 201);
});

/**
 * @desc    Update barangay
 * @route   PUT /api/v1/barangays/:id
 * @access  Protected (Admin only)
 */
exports.updateBarangay = asyncHandler(async (req, res) => {
    const updateData = {
        name: req.body.name,
        population: req.body.population,
        area: req.body.area,
        risk_level: req.body.risk_level,
        geojson: req.body.geojson,
        centroid_lat: req.body.centroid_lat,
        centroid_lng: req.body.centroid_lng
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    const barangay = await barangayService.updateBarangay(req.params.id, updateData);

    successResponse(res, { barangay }, 'Barangay updated successfully');
});

/**
 * @desc    Delete barangay
 * @route   DELETE /api/v1/barangays/:id
 * @access  Protected (Admin only)
 */
exports.deleteBarangay = asyncHandler(async (req, res) => {
    const result = await barangayService.deleteBarangay(req.params.id);

    successResponse(res, result, 'Barangay deleted successfully');
});
