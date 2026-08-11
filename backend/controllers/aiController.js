/**
 * AI Controller
 * HTTP handlers for AI services
 */

const chatbotService = require('../services/chatbotService');
const riskAnalysisService = require('../services/riskAnalysisService');
const routeRecommendationService = require('../services/routeRecommendationService');
const windAshfallService = require('../services/windAshfallService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Process chatbot query
 * @route   POST /api/ai/chatbot
 * @access  Public/Optional Auth
 */
exports.chatbot = asyncHandler(async (req, res) => {
    const { question, hazard_data } = req.body;

    // Sanitize input
    const sanitizedQuestion = chatbotService.sanitizeInput(question);

    // Process query
    const result = await chatbotService.processQuery(sanitizedQuestion, hazard_data || {});

    successResponse(res, result, 'Chatbot response generated successfully');
});

/**
 * @desc    Get chatbot suggestions
 * @route   POST /api/ai/chatbot/suggestions
 * @access  Public/Optional Auth
 */
exports.getChatbotSuggestions = asyncHandler(async (req, res) => {
    const { hazard_data } = req.body;

    const suggestions = chatbotService.getSuggestions(hazard_data || {});

    successResponse(res, { suggestions }, 'Suggestions retrieved successfully');
});

/**
 * @desc    Analyze location risk
 * @route   POST /api/ai/analyze-risk
 * @access  Public/Optional Auth
 */
exports.analyzeRisk = asyncHandler(async (req, res) => {
    const {
        latitude,
        longitude,
        risk_score,
        q50,
        q80,
        flood_risk,
        ashfall_risk,
        elevation,
        distance_to_volcano
    } = req.body;

    if (!latitude || !longitude) {
        return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    const hazardData = {
        risk_score,
        q50,
        q80,
        flood_risk,
        ashfall_risk,
        elevation,
        distance_to_volcano
    };

    const analysis = await riskAnalysisService.analyzeLocationRisk(
        latitude,
        longitude,
        hazardData
    );

    successResponse(res, { analysis }, 'Risk analysis completed successfully');
});

/**
 * @desc    Analyze barangay risk
 * @route   GET /api/ai/analyze-risk/barangay/:id
 * @access  Public/Optional Auth
 */
exports.analyzeBarangayRisk = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const analysis = await riskAnalysisService.analyzeBarangayRisk(id);

    successResponse(res, { analysis }, 'Barangay risk analysis completed successfully');
});

/**
 * @desc    Get multi-hazard analysis
 * @route   POST /api/ai/analyze-risk/multi-hazard
 * @access  Public/Optional Auth
 */
exports.getMultiHazardAnalysis = asyncHandler(async (req, res) => {
    const { hazard_data } = req.body;

    if (!hazard_data) {
        return errorResponse(res, 'Hazard data is required', 400);
    }

    const analysis = await riskAnalysisService.getMultiHazardAnalysis(hazard_data);

    successResponse(res, { analysis }, 'Multi-hazard analysis completed successfully');
});

/**
 * @desc    Get route recommendation
 * @route   POST /api/ai/route-recommendation
 * @access  Public/Optional Auth
 */
exports.getRouteRecommendation = asyncHandler(async (req, res) => {
    const {
        origin,
        destination,
        flood_risk,
        ashfall_risk,
        wind_direction,
        avoid_high_risk
    } = req.body;

    if (!origin || !destination) {
        return errorResponse(res, 'Origin and destination are required', 400);
    }

    const hazardData = {
        flood_risk,
        ashfall_risk,
        wind_direction,
        avoid_high_risk
    };

    const recommendation = await routeRecommendationService.getRouteRecommendation(
        origin,
        destination,
        hazardData
    );

    successResponse(res, { recommendation }, 'Route recommendation generated successfully');
});

/**
 * @desc    Find nearest evacuation center
 * @route   POST /api/ai/route-recommendation/evacuation-center
 * @access  Public/Optional Auth
 */
