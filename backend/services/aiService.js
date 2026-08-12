/**
 * AI Service
 * Core AI logic with Groq API integration
 */

const axios = require('axios');
const logger = require('../utils/logger');

class AIService {
    constructor() {
        this.groqApiKey = process.env.GROQ_API_KEY;
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

        if (!this.groqApiKey) {
            logger.warn('GROQ_API_KEY not found in environment variables. AI features will be limited.');
        }
    }

    /**
     * Call Groq API for chat completion
     */
    async callGroqAPI(messages, options = {}) {
        try {
            if (!this.groqApiKey) {
                throw new Error('Groq API key not configured');
            }

            const response = await axios.post(
                this.groqApiUrl,
                {
                    model: options.model || this.model,
                    messages: messages,
                    temperature: options.temperature || 0.7,
                    max_tokens: options.max_tokens || 500,
                    top_p: options.top_p || 1,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.groqApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 second timeout
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            logger.error('Groq API error:', error.response?.data || error.message);
            throw new Error('AI service temporarily unavailable');
        }
    }

    /**
     * Determine risk level based on score and thresholds
     */
    calculateRiskLevel(score, q50 = 0.5, q80 = 0.8) {
        const numScore = parseFloat(score) || 0;
        const numQ50 = parseFloat(q50) || 0.5;
        const numQ80 = parseFloat(q80) || 0.8;

        if (numScore >= numQ80) {
            return 'high';
        } else if (numScore >= numQ50) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Normalize risk level string
     */
    normalizeRiskLevel(risk) {
        if (!risk) return 'unknown';

        const riskStr = String(risk).toLowerCase().trim();

        if (riskStr.includes('high') || riskStr.includes('critical') || riskStr.includes('very high')) {
            return 'high';
        } else if (riskStr.includes('medium') || riskStr.includes('moderate')) {
            return 'medium';
        } else if (riskStr.includes('low') || riskStr.includes('minimal')) {
            return 'low';
        }

        return 'unknown';
    }

    /**
     * Check if area is safe based on risk levels
     */
    isAreaSafe(floodRisk, ashfallRisk) {
        const normalizedFlood = this.normalizeRiskLevel(floodRisk);
        const normalizedAshfall = this.normalizeRiskLevel(ashfallRisk);

        // Area is NOT safe if either risk is high
        if (normalizedFlood === 'high' || normalizedAshfall === 'high') {
            return false;
        }

        return true;
    }

    /**
     * Get contextual safety message without replacing the user's actual question.
     */
    getSafetyOverrideMessage(floodRisk, ashfallRisk, intent = 'GENERAL') {
        const normalizedFlood = this.normalizeRiskLevel(floodRisk);
        const normalizedAshfall = this.normalizeRiskLevel(ashfallRisk);
        const contextualIntents = new Set([
            'NEAREST_SHELTER',
            'HAZARDS',
            'SAFETY_STATUS',
            'EVACUATION',
            'FLOOD',
            'ASHFALL',
            'ROUTE',
            'GENERAL'
        ]);

        if (!contextualIntents.has(intent)) {
            return null;
        }

        if (normalizedFlood === 'high') {
            return `Your area is currently not considered safe because flood risk is high (${floodRisk}). Please move to higher ground and follow official evacuation guidance.`;
        }

        if (normalizedAshfall === 'high') {
            return `Your area is currently not considered safe because ashfall risk is high (${ashfallRisk}). Stay indoors, seal windows and doors, and avoid ash exposure.`;
        }

        return null;
    }

    /**
     * Build context string from hazard data
     */
    buildHazardContext(hazardData) {
        const {
            flood_risk = 'unknown',
            ashfall_risk = 'unknown',
            wind_direction = 'unknown',
            wind_speed = 'unknown',
            elevation = 'unknown',
            distance_to_volcano = 'unknown',
            barangay_name = 'your area'
        } = hazardData;

        return {
            flood_risk: this.normalizeRiskLevel(flood_risk),
            ashfall_risk: this.normalizeRiskLevel(ashfall_risk),
            wind_direction,
            wind_speed,
            elevation,
            distance_to_volcano,
            barangay_name,
            is_safe: this.isAreaSafe(flood_risk, ashfall_risk)
        };
    }

    /**
     * Generate fallback response when AI is unavailable
     */
    getFallbackResponse(question, hazardContext, intent = 'GENERAL', shelterInfo = null, safetyMessage = null) {
        const questionLower = question.toLowerCase();

        if (intent === 'GREETING') {
            return 'Hi! I can help with hazard updates, safety questions, evacuation guidance, or shelter information.';
        }

        if (intent === 'NEAREST_SHELTER') {
            if (shelterInfo && shelterInfo.name) {
                return `The nearest evacuation center available is ${shelterInfo.name}, about ${shelterInfo.distance_km} km away. Please use the map or official shelter info for the most current details.${safetyMessage ? ` ${safetyMessage}` : ''}`;
            }

            return 'I can help locate the nearest shelter through the available map or shelter information. I do not have a verified shelter location in this chat context.';
        }

        if (intent === 'HAZARDS') {
            const riskSummary = [
                hazardContext.flood_risk !== 'low' ? `Flood risk is ${hazardContext.flood_risk}.` : null,
                hazardContext.ashfall_risk !== 'low' ? `Ashfall risk is ${hazardContext.ashfall_risk}.` : null
            ].filter(Boolean).join(' ');

            return riskSummary || 'Current hazard information is limited, but please keep monitoring official advisories.';
        }

        if (intent === 'SAFETY_STATUS') {
            if (!hazardContext.is_safe) {
                return `Your area is currently not considered safe because the current risk level is elevated. ${safetyMessage || 'Please follow official advisories and stay alert.'}`;
            }
            return 'Current conditions are relatively stable, but continue monitoring official updates and local advisories.';
        }

        if (intent === 'EVACUATION') {
            if (!hazardContext.is_safe) {
                return 'Evacuation guidance is important for your current conditions. Move to a safe, higher location and follow official evacuation instructions.';
            }
            return 'Evacuation is not currently required based on the available information, but stay prepared if conditions change.';
        }

        if (intent === 'FLOOD') {
            if (hazardContext.flood_risk === 'high') {
                return `Flood risk is high in your current area. This means the risk of flooding is significant, and you should avoid low-lying areas and follow official guidance.${safetyMessage ? ` ${safetyMessage}` : ''}`;
            }
            return `Flood risk is currently ${hazardContext.flood_risk}. Stay alert to heavy rain and avoid low-lying areas if conditions worsen.`;
        }

        if (intent === 'ASHFALL') {
            if (hazardContext.ashfall_risk === 'high') {
                return `Ashfall risk is high. Stay indoors, keep windows closed, and avoid ash exposure.${safetyMessage ? ` ${safetyMessage}` : ''}`;
            }
            return `Ashfall risk is currently ${hazardContext.ashfall_risk}. Keep an eye on wind conditions and local advisories if ash is expected.`;
        }

        if (intent === 'ROUTE') {
            return 'I can help with route guidance, but route details should be taken from the map or available route tools in this app.';
        }

        if (questionLower.includes('flood')) {
            return `Flood risk is currently ${hazardContext.flood_risk}. This means your area is experiencing ${hazardContext.flood_risk === 'high' ? 'elevated flood risk' : 'a moderate or low flood risk'} under current conditions.`;
        }

        if (questionLower.includes('ashfall') || questionLower.includes('ash')) {
            return `Ashfall risk is currently ${hazardContext.ashfall_risk}. Use the current wind and ashfall context when deciding whether to stay indoors or limit outdoor exposure.`;
        }

        if (questionLower.includes('safe')) {
            if (!hazardContext.is_safe) {
                return safetyMessage || 'Your area is currently not considered safe because the current risk level is elevated.';
            }
            return 'Current conditions appear relatively stable, but continue monitoring official advisories and local updates.';
        }

        if (questionLower.includes('evacuate') || questionLower.includes('evacuation')) {
            if (!hazardContext.is_safe) {
                return 'Evacuation guidance is important under the current conditions. Follow official instructions and move to a safe location.';
            }
            return 'Evacuation is not currently required based on the available risk information, but remain prepared if conditions change.';
        }

        return 'I can help with current risk levels, safety guidance, evacuation advice, and hazard updates. Please ask a more specific question.';
    }
}

module.exports = new AIService();
