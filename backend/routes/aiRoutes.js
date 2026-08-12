/**
 * AI Routes
 * AI chatbot and risk analysis endpoints
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const aiController = require('../controllers/aiController');
const {
    chatbotValidator,
    chatbotSuggestionsValidator,
    analyzeRiskValidator,
    analyzeBarangayRiskValidator,
    multiHazardAnalysisValidator,
    routeRecommendationValidator,
    findEvacuationCenterValidator,
    roadRouteValidator,
    routeHazardScoreValidator,
    checkRouteIncidentsValidator
} = require('../validators/aiValidator');
const { validate } = require('../middleware/validate');

// Health check
router.get('/health', aiController.getHealthStatus);

// Chatbot endpoints
router.post(
    '/chatbot',
    optionalAuth,
    chatbotValidator,
    validate,
    aiController.chatbot
);

router.post(
    '/chatbot/suggestions',
    optionalAuth,
    chatbotSuggestionsValidator,
    validate,
    aiController.getChatbotSuggestions
);

// Risk analysis endpoints
router.post(
    '/analyze-risk',
    optionalAuth,
    analyzeRiskValidator,
    validate,
    aiController.analyzeRisk
);

router.get(
    '/analyze-risk/barangay/:id',
    optionalAuth,
    analyzeBarangayRiskValidator,
    validate,
    aiController.analyzeBarangayRisk
);

router.post(
    '/analyze-risk/multi-hazard',
    optionalAuth,
    multiHazardAnalysisValidator,
    validate,
    aiController.getMultiHazardAnalysis
);

// Route recommendation endpoints
router.post(
    '/route-recommendation',
    optionalAuth,
    routeRecommendationValidator,
    validate,
    aiController.getRouteRecommendation
);

router.post(
    '/route-recommendation/evacuation-center',
    optionalAuth,
    findEvacuationCenterValidator,
    validate,
    aiController.findNearestEvacuationCenter
);

router.post(
    '/route-recommendation/road-route',
    optionalAuth,
    roadRouteValidator,
    validate,
    aiController.getRoadRoute
);

router.post(
    '/route-recommendation/hazard-score',
    optionalAuth,
    routeHazardScoreValidator,
    validate,
    aiController.getRouteHazardScore
);

router.post(
    '/route-recommendation/check-incidents',
    optionalAuth,
    checkRouteIncidentsValidator,
    validate,
    aiController.checkRouteIncidents
);

// Wind-based ashfall risk endpoints
router.post(
    '/ashfall-risk',
    optionalAuth,
    aiController.calculateAshfallRisk
);

router.post(
    '/ashfall-risk/batch',
    optionalAuth,
    aiController.calculateBatchAshfallRisk
);

module.exports = router;
