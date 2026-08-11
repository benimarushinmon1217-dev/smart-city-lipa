/**
 * Establishment Controller
 * HTTP handlers for establishment/facility management
 */

const establishmentService = require('../services/establishmentService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all establishments
 * @route   GET /api/v1/establishments
 * @access  Public/Optional Auth
 */
exports.getAllEstablishments = asyncHandler(async (req, res) => {
    const filters = {
        type: req.query.type,
        barangay_id: req.query.barangay_id,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
    };

    const result = await establishmentService.getAllEstablishments(filters);

    successResponse(res, result, 'Establishments retrieved successfully');
});

/**
 * @desc    Get establishment by ID
 * @route   GET /api/v1/establishments/:id
 * @access  Public/Optional Auth
 */
exports.getEstablishmentById = asyncHandler(async (req, res) => {
    const establishment = await establishmentService.getEstablishmentById(req.params.id);

    successResponse(res, { establishment }, 'Establishment retrieved successfully');
});

/**
 * @desc    Get establishments by type
 * @route   GET /api/v1/establishments/type/:type
 * @access  Public/Optional Auth
 */
exports.getByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const { barangay_id } = req.query;

    const establishments = await establishmentService.getEstablishmentsByType(type, barangay_id);

    successResponse(res, { establishments }, `${type} establishments retrieved successfully`);
});

/**
 * @desc    Get evacuation centers
 * @route   GET /api/v1/establishments/evacuation/centers
 * @access  Public/Optional Auth
 */
exports.getEvacuationCenters = asyncHandler(async (req, res) => {
    const { barangay_id } = req.query;

    const centers = await establishmentService.getEvacuationCenters(barangay_id);

    successResponse(res, { centers }, 'Evacuation centers retrieved successfully');
});

/**
 * @desc    Get hospitals
 * @route   GET /api/v1/establishments/hospitals/list
 * @access  Public/Optional Auth
 */
exports.getHospitals = asyncHandler(async (req, res) => {
    const { barangay_id } = req.query;

    const hospitals = await establishmentService.getHospitals(barangay_id);

    successResponse(res, { hospitals }, 'Hospitals retrieved successfully');
});

/**
 * @desc    Find nearest establishments by type
 * @route   GET /api/v1/establishments/nearest/:type
 * @access  Public/Optional Auth
 */
exports.findNearest = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const { latitude, longitude, limit } = req.query;

    if (!latitude || !longitude) {
        return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    const establishments = await establishmentService.findNearestByType(
        type,
        parseFloat(latitude),
        parseFloat(longitude),
        limit ? parseInt(limit) : 5
    );

    successResponse(res, { establishments }, `Nearest ${type} establishments retrieved successfully`);
});

/**
 * @desc    Create new establishment
 * @route   POST /api/v1/establishments
 * @access  Protected (Admin only)
 */
exports.createEstablishment = asyncHandler(async (req, res) => {
    const establishmentData = {
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        barangay_id: req.body.barangay_id,
        contact_number: req.body.contact_number,
        capacity: req.body.capacity,
        operating_hours: req.body.operating_hours,
        description: req.body.description
    };

    const establishment = await establishmentService.createEstablishment(establishmentData);

    successResponse(res, { establishment }, 'Establishment created successfully', 201);
});

/**
 * @desc    Update establishment
 * @route   PUT /api/v1/establishments/:id
 * @access  Protected (Admin only)
 */
exports.updateEstablishment = asyncHandler(async (req, res) => {
    const updateData = {
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        barangay_id: req.body.barangay_id,
        contact_number: req.body.contact_number,
        capacity: req.body.capacity,
        current_occupancy: req.body.current_occupancy,
        operating_hours: req.body.operating_hours,
        description: req.body.description,
        is_operational: req.body.is_operational,
        is_active: req.body.is_active
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    const establishment = await establishmentService.updateEstablishment(req.params.id, updateData);

    successResponse(res, { establishment }, 'Establishment updated successfully');
});

/**
 * @desc    Delete establishment
 * @route   DELETE /api/v1/establishments/:id
 * @access  Protected (Admin only)
 */
exports.deleteEstablishment = asyncHandler(async (req, res) => {
    const result = await establishmentService.deleteEstablishment(req.params.id);

    successResponse(res, result, 'Establishment deleted successfully');
});