exports.findNearestEvacuationCenter = asyncHandler(async (req, res) => {
    const { latitude, longitude, barangay_id } = req.body;

    if (!latitude || !longitude) {
        return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    const result = await routeRecommendationService.findNearestEvacuationCenter(
        latitude,
        longitude,
        barangay_id
    );

    if (!result.found) {
        return errorResponse(res, result.message, 404);
    }

    successResponse(res, result, 'Nearest evacuation center found successfully');
});

/**
 * @desc    Get route hazard score
 * @route   POST /api/ai/route-recommendation/hazard-score
 * @access  Public/Optional Auth
 */
exports.getRouteHazardScore = asyncHandler(async (req, res) => {
    const { route_points, hazard_data } = req.body;

    if (!route_points || !Array.isArray(route_points) || route_points.length === 0) {
        return errorResponse(res, 'Route points array is required', 400);
    }

    const score = await routeRecommendationService.getRouteHazardScore(
        route_points,
        hazard_data || {}
    );

    successResponse(res, { score }, 'Route hazard score calculated successfully');
});

/**
 * @desc    Check route incidents
 * @route   POST /api/ai/route-recommendation/check-incidents
 * @access  Public/Optional Auth
 */
exports.checkRouteIncidents = asyncHandler(async (req, res) => {
    const { barangay_ids } = req.body;

    if (!barangay_ids || !Array.isArray(barangay_ids) || barangay_ids.length === 0) {
        return errorResponse(res, 'Barangay IDs array is required', 400);
    }

    const result = await routeRecommendationService.checkRouteIncidents(barangay_ids);

    successResponse(res, result, 'Route incidents checked successfully');
});

/**
 * @desc    Get AI service health status
 * @route   GET /api/ai/health
 * @access  Public
 */
exports.getHealthStatus = asyncHandler(async (req, res) => {
    const groqConfigured = !!process.env.GROQ_API_KEY;

    successResponse(res, {
        status: 'operational',
        services: {
            chatbot: 'available',
            risk_analysis: 'available',
            route_recommendation: 'available',
            wind_ashfall: 'available'
        },
        groq_api: groqConfigured ? 'configured' : 'not_configured',
        fallback_mode: !groqConfigured
    }, 'AI service health check completed');
});

/**
 * @desc    Calculate wind-based ashfall risk
 * @route   POST /api/ai/ashfall-risk
 * @access  Public/Optional Auth
 */
exports.calculateAshfallRisk = asyncHandler(async (req, res) => {
    const { latitude, longitude, wind_direction, wind_speed } = req.body;

    if (!latitude || !longitude) {
        return errorResponse(res, 'Latitude and longitude are required', 400);
    }

    if (!wind_direction) {
        return errorResponse(res, 'Wind direction is required (N, NE, E, SE, S, SW, W, NW)', 400);
    }

    if (wind_speed === undefined || wind_speed === null) {
        return errorResponse(res, 'Wind speed is required (in km/h)', 400);
    }

    const riskData = windAshfallService.calculateAshfallRisk(
        parseFloat(latitude),
        parseFloat(longitude),
        wind_direction,
        parseFloat(wind_speed)
    );

    const description = windAshfallService.getAshfallRiskDescription(riskData);

    successResponse(res, {
        ...riskData,
        description
    }, 'Ashfall risk calculated successfully');
});

/**
 * @desc    Calculate wind-based ashfall risk for multiple locations
 * @route   POST /api/ai/ashfall-risk/batch
 * @access  Public/Optional Auth
 */
exports.calculateBatchAshfallRisk = asyncHandler(async (req, res) => {
    const { locations, wind_direction, wind_speed } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return errorResponse(res, 'Locations array is required', 400);
    }

    if (!wind_direction) {
        return errorResponse(res, 'Wind direction is required (N, NE, E, SE, S, SW, W, NW)', 400);
    }

    if (wind_speed === undefined || wind_speed === null) {
        return errorResponse(res, 'Wind speed is required (in km/h)', 400);
    }

    const results = windAshfallService.calculateBatchAshfallRisk(
        locations,
        wind_direction,
        parseFloat(wind_speed)
    );

    successResponse(res, {
        locations: results,
        wind_direction,
        wind_speed,
        total_locations: results.length
    }, 'Batch ashfall risk calculated successfully');
});
