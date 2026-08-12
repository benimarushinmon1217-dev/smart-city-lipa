/**
 * Chatbot Service
 * Context-aware disaster response chatbot
 */

const aiService = require('./aiService');
const routeRecommendationService = require('./routeRecommendationService');
const logger = require('../utils/logger');

class ChatbotService {
    detectIntent(question) {
        const normalized = String(question || '').toLowerCase().trim();
        const intentPatterns = {
            GREETING: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you'],
            NEAREST_SHELTER: ['nearest shelter', 'closest shelter', 'evacuation center near me', 'where can i evacuate', 'where should i evacuate', 'nearest evacuation', 'closest evacuation', 'shelter near me'],
            HAZARDS: ['hazards near me', 'dangers near me', 'what hazards', 'what is happening near me', 'what hazards are near me', 'hazard near me', 'danger near me'],
            SAFETY_STATUS: ['am i safe', 'is it safe', 'are we safe', 'is my area safe', 'should i be worried', 'is this area safe'],
            EVACUATION: ['should i evacuate', 'do i need to evacuate', 'evacuate now', 'evacuation order', 'need to evacuate'],
            FLOOD: ['flood', 'flooding', 'flood risk', 'water level', 'flooded'],
            ASHFALL: ['ashfall', 'volcanic ash', 'ash', 'taal ash'],
            ROUTE: ['route', 'directions', 'how do i get there', 'how to get to', 'direction to']
        };

        for (const [intent, patterns] of Object.entries(intentPatterns)) {
            if (patterns.some(pattern => normalized.includes(pattern))) {
                return intent;
            }
        }

        return 'GENERAL';
    }

    async getShelterInfo(hazardData = {}) {
        const latitude = Number(hazardData.latitude ?? hazardData.lat);
        const longitude = Number(hazardData.longitude ?? hazardData.lng);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }

