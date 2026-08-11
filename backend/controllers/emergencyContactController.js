/**
 * Emergency Contact Controller
 * HTTP handlers for emergency hotlines and contact information
 */

const emergencyContactService = require('../services/emergencyContactService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all emergency contacts
 * @route   GET /api/v1/emergency-contacts
 * @access  Public/Optional Auth
 */
exports.getAllContacts = asyncHandler(async (req, res) => {
    const filters = {
        type: req.query.type,
        is_active: req.query.is_active,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
    };

    const result = await emergencyContactService.getAllContacts(filters);

    successResponse(res, result, 'Emergency contacts retrieved successfully');
});

/**
 * @desc    Get active emergency contacts (grouped by category)
 * @route   GET /api/v1/emergency-contacts/active
 * @access  Public/Optional Auth
 */
exports.getActiveContacts = asyncHandler(async (req, res) => {
    const contacts = await emergencyContactService.getActiveContacts();

    successResponse(res, { contacts }, 'Active emergency contacts retrieved successfully');
});

/**
 * @desc    Get emergency hotlines
 * @route   GET /api/v1/emergency-contacts/hotlines
 * @access  Public/Optional Auth
 */
exports.getEmergencyHotlines = asyncHandler(async (req, res) => {
    const hotlines = await emergencyContactService.getEmergencyHotlines();

    successResponse(res, { hotlines }, 'Emergency hotlines retrieved successfully');
});

/**
 * @desc    Get contacts by type
 * @route   GET /api/v1/emergency-contacts/category/:category
 * @access  Public/Optional Auth
 */
exports.getByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const contacts = await emergencyContactService.getContactsByCategory(category);

    successResponse(res, { contacts }, `${category} contacts retrieved successfully`);
});

/**
 * @desc    Get contact statistics
 * @route   GET /api/v1/emergency-contacts/stats
 * @access  Public/Optional Auth
 */
exports.getContactStats = asyncHandler(async (req, res) => {
    const stats = await emergencyContactService.getContactStats();

    successResponse(res, { stats }, 'Contact statistics retrieved successfully');
});

/**
 * @desc    Get emergency contact by ID
 * @route   GET /api/v1/emergency-contacts/:id
 * @access  Public/Optional Auth
 */
exports.getContactById = asyncHandler(async (req, res) => {
    const contact = await emergencyContactService.getContactById(req.params.id);

    successResponse(res, { contact }, 'Emergency contact retrieved successfully');
});

/**
 * @desc    Create new emergency contact
 * @route   POST /api/v1/emergency-contacts
 * @access  Protected (Admin only)
 */
exports.createContact = asyncHandler(async (req, res) => {
    const contactData = {
        name: req.body.name,
        type: req.body.type,
        phone_numbers: req.body.phone_numbers,
        email: req.body.email,
        address: req.body.address,
        is_24_7: req.body.is_24_7,
        operating_hours: req.body.operating_hours,
        priority: req.body.priority,
        is_active: req.body.is_active !== undefined ? req.body.is_active : true
    };

    const contact = await emergencyContactService.createContact(contactData);

    successResponse(res, { contact }, 'Emergency contact created successfully', 201);
});

/**
 * @desc    Update emergency contact
 * @route   PUT /api/v1/emergency-contacts/:id
 * @access  Protected (Admin only)
 */
exports.updateContact = asyncHandler(async (req, res) => {
    const updateData = {
        name: req.body.name,
        type: req.body.type,
        phone_numbers: req.body.phone_numbers,
        email: req.body.email,
        address: req.body.address,
        is_24_7: req.body.is_24_7,
        operating_hours: req.body.operating_hours,
        priority: req.body.priority,
        is_active: req.body.is_active
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
    );

    const contact = await emergencyContactService.updateContact(req.params.id, updateData);

    successResponse(res, { contact }, 'Emergency contact updated successfully');
});

/**
 * @desc    Deactivate emergency contact
 * @route   PUT /api/v1/emergency-contacts/:id/deactivate
 * @access  Protected (Admin only)
 */
exports.deactivateContact = asyncHandler(async (req, res) => {
    const contact = await emergencyContactService.deactivateContact(req.params.id);

    successResponse(res, { contact }, 'Emergency contact deactivated successfully');
});

/**
 * @desc    Delete emergency contact
 * @route   DELETE /api/v1/emergency-contacts/:id
 * @access  Protected (Admin only)
 */
exports.deleteContact = asyncHandler(async (req, res) => {
    const result = await emergencyContactService.deleteContact(req.params.id);

    successResponse(res, result, 'Emergency contact deleted successfully');
});
