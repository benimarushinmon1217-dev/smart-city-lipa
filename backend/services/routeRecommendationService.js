/**
 * Route Recommendation Service
 * Intelligent route suggestions based on hazard data
 */

const aiService = require('./aiService');
const { Barangay, Establishment, Incident } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class RouteRecommendationService {
    /**
     * Get safe route recommendation
     */
    async getRouteRecommendation(origin, destination, hazardData = {}) {
        try {
            const {
                flood_risk = 'unknown',
                ashfall_risk = 'unknown',
                wind_direction = 'unknown',
                avoid_high_risk = true
            } = hazardData;

            // Analyze route safety
            const routeSafety = this.analyzeRouteSafety({
                flood_risk,
                ashfall_risk,
                wind_direction
            });

            // Get route warnings
            const warnings = this.getRouteWarnings(routeSafety);

            // Get alternative suggestions if route is unsafe
            const alternatives = routeSafety.is_safe ? [] : await this.getAlternativeRoutes(origin, destination);

            // Get safety recommendations
            const recommendations = this.getRouteSafetyRecommendations(routeSafety);

            return {
                route: {
                    origin,
                    destination,
                    is_safe: routeSafety.is_safe,
                    safety_score: routeSafety.safety_score,
                    estimated_risk_level: routeSafety.overall_risk
                },
                hazards: routeSafety.hazards,
                warnings: warnings,
                recommendations: recommendations,
                alternatives: alternatives
            };
        } catch (error) {
            logger.error('Error in getRouteRecommendation:', error);
            throw error;
        }
    }

    /**
     * Find nearest safe evacuation center
     */
    async findNearestEvacuationCenter(latitude, longitude, barangayId = null) {
        try {
            const whereClause = {
                type: 'evacuation'
            };

            if (barangayId) {
                whereClause.barangay_id = barangayId;
            }

            // Get evacuation centers
            const centers = await Establishment.findAll({
                where: whereClause,
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name', 'flood_risk_level', 'ashfall_risk_level']
                    }
                ]
            });

            if (centers.length === 0) {
                return {
                    found: false,
                    message: 'No evacuation centers found in the area'
                };
            }

            // Calculate distances and sort
            const centersWithDistance = centers.map(center => {
                const distance = this.calculateDistance(
                    latitude,
                    longitude,
                    center.latitude,
                    center.longitude
                );

                return {
                    id: center.id,
                    name: center.name,
                    address: center.address,
                    latitude: center.latitude,
                    longitude: center.longitude,
                    distance: distance,
                    barangay: center.barangay,
                    capacity: center.capacity,
                    contact: center.contact_number
                };
            });

            // Sort by distance
            centersWithDistance.sort((a, b) => a.distance - b.distance);

            return {
                found: true,
                nearest: centersWithDistance[0],
                alternatives: centersWithDistance.slice(1, 4), // Next 3 closest
                total_available: centersWithDistance.length
            };
        } catch (error) {
            logger.error('Error in findNearestEvacuationCenter:', error);
            throw error;
        }
    }

    /**
     * Get hazard-aware route scoring
     */
    async getRouteHazardScore(routePoints, hazardData) {
        try {
            let totalScore = 0;
            let maxRisk = 'low';

            // Analyze each point along the route
            for (const point of routePoints) {
                const pointRisk = this.assessPointRisk(point, hazardData);
                totalScore += pointRisk.score;

                if (this.compareRiskLevels(pointRisk.level, maxRisk) > 0) {
                    maxRisk = pointRisk.level;
                }
            }

            const averageScore = routePoints.length > 0 ? totalScore / routePoints.length : 0;

            return {
                average_score: averageScore,
                max_risk_level: maxRisk,
                is_recommended: maxRisk !== 'high' && averageScore < 70,
                points_analyzed: routePoints.length
            };
        } catch (error) {
            logger.error('Error in getRouteHazardScore:', error);
            throw error;
        }
    }

    /**
     * Check for active incidents along route
     */
    async checkRouteIncidents(barangayIds) {
        try {
            const activeIncidents = await Incident.findAll({
                where: {
                    barangay_id: {
                        [Op.in]: barangayIds
                    },
                    status: {
                        [Op.in]: ['reported', 'verified', 'responding']
                    },
                    severity: {
                        [Op.in]: ['high', 'critical']
                    }
                },
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['severity', 'DESC'], ['created_at', 'DESC']]
            });

            return {
                has_incidents: activeIncidents.length > 0,
                incident_count: activeIncidents.length,
                incidents: activeIncidents.map(incident => ({
                    id: incident.id,
                    type: incident.incident_type,
                    severity: incident.severity,
                    title: incident.title,
                    barangay: incident.barangay.name,
                    created_at: incident.created_at
                }))
            };
        } catch (error) {
            logger.error('Error in checkRouteIncidents:', error);
            throw error;
        }
    }

    /**
     * Analyze route safety
     */
    analyzeRouteSafety(data) {
        const floodRisk = aiService.normalizeRiskLevel(data.flood_risk);
        const ashfallRisk = aiService.normalizeRiskLevel(data.ashfall_risk);

        const hazards = [];
        let safetyScore = 100;

        // Analyze flood risk
        if (floodRisk === 'high') {
            hazards.push({
                type: 'flood',
                level: 'high',
                impact: 'Route may be impassable due to flooding'
            });
            safetyScore -= 50;
        } else if (floodRisk === 'medium') {
            hazards.push({
                type: 'flood',
                level: 'medium',
                impact: 'Possible flooding in low-lying areas'
            });
            safetyScore -= 25;
        }

        // Analyze ashfall risk
        if (ashfallRisk === 'high') {
            hazards.push({
                type: 'ashfall',
                level: 'high',
                impact: 'Poor visibility and road conditions due to ash'
            });
            safetyScore -= 40;
        } else if (ashfallRisk === 'medium') {
            hazards.push({
                type: 'ashfall',
                level: 'medium',
                impact: 'Reduced visibility possible'
            });
            safetyScore -= 20;
        }

        // Determine overall risk
        let overallRisk = 'low';
        if (floodRisk === 'high' || ashfallRisk === 'high') {
            overallRisk = 'high';
        } else if (floodRisk === 'medium' || ashfallRisk === 'medium') {
            overallRisk = 'medium';
        }

        return {
            is_safe: safetyScore >= 50,
            safety_score: Math.max(safetyScore, 0),
            overall_risk: overallRisk,
            hazards: hazards
        };
    }

    /**
     * Get route warnings
     */
    getRouteWarnings(routeSafety) {
        const warnings = [];

        if (!routeSafety.is_safe) {
            warnings.push({
                severity: 'critical',
                message: 'This route is not recommended due to high hazard levels',
                action: 'Consider alternative routes or delay travel'
            });
        }

        routeSafety.hazards.forEach(hazard => {
            if (hazard.level === 'high') {
                warnings.push({
                    severity: 'high',
                    message: `High ${hazard.type} risk along route`,
                    action: hazard.impact
                });
            }
        });

        return warnings;
    }

    /**
     * Get route safety recommendations
     */
    getRouteSafetyRecommendations(routeSafety) {
        const recommendations = [];

        if (!routeSafety.is_safe) {
            recommendations.push('Avoid travel if possible');
            recommendations.push('If travel is necessary, use alternative routes');
            recommendations.push('Travel only during daylight hours');
        }

        routeSafety.hazards.forEach(hazard => {
            if (hazard.type === 'flood' && hazard.level === 'high') {
                recommendations.push('Never attempt to cross flooded roads');
                recommendations.push('Turn around if you encounter water on the road');
            }

            if (hazard.type === 'ashfall' && hazard.level === 'high') {
                recommendations.push('Use headlights even during daytime');
                recommendations.push('Drive slowly due to reduced visibility');
                recommendations.push('Keep windows closed and use air recirculation');
            }
        });

        if (routeSafety.is_safe) {
            recommendations.push('Stay alert for changing conditions');
            recommendations.push('Monitor weather and hazard updates');
            recommendations.push('Have emergency supplies in vehicle');
        }

        return recommendations;
    }

    /**
     * Get alternative routes (placeholder for future implementation)
     */
    async getAlternativeRoutes(origin, destination) {
        // This would integrate with a routing service in production
        return [
            {
                name: 'Alternative Route 1',
                description: 'Via main highway (longer but safer)',
                estimated_safety: 'medium'
            },
            {
                name: 'Alternative Route 2',
                description: 'Via elevated roads (recommended)',
                estimated_safety: 'high'
            }
        ];
    }

    /**
     * Assess risk at a specific point
     */
    assessPointRisk(point, hazardData) {
        // Simplified risk assessment
        const floodRisk = aiService.normalizeRiskLevel(hazardData.flood_risk);
        const ashfallRisk = aiService.normalizeRiskLevel(hazardData.ashfall_risk);

        let score = 0;
        let level = 'low';

        if (floodRisk === 'high') {
            score += 50;
            level = 'high';
        } else if (floodRisk === 'medium') {
            score += 25;
            level = level === 'low' ? 'medium' : level;
        }

        if (ashfallRisk === 'high') {
            score += 40;
            level = 'high';
        } else if (ashfallRisk === 'medium') {
            score += 20;
            level = level === 'low' ? 'medium' : level;
        }

        return { score, level };
    }

    /**
     * Compare risk levels
     */
    compareRiskLevels(level1, level2) {
        const levels = { low: 1, medium: 2, high: 3 };
        return (levels[level1] || 0) - (levels[level2] || 0);
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance; // Distance in km
    }

    /**
     * Convert degrees to radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = new RouteRecommendationService();