        try {
            const result = await routeRecommendationService.findNearestEvacuationCenter(
                latitude,
                longitude,
                hazardData.barangay_id || null
            );

            if (!result || !result.found || !result.nearest) {
                return null;
            }

            return {
                name: result.nearest.name,
                address: result.nearest.address,
                distance_km: Number(result.nearest.distance || 0).toFixed(1),
                contact: result.nearest.contact || null
            };
        } catch (error) {
            logger.warn('Could not fetch shelter info for chatbot request:', error.message);
            return null;
        }
    }

    /**
     * Process chatbot query with hazard context
     */
    async processQuery(question, hazardData = {}) {
        try {
            const context = aiService.buildHazardContext(hazardData);
            const questionLower = question.toLowerCase().trim();
            const intent = this.detectIntent(questionLower);
            const shelterInfo = intent === 'NEAREST_SHELTER' ? await this.getShelterInfo(hazardData) : null;
            const safetyMessage = aiService.getSafetyOverrideMessage(
                hazardData.flood_risk,
                hazardData.ashfall_risk,
                intent
            );

            try {
                const aiReply = await this.getAIResponse(question, context, intent, shelterInfo, safetyMessage);
                return {
                    reply: aiReply,
                    context: context,
                    intent,
                    source: 'ai'
                };
            } catch (aiError) {
                logger.warn('AI service unavailable, using fallback:', aiError.message);

                const fallbackReply = aiService.getFallbackResponse(
                    question,
                    context,
                    intent,
                    shelterInfo,
                    safetyMessage
                );

                return {
                    reply: fallbackReply,
                    context: context,
                    intent,
                    source: 'fallback'
                };
            }
        } catch (error) {
            logger.error('Error in chatbot service:', error);
            throw error;
        }
    }

    /**
     * Get AI-generated response using Groq API
     */
    async getAIResponse(question, context, intent = 'GENERAL', shelterInfo = null, safetyMessage = null) {
        const shelterSummary = shelterInfo
            ? `Nearest shelter: ${shelterInfo.name} (${shelterInfo.distance_km} km away${shelterInfo.address ? `, ${shelterInfo.address}` : ''}).`
            : 'Shelter data is not available in this chat request, so do not invent a shelter.';

        const systemPrompt = `You are the Smart City Lipa Emergency Advisor for Lipa City, Philippines.

Answer the user's actual question first. Use the current hazard context to make the response accurate and safe without replacing unrelated questions with a generic warning.

Safety rules:
- Never claim an area is safe when flood risk or ashfall risk is HIGH or VERY HIGH.
- Do not invent shelters, routes, incidents, distances, or evacuation orders.
- If information is unavailable, say it is unavailable.
- If the situation is dangerous, clearly state that the danger is real, but do not let warnings replace the actual question.
- Keep the answer concise, natural, and conversational.

Response style:
- Usually 2 to 4 short sentences.
- Use short bullets if a list is clearer.
- Do not repeat the same warning in every response.
- Answer the user's question before adding relevant safety context.
- If the user asks a greeting or general question, respond naturally unless a serious immediate warning is necessary.`;

        const userPrompt = `Intent: ${intent}
Question: ${question}
Flood Risk: ${context.flood_risk}
Ashfall Risk: ${context.ashfall_risk}
Wind Direction: ${context.wind_direction}
Wind Speed: ${context.wind_speed}
Barangay: ${context.barangay_name}
Location: ${context.barangay_name}
Available Shelter Info: ${shelterSummary}
Safety Context: ${safetyMessage || 'No immediate high-risk override needed.'}

Instructions:
- Answer the user's actual question first.
- Keep it concise and conversational.
- If the question is about shelter, answer the shelter question first; if shelter data is unavailable, say that shelter information is available through the map or shelter features instead of inventing it.
- If the question is about hazards or safety, summarize the relevant risk clearly.
- If the question is about flood or ashfall risk, explain the concept and current context without repeating the same generic emergency warning.
- If the danger is serious, include a brief safety note after the answer.
- Do not claim the area is safe when the risk is high.
- Do not invent incidents, routes, or distances.
- Do not repeat the same warning multiple times.`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ];

        const reply = await aiService.callGroqAPI(messages, {
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 220
        });

        return reply.trim();
    }

    /**
     * Get contextual suggestions based on hazard levels
     */
    getSuggestions(hazardData) {
        const context = aiService.buildHazardContext(hazardData);
        const suggestions = [];

        // High-risk suggestions
        if (context.flood_risk === 'high') {
            suggestions.push('What should I do during a flood?');
            suggestions.push('Where are the nearest evacuation centers?');
            suggestions.push('How do I prepare an emergency kit?');
        }

        if (context.ashfall_risk === 'high') {
            suggestions.push('How do I protect myself from ashfall?');
            suggestions.push('Is it safe to go outside?');
            suggestions.push('What should I do if ash is falling?');
        }

        // Medium-risk suggestions
        if (context.flood_risk === 'medium' || context.ashfall_risk === 'medium') {
            suggestions.push('Should I evacuate now?');
            suggestions.push('What are the current risk levels?');
            suggestions.push('How can I stay updated?');
        }

        // Low-risk suggestions
        if (context.flood_risk === 'low' && context.ashfall_risk === 'low') {
            suggestions.push('Is my area safe?');
            suggestions.push('What are the current conditions?');
            suggestions.push('How do I prepare for emergencies?');
        }

        // General suggestions
        if (suggestions.length === 0) {
            suggestions.push('What are the current risk levels?');
            suggestions.push('Is my area safe?');
            suggestions.push('What should I prepare?');
        }

        return suggestions.slice(0, 3); // Return max 3 suggestions
    }

    /**
     * Validate and sanitize user input
     */
    sanitizeInput(question) {
        if (!question || typeof question !== 'string') {
            throw new Error('Invalid question format');
        }

        // Remove excessive whitespace
        let sanitized = question.trim().replace(/\s+/g, ' ');

        // Limit length
        if (sanitized.length > 500) {
            sanitized = sanitized.substring(0, 500);
        }

        // Check if question is too short
        if (sanitized.length < 3) {
            throw new Error('Question is too short');
        }

        return sanitized;
    }
}

module.exports = new ChatbotService();
