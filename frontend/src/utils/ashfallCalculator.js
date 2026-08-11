/**
 * Ashfall Risk Calculator
 * Calculates ashfall risk based on distance from Taal Volcano and wind direction
 * Updated with correct Taal coordinates and wind logic
 */

// Taal Volcano coordinates (accurate location)
export const TAAL_VOLCANO = {
    lat: 14.0106,
    lng: 120.9975,
};

// Wind direction angles (degrees from North)
export const WIND_DIRECTIONS = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
};

/**
 * Calculate distance between two points (Haversine formula)
 */
export const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Calculate bearing from point A to point B
 */
export const getBearing = (lat1, lng1, lat2, lng2) => {
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos((lat2 * Math.PI) / 180);
    const x =
        Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
        Math.sin((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    return bearing;
};

/**
 * Calculate wind alignment factor
 * Returns higher value if location is downwind from Taal
 * IMPORTANT: Wind direction is WHERE wind comes FROM
 * Ashfall goes in the OPPOSITE direction (where wind goes TO)
 */
export const getWindAlignment = (bearing, windDirection = 'E') => {
    const windFromAngle = WIND_DIRECTIONS[windDirection] || 90;

    // Ashfall goes OPPOSITE to wind direction
    const ashfallDirection = (windFromAngle + 180) % 360;

    // Calculate angular difference between ashfall direction and location bearing
    const diff = Math.abs(bearing - ashfallDirection);
    const normalizedDiff = Math.min(diff, 360 - diff);

    // Higher factor = location is more aligned with ashfall path
    if (normalizedDiff <= 30) return 2.0; // Directly downwind (high risk)
    if (normalizedDiff <= 60) return 1.5; // Partially downwind
    if (normalizedDiff <= 90) return 1.0; // Somewhat aligned
    if (normalizedDiff <= 120) return 0.5; // Perpendicular
    return 0.2; // Upwind (protected, low risk)
};

/**
 * Calculate ashfall risk for a barangay
 * Returns risk level based on distance and wind alignment
 */
export const calculateAshfallRisk = (barangayLat, barangayLng, windDirection = 'E') => {
    // Calculate distance from Taal
    const taalDistance = getDistance(
        barangayLat,
        barangayLng,
        TAAL_VOLCANO.lat,
        TAAL_VOLCANO.lng
    );

    // Calculate bearing from Taal to barangay
    const bearing = getBearing(
        TAAL_VOLCANO.lat,
        TAAL_VOLCANO.lng,
        barangayLat,
        barangayLng
    );

    // Get wind alignment factor
    const windFactor = getWindAlignment(bearing, windDirection);

    // Distance-based risk factor (closer = higher risk)
    // 0-10 km: 1.0, 10-20 km: 0.8, 20-30 km: 0.6, 30-50 km: 0.4, 50+ km: 0.2
    let distanceFactor;
    if (taalDistance < 10) distanceFactor = 1.0;
    else if (taalDistance < 20) distanceFactor = 0.8;
    else if (taalDistance < 30) distanceFactor = 0.6;
    else if (taalDistance < 50) distanceFactor = 0.4;
    else distanceFactor = 0.2;

    // Combined risk score (0-2.0 scale)
    const ashfallScore = distanceFactor * windFactor;

    // Classify risk level
    let ashfallLevel = 'Low';
    if (ashfallScore >= 1.4) {
        ashfallLevel = 'Very High';
    } else if (ashfallScore >= 1.0) {
        ashfallLevel = 'High';
    } else if (ashfallScore >= 0.6) {
        ashfallLevel = 'Moderate';
    } else if (ashfallScore >= 0.3) {
        ashfallLevel = 'Low';
    } else {
        ashfallLevel = 'Very Low';
    }

    return {
        level: ashfallLevel,
        score: ashfallScore,
        distance: taalDistance,
        bearing: bearing,
        windFactor: windFactor,
        distanceFactor: distanceFactor,
    };
};

/**
 * Get wind direction name from degrees
 */
export const getWindDirectionName = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

/**
 * Convert wind direction name to degrees
 */
export const windDirectionToDegrees = (direction) => {
    return WIND_DIRECTIONS[direction] || 90;
};
