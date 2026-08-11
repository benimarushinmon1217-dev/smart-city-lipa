/**
 * Risk Analysis Service
 * Comprehensive risk assessment and analysis
 */

const aiService = require('./aiService');
const { Barangay, Incident, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class RiskAnalysisService {
    /**
     * Analyze risk for a specific location
     */
    async analyzeLocationRisk(latitude, longitude, hazardData = {}) {
        try {
            const {
                risk_score = 0,
                q50 = 0.5,
                q80 = 0.8,
                flood_risk,
                ashfall_risk,
                elevation,
                distance_to_volcano
            } = hazardData;

            // Calculate risk level
            const riskLevel = aiService.calculateRiskLevel(risk_score, q50, q80);

            // Determine specific risks
            const floodRiskLevel = aiService.normalizeRiskLevel(flood_risk);
            const ashfallRiskLevel = aiService.normalizeRiskLevel(ashfall_risk);

            // Calculate overall safety
            const isSafe = aiService.isAreaSafe(flood_risk, ashfall_risk);

            // Get risk factors
            const riskFactors = this.identifyRiskFactors({
                flood_risk: floodRiskLevel,
                ashfall_risk: ashfallRiskLevel,
                elevation,
                distance_to_volcano
            });

            // Get recommendations
            const recommendations = this.getRecommendations({
                flood_risk: floodRiskLevel,
                ashfall_risk: ashfallRiskLevel,
                is_safe: isSafe
            });

            return {
                overall_risk: riskLevel,
                risk_score: parseFloat(risk_score),
                flood_risk: floodRiskLevel,
                ashfall_risk: ashfallRiskLevel,
                is_safe: isSafe,
                risk_factors: riskFactors,
                recommendations: recommendations,
                location: {
                    latitude,
                    longitude,
                    elevation,
                    distance_to_volcano
                }
            };
        } catch (error) {
            logger.error('Error in analyzeLocationRisk:', error);
            throw error;
        }
    }

    /**
     * Analyze risk for a barangay
     */
    async analyzeBarangayRisk(barangayId) {
        try {
            // Get barangay data
            const barangay = await Barangay.findByPk(barangayId);

            if (!barangay) {
                throw new Error('Barangay not found');
            }

            // Get recent incidents in barangay
            const recentIncidents = await Incident.count({
                where: {
                    barangay_id: barangayId,
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            });

            // Get critical incidents
            const criticalIncidents = await Incident.count({
                where: {
                    barangay_id: barangayId,
                    severity: 'critical',
                    status: {
                        [Op.in]: ['reported', 'verified', 'responding']
                    }
                }
            });

            // Calculate barangay risk score
            const barangayRiskScore = this.calculateBarangayRiskScore({
                base_risk: barangay.risk_level,
                recent_incidents: recentIncidents,
                critical_incidents: criticalIncidents,
                population: barangay.population
            });

            return {
                barangay_id: barangayId,
                barangay_name: barangay.name,
                base_risk_level: barangay.risk_level,
                calculated_risk_score: barangayRiskScore,
                recent_incidents: recentIncidents,
                critical_incidents: criticalIncidents,
                population: barangay.population,
                risk_assessment: this.getBarangayRiskAssessment(barangayRiskScore),
                recommendations: this.getBarangayRecommendations(barangayRiskScore, criticalIncidents)
            };
        } catch (error) {
            logger.error('Error in analyzeBarangayRisk:', error);
            throw error;
        }
    }

    /**
     * Get multi-hazard risk analysis
     */
    async getMultiHazardAnalysis(hazardData) {
        try {
            const context = aiService.buildHazardContext(hazardData);

            // Analyze each hazard
            const hazards = [];

            // Flood hazard
            if (context.flood_risk !== 'unknown') {
                hazards.push({
                    type: 'flood',
                    level: context.flood_risk,
                    severity: this.getRiskSeverityScore(context.flood_risk),
                    description: this.getHazardDescription('flood', context.flood_risk)
                });
            }

            // Ashfall hazard
            if (context.ashfall_risk !== 'unknown') {
                hazards.push({
                    type: 'ashfall',
                    level: context.ashfall_risk,
                    severity: this.getRiskSeverityScore(context.ashfall_risk),
                    description: this.getHazardDescription('ashfall', context.ashfall_risk)
                });
            }

            // Sort by severity (highest first)
            hazards.sort((a, b) => b.severity - a.severity);

            // Determine primary hazard
            const primaryHazard = hazards.length > 0 ? hazards[0] : null;

            // Calculate combined risk
            const combinedRisk = this.calculateCombinedRisk(hazards);

            return {
                primary_hazard: primaryHazard,
                all_hazards: hazards,
                combined_risk_level: combinedRisk,
                is_safe: context.is_safe,
                immediate_actions: this.getImmediateActions(hazards),
                long_term_preparations: this.getLongTermPreparations(hazards)
            };
        } catch (error) {
            logger.error('Error in getMultiHazardAnalysis:', error);
            throw error;
        }
    }

    /**
     * Identify risk factors
     */
    identifyRiskFactors(data) {
        const factors = [];

        if (data.flood_risk === 'high') {
            factors.push({
                factor: 'High Flood Risk',
                severity: 'critical',
                description: 'Area is prone to severe flooding'
            });
        }

        if (data.ashfall_risk === 'high') {
            factors.push({
                factor: 'High Ashfall Risk',
                severity: 'critical',
                description: 'Area is exposed to volcanic ashfall'
            });
        }

        if (data.elevation && parseFloat(data.elevation) < 100) {
            factors.push({
                factor: 'Low Elevation',
                severity: 'medium',
                description: 'Low-lying area susceptible to flooding'
            });
        }

        if (data.distance_to_volcano && parseFloat(data.distance_to_volcano) < 10) {
            factors.push({
                factor: 'Proximity to Volcano',
                severity: 'high',
                description: 'Close to volcanic hazard zone'
            });
        }

        return factors;
    }

    /**
     * Get safety recommendations
     */
    getRecommendations(data) {
        const recommendations = [];

        if (!data.is_safe) {
            recommendations.push({
                priority: 'immediate',
                action: 'Evacuate to designated evacuation center',
                reason: 'High hazard levels detected'
            });
        }

        if (data.flood_risk === 'high') {
            recommendations.push({
                priority: 'immediate',
                action: 'Move to higher ground immediately',
                reason: 'High flood risk'
            });
            recommendations.push({
                priority: 'immediate',
                action: 'Avoid crossing flooded areas',
                reason: 'Risk of drowning or injury'
            });
        }

        if (data.ashfall_risk === 'high') {
            recommendations.push({
                priority: 'immediate',
                action: 'Stay indoors and seal windows/doors',
                reason: 'High ashfall risk'
            });
            recommendations.push({
                priority: 'immediate',
                action: 'Wear N95 masks if going outside',
                reason: 'Protect from ash inhalation'
            });
        }

        if (data.flood_risk === 'medium' || data.ashfall_risk === 'medium') {
            recommendations.push({
                priority: 'high',
                action: 'Prepare emergency kit and evacuation plan',
                reason: 'Moderate risk levels'
            });
            recommendations.push({
                priority: 'high',
                action: 'Monitor official updates regularly',
                reason: 'Conditions may change rapidly'
            });
        }

        return recommendations;
    }

    /**
     * Calculate barangay risk score
     */
    calculateBarangayRiskScore(data) {
        let score = 0;

        // Base risk contribution (0-40 points)
        const riskMap = { low: 10, medium: 25, high: 40 };
        score += riskMap[data.base_risk] || 0;

        // Recent incidents contribution (0-30 points)
        score += Math.min(data.recent_incidents * 2, 30);

        // Critical incidents contribution (0-30 points)
        score += Math.min(data.critical_incidents * 10, 30);

        return Math.min(score, 100); // Cap at 100
    }

    /**
     * Get barangay risk assessment
     */
    getBarangayRiskAssessment(score) {
        if (score >= 70) {
            return 'Critical - Immediate action required';
        } else if (score >= 50) {
            return 'High - Enhanced monitoring needed';
        } else if (score >= 30) {
            return 'Moderate - Regular monitoring';
        } else {
            return 'Low - Normal conditions';
        }
    }

    /**
     * Get barangay recommendations
     */
    getBarangayRecommendations(score, criticalIncidents) {
        const recommendations = [];

        if (score >= 70 || criticalIncidents > 0) {
            recommendations.push('Deploy emergency response teams');
            recommendations.push('Activate evacuation protocols');
            recommendations.push('Establish emergency operations center');
        } else if (score >= 50) {
            recommendations.push('Increase monitoring frequency');
            recommendations.push('Prepare evacuation centers');
            recommendations.push('Alert emergency responders');
        } else if (score >= 30) {
            recommendations.push('Maintain regular monitoring');
            recommendations.push('Conduct community awareness programs');
            recommendations.push('Update emergency contact lists');
        } else {
            recommendations.push('Continue routine monitoring');
            recommendations.push('Maintain preparedness plans');
        }

        return recommendations;
    }

    /**
     * Get risk severity score (0-100)
     */
    getRiskSeverityScore(level) {
        const scoreMap = {
            'low': 25,
            'medium': 50,
            'high': 100,
            'critical': 100,
            'unknown': 0
        };
        return scoreMap[level] || 0;
    }

    /**
     * Get hazard description
     */
    getHazardDescription(type, level) {
        const descriptions = {
            flood: {
                low: 'Minimal flooding expected',
                medium: 'Moderate flooding possible in low-lying areas',
                high: 'Severe flooding likely, evacuation recommended'
            },
            ashfall: {
                low: 'Light ashfall possible',
                medium: 'Moderate ashfall expected, limit outdoor activities',
                high: 'Heavy ashfall expected, stay indoors'
            }
        };

        return descriptions[type]?.[level] || 'Risk level unknown';
    }

    /**
     * Calculate combined risk from multiple hazards
     */
    calculateCombinedRisk(hazards) {
        if (hazards.length === 0) return 'unknown';

        const maxSeverity = Math.max(...hazards.map(h => h.severity));

        if (maxSeverity >= 100) return 'high';
        if (maxSeverity >= 50) return 'medium';
        return 'low';
    }

    /**
     * Get immediate actions for hazards
     */
    getImmediateActions(hazards) {
        const actions = [];

        hazards.forEach(hazard => {
            if (hazard.severity >= 100) {
                if (hazard.type === 'flood') {
                    actions.push('Evacuate to higher ground immediately');
                } else if (hazard.type === 'ashfall') {
                    actions.push('Stay indoors and seal all openings');
                }
            }
        });

        if (actions.length === 0) {
            actions.push('Monitor official updates');
            actions.push('Prepare emergency supplies');
        }

        return actions;
    }

    /**
     * Get long-term preparations
     */
    getLongTermPreparations(hazards) {
        return [
            'Maintain emergency kit with 3-day supplies',
            'Know evacuation routes and centers',
            'Keep important documents in waterproof container',
            'Establish family communication plan',
            'Stay informed through official channels'
        ];
    }
}

module.exports = new RiskAnalysisService();
