/**
 * Chatbot Service
 * Context-aware disaster response chatbot
 */

const aiService = require('./aiService');
const logger = require('../utils/logger');

class ChatbotService {
    /**
     * Process chatbot query with hazard context
     */
    async processQuery(question, hazardData = {}) {
        try {
            // Build hazard context
            const context = aiService.buildHazardContext(hazardData);

            // SAFETY OVERRIDE: Check for high-risk conditions
            const safetyMessage = aiService.getSafetyOverrideMessage(
                hazardData.flood_risk,
                hazardData.ashfall_risk
            );

            if (safetyMessage) {
                logger.info('Safety override triggered for chatbot query');
                return {
                    reply: safetyMessage,
                    context: context,
                    source: 'safety_override'
                };
            }

            // Check for specific ashfall questions with high risk
            const questionLower = question.toLowerCase().trim();
            if (questionLower.includes('ashfall') && context.ashfall_risk === 'high') {
                return {
                    reply: `The ashfall risk in your area is ${hazardData.ashfall_risk}, so the area is not safe and ashfall exposure is likely. Stay indoors and seal windows.`,
                    context: context,
                    source: 'specific_override'
                };
            }

            // Try to get AI response
            try {
                const aiReply = await this.getAIResponse(question, context);
                return {
                    reply: aiReply,
                    context: context,
                    source: 'ai'
                };
            } catch (aiError) {
                logger.warn('AI service unavailable, using fallback:', aiError.message);

                // Use fallback response
                const fallbackReply = aiService.getFallbackResponse(question, context);
                return {
                    reply: fallbackReply,
                    context: context,
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
    async getAIResponse(question, context) {
        // Build system prompt (matching old app.py behavior)
        const systemPrompt = `You are a Smart City Disaster Response Assistant for Lipa City, Philippines.

Your role is to help citizens understand disaster risks and stay safe during emergencies.

CRITICAL SAFETY RULES:
1. If Flood Risk OR Ashfall Risk is HIGH or VERY HIGH, the area is NOT SAFE
2. NEVER describe an area as safe when any risk is HIGH
3. Always prioritize safety over reassurance
4. Be direct and honest about dangers
5. Consider wind direction when explaining ashfall risk

RESPONSE STYLE:
- Maximum 2 short sentences only
- Each sentence must be short and direct
- Natural and conversational tone (sound human)
- No symbols, no formatting, no deep words
- Just a clear answer
- Do NOT explain too much
- Do NOT repeat ideas
- Keep it concise and straight to the point

Your response MUST be no more than 2 short sentences.`;

        // Build user prompt with context (matching old app.py format)
        const userPrompt = `Use the data to give a short, clear, and natural answer.

Flood Risk: ${context.flood_risk}
Ashfall Risk: ${context.ashfall_risk}
Wind Direction: ${context.wind_direction}
Location: ${context.barangay_name}

Guidelines:
- If Flood Risk OR Ashfall Risk is High or Very High, the area is NOT SAFE
- Never describe the area as safe if any risk is High
- Always prioritize safety over reassurance
- If mixed risks, mention the highest risk clearly
- Consider wind when explaining ashfall

Style:
- Sound natural and human
- No symbols, no formatting - Just a clear answer - no deep words

STRICT RULES:
- Maximum of 2 sentences only
- Each sentence must be short and direct
- Do NOT explain too much
- Do NOT repeat ideas
- Keep it concise and straight to the point

Your response MUST be no more than 2 short sentences.

Question: ${question}`;

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

        // Call Groq API with same settings as old app.py
        const reply = await aiService.callGroqAPI(messages, {
            model: 'llama-3.1-8b-instant', // Same model as old app.py
            temperature: 0.7,
            max_tokens: 150 // Limit response length to enforce 2 sentences
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
