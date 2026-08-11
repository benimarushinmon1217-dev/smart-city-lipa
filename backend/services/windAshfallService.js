/**
 * Wind-Based Ashfall Risk Service
 * Calculate ashfall risk based on wind direction and speed from Taal Volcano
 */

const logger = require('../utils/logger');

// Taal Volcano coordinates (from user data)
const TAAL_VOLCANO = {
    latitude: 14.0106,
    longitude: 120.9975
};

class WindAshfallService {
    /**
     * Calculate distance between two coordinates (Haversine formula)
     * Returns distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Calculate bearing (direction) from volcano to location
     * Returns bearing in degrees (0-360)
     */
    calculateBearing(lat1, lon1, lat2, lon2) {
        const dLon = this.toRadians(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(this.toRadians(lat2));
        const x = Math.cos(this.toRadians(lat1)) * Math.sin(this.toRadians(lat2)) -
            Math.sin(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.cos(dLon);

        let bearing = Math.atan2(y, x);
        bearing = this.toDegrees(bearing);
        bearing = (bearing + 360) % 360; // Normalize to 0-360

        return bearing;
    }

    /**
     * Convert degrees to radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Convert wind direction string to degrees
     * Wind direction indicates WHERE the wind is COMING FROM
     */
    windDirectionToDegrees(direction) {
        const directionMap = {
            'N': 0,
            'NNE': 22.5,
            'NE': 45,
            'ENE': 67.5,
            'E': 90,
            'ESE': 112.5,
            'SE': 135,
            'SSE': 157.5,
            'S': 180,
            'SSW': 202.5,
            'SW': 225,
            'WSW': 247.5,
            'W': 270,
            'WNW': 292.5,
            'NW': 315,
            'NNW': 337.5
        };

        const upperDirection = direction.toUpperCase().trim();
        return directionMap[upperDirection] || 0;
    }

    /**
     * Calculate angular difference between two bearings
     * Returns the smallest angle difference (0-180 degrees)
     */
    calculateAngularDifference(bearing1, bearing2) {
        let diff = Math.abs(bearing1 - bearing2);
        if (diff > 180) {
            diff = 360 - diff;
        }
        return diff;
    }

    /**
     * Calculate wind speed factor (0-1 scale)
     * Higher wind speed = more ashfall dispersion
     */
    calculateWindSpeedFactor(windSpeed) {
        // Wind speed in km/h
        // Calm: 0-10 km/h = 0.1
        // Light: 10-20 km/h = 0.3
        // Moderate: 20-30 km/h = 0.5
        // Strong: 30-45 km/h = 0.7
        // Very Strong: 45-60 km/h = 0.9
        // Extreme: 60+ km/h = 1.0

        if (windSpeed < 10) return 0.1;
        if (windSpeed < 20) return 0.3;
        if (windSpeed < 30) return 0.5;
        if (windSpeed < 45) return 0.7;
        if (windSpeed < 60) return 0.9;
        return 1.0;
    }

    /**
     * Calculate ashfall risk for a location based on wind conditions
     * 
     * @param {number} latitude - Location latitude
     * @param {number} longitude - Location longitude
     * @param {string} windDirection - Wind direction (N, NE, E, SE, S, SW, W, NW)
     * @param {number} windSpeed - Wind speed in km/h
     * @returns {object} Ashfall risk assessment
     */
    calculateAshfallRisk(latitude, longitude, windDirection, windSpeed) {
        try {
            // Calculate distance from Taal Volcano
            const distance = this.calculateDistance(
                TAAL_VOLCANO.latitude,
                TAAL_VOLCANO.longitude,
                latitude,
                longitude
            );

            // Calculate bearing from volcano to location
            const bearingToLocation = this.calculateBearing(
                TAAL_VOLCANO.latitude,
                TAAL_VOLCANO.longitude,
                latitude,
                longitude
            );

            // Convert wind direction to degrees
            // Wind direction is WHERE wind comes FROM
            // Ashfall goes in the OPPOSITE direction (where wind goes TO)
            const windFromDegrees = this.windDirectionToDegrees(windDirection);
            const ashfallDirection = (windFromDegrees + 180) % 360; // Opposite direction

            // Calculate angular difference between ashfall direction and location bearing
            const angularDiff = this.calculateAngularDifference(ashfallDirection, bearingToLocation);

            // Calculate directional alignment factor (0-1)
            // 0 degrees difference = 1.0 (directly downwind)
            // 90 degrees difference = 0.0 (perpendicular)
            // 180 degrees difference = 0.0 (upwind)
            const alignmentFactor = Math.max(0, Math.cos(this.toRadians(angularDiff)));

            // Calculate distance factor (0-1)
            // Closer to volcano = higher risk
            // 0-10 km = 1.0 (very high)
            // 10-20 km = 0.8 (high)
            // 20-30 km = 0.6 (medium-high)
            // 30-50 km = 0.4 (medium)
            // 50-70 km = 0.2 (low)
            // 70+ km = 0.1 (very low)
            let distanceFactor;
            if (distance < 10) distanceFactor = 1.0;
            else if (distance < 20) distanceFactor = 0.8;
            else if (distance < 30) distanceFactor = 0.6;
            else if (distance < 50) distanceFactor = 0.4;
            else if (distance < 70) distanceFactor = 0.2;
            else distanceFactor = 0.1;

            // Calculate wind speed factor
            const windSpeedFactor = this.calculateWindSpeedFactor(windSpeed);

            // Calculate overall ashfall risk (0-1 scale)
            // Risk = distance factor × alignment factor × wind speed factor
            const ashfallRisk = distanceFactor * alignmentFactor * windSpeedFactor;

            // Determine risk level
            let riskLevel;
            if (ashfallRisk >= 0.7) riskLevel = 'Very High';
            else if (ashfallRisk >= 0.55) riskLevel = 'High';
            else if (ashfallRisk >= 0.4) riskLevel = 'Medium';
            else if (ashfallRisk >= 0.2) riskLevel = 'Low';
            else riskLevel = 'Very Low';

            // Determine if location is downwind
            const isDownwind = angularDiff < 45; // Within 45 degrees of ashfall direction

            logger.info(`Ashfall risk calculated for (${latitude}, ${longitude}): ${riskLevel} (${(ashfallRisk * 100).toFixed(1)}%)`);

            return {
                ashfall_risk: ashfallRisk,
                ashfall_risk_level: riskLevel,
                distance_from_volcano: distance,
                bearing_to_location: bearingToLocation,
                wind_from_direction: windFromDegrees,
                ashfall_direction: ashfallDirection,
                angular_difference: angularDiff,
                is_downwind: isDownwind,
                alignment_factor: alignmentFactor,
                distance_factor: distanceFactor,
                wind_speed_factor: windSpeedFactor,
                wind_direction: windDirection,
                wind_speed: windSpeed
            };
        } catch (error) {
            logger.error('Error calculating ashfall risk:', error);
            throw error;
        }
    }

    /**
     * Get ashfall risk description based on conditions
     */
    getAshfallRiskDescription(riskData) {
        const { ashfall_risk_level, is_downwind, distance_from_volcano, wind_speed } = riskData;

        if (ashfall_risk_level === 'Very High') {
            return `Critical ashfall risk! You are ${distance_from_volcano.toFixed(1)} km from Taal Volcano and directly downwind. Heavy ashfall expected with ${wind_speed} km/h winds. Evacuate immediately or stay indoors with sealed windows and doors.`;
        } else if (ashfall_risk_level === 'High') {
            return `High ashfall risk. You are ${distance_from_volcano.toFixed(1)} km from Taal Volcano${is_downwind ? ' and in the ashfall path' : ''}. Moderate to heavy ashfall possible. Stay indoors and wear N95 masks if going outside.`;
        } else if (ashfall_risk_level === 'Medium') {
            return `Moderate ashfall risk. You are ${distance_from_volcano.toFixed(1)} km from Taal Volcano. Light to moderate ashfall possible depending on wind changes. Monitor conditions and prepare protective equipment.`;
        } else if (ashfall_risk_level === 'Low') {
            return `Low ashfall risk. You are ${distance_from_volcano.toFixed(1)} km from Taal Volcano and not in the primary ashfall path. Minimal ashfall expected, but stay alert for wind direction changes.`;
        } else {
            return `Very low ashfall risk. You are ${distance_from_volcano.toFixed(1)} km from Taal Volcano. Ashfall unlikely at your location with current wind conditions.`;
        }
    }

    /**
     * Calculate ashfall risk for multiple locations (batch processing)
     */
    calculateBatchAshfallRisk(locations, windDirection, windSpeed) {
        return locations.map(location => {
            const risk = this.calculateAshfallRisk(
                location.latitude,
                location.longitude,
                windDirection,
                windSpeed
            );
            return {
                ...location,
                ...risk
            };
        });
    }
}

module.exports = new WindAshfallService();
