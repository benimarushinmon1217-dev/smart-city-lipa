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
     * Get safety override message (highest priority)
     */
    getSafetyOverrideMessage(floodRisk, ashfallRisk) {
        const normalizedFlood = this.normalizeRiskLevel(floodRisk);
        const normalizedAshfall = this.normalizeRiskLevel(ashfallRisk);

        // Check for high flood risk
        if (normalizedFlood === 'high') {
            return `Your area is not safe due to high flood risk (${floodRisk}). Please evacuate to higher ground immediately and follow official evacuation orders.`;
        }

        // Check for high ashfall risk
        if (normalizedAshfall === 'high') {
            return `Your area is not safe due to high ashfall risk (${ashfallRisk}). Stay indoors, seal windows and doors, and avoid exposure to volcanic ash.`;
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
    getFallbackResponse(question, hazardContext) {
        const questionLower = question.toLowerCase();

        // Flood-related questions
        if (questionLower.includes('flood')) {
            if (hazardContext.flood_risk === 'high') {
                return 'Flood risk in your area is high. Please evacuate to higher ground and follow official instructions.';
            } else if (hazardContext.flood_risk === 'medium') {
                return 'Flood risk is moderate. Stay alert and prepare for possible evacuation.';
            } else {
                return 'Flood risk is currently low, but continue monitoring weather updates.';
            }
        }

        // Ashfall-related questions
        if (questionLower.includes('ashfall') || questionLower.includes('ash')) {
            if (hazardContext.ashfall_risk === 'high') {
                return 'Ashfall risk is high. Stay indoors and avoid exposure to volcanic ash.';
            } else if (hazardContext.ashfall_risk === 'medium') {
                return 'Ashfall risk is moderate. Limit outdoor activities and wear protective masks if going outside.';
            } else {
                return 'Ashfall risk is low, but stay aware of wind direction changes.';
            }
        }

        // Safety-related questions
        if (questionLower.includes('safe')) {
            if (!hazardContext.is_safe) {
                return 'Your area is currently not safe due to high hazard levels. Please follow evacuation orders.';
            } else {
                return 'Current conditions are relatively safe, but continue monitoring official updates.';
            }
        }

        // Evacuation-related questions
        if (questionLower.includes('evacuate') || questionLower.includes('evacuation')) {
            if (!hazardContext.is_safe) {
                return 'Yes, evacuation is recommended. Please proceed to the nearest evacuation center immediately.';
            } else {
                return 'Evacuation is not currently required, but be prepared to evacuate if conditions worsen.';
            }
        }

        // Default response
        return 'Based on current data, please refer to the risk levels on the map and follow official disaster management advisories.';
    }
}

module.exports = new AIService();
