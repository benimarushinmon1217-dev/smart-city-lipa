/**
 * Socket Event Handlers
 * Centralized real-time event management
 */

const logger = require('../utils/logger');
const {
    emitToUser,
    emitToBarangay,
    emitToRole,
    broadcast,
    emitToRoute
} = require('../config/socket');

/**
 * Real-time event types
 */
const EVENTS = {
    // Wind & Weather
    WIND_CHANGED: 'wind:changed',
    WIND_SPEED_UPDATED: 'wind:speed:updated',
    WEATHER_ALERT: 'weather:alert',

    // Flood & Hazards
    FLOOD_UPDATED: 'flood:updated',
    FLOOD_ALERT: 'flood:alert',
    ASHFALL_UPDATED: 'ashfall:updated',
    ASHFALL_ALERT: 'ashfall:alert',
    HAZARD_LEVEL_CHANGED: 'hazard:level:changed',

    // Routes & Navigation
    ROUTE_UNSAFE: 'route:unsafe',
    ROUTE_RECOMPUTE: 'route:recompute',
    ROUTE_DANGER_DETECTED: 'route:danger:detected',
    ROUTE_UPDATED: 'route:updated',
    SHELTER_RECOMMENDED: 'shelter:recommended',

    // Incidents & Reports
    INCIDENT_REPORTED: 'incident:reported',
    INCIDENT_UPDATED: 'incident:updated',
    INCIDENT_VERIFIED: 'incident:verified',
    INCIDENT_RESOLVED: 'incident:resolved',
    REPORT_SUBMITTED: 'report:submitted',
    REPORT_STATUS_CHANGED: 'report:status:changed',

    // Announcements & Alerts
    ANNOUNCEMENT_NEW: 'announcement:new',
    ANNOUNCEMENT_UPDATED: 'announcement:updated',
    EMERGENCY_ALERT: 'emergency:alert',
    EVACUATION_ORDER: 'evacuation:order',

    // Notifications
    NOTIFICATION_NEW: 'notification:new',
    NOTIFICATION_READ: 'notification:read',

    // Traffic
    TRAFFIC_UPDATED: 'traffic:updated',
    ROAD_BLOCKED: 'road:blocked',
    ROAD_CLEARED: 'road:cleared',

    // System
    SYSTEM_MAINTENANCE: 'system:maintenance',
    SYSTEM_ALERT: 'system:alert'
};

/**
 * Wind direction changed event
 */
const handleWindChanged = (data) => {
    const { direction, speed, affectedBarangays } = data;

    logger.info(`Wind changed: ${direction} at ${speed} km/h`);

    // Broadcast to all users
    broadcast(EVENTS.WIND_CHANGED, {
        direction,
        speed,
        timestamp: new Date(),
        message: `Wind direction changed to ${direction}`,
        severity: 'info'
    });

    // Notify affected barangays
    if (affectedBarangays && affectedBarangays.length > 0) {
        affectedBarangays.forEach(barangayId => {
            emitToBarangay(barangayId, EVENTS.ASHFALL_ALERT, {
                message: 'Ashfall risk updated due to wind change',
                direction,
                severity: 'warning',
                timestamp: new Date()
            });
        });
    }

    // Trigger route recomputation for active routes
    broadcast(EVENTS.ROUTE_RECOMPUTE, {
        reason: 'wind_changed',
        direction,
        timestamp: new Date()
    });
};

/**
 * Flood level updated event
 */
const handleFloodUpdated = (data) => {
    const { barangayId, barangayName, oldLevel, newLevel, riskScore } = data;

    logger.info(`Flood updated in ${barangayName}: ${oldLevel} → ${newLevel}`);

    // Emit to specific barangay
    emitToBarangay(barangayId, EVENTS.FLOOD_UPDATED, {
        barangayId,
        barangayName,
        oldLevel,
        newLevel,
        riskScore,
        timestamp: new Date()
    });

    // If high risk, send alert
    if (newLevel === 'High' || newLevel === 'Very High') {
        emitToBarangay(barangayId, EVENTS.FLOOD_ALERT, {
            barangayId,
            barangayName,
            level: newLevel,
            message: `⚠️ Flood risk elevated to ${newLevel} in ${barangayName}`,
            severity: 'urgent',
            timestamp: new Date()
        });

        // Notify admins and staff
        emitToRole('admin', EVENTS.FLOOD_ALERT, {
            barangayId,
            barangayName,
            level: newLevel,
            timestamp: new Date()
        });

        emitToRole('staff', EVENTS.FLOOD_ALERT, {
            barangayId,
            barangayName,
            level: newLevel,
            timestamp: new Date()
        });
    }
};

/**
 * Route danger detected event
 */
const handleRouteDanger = (data) => {
    const { userId, routeId, dangerType, location, severity } = data;

    logger.warn(`Route danger detected for user ${userId}: ${dangerType}`);

    // Notify specific user
    emitToUser(userId, EVENTS.ROUTE_DANGER_DETECTED, {
        routeId,
        dangerType,
        location,
        severity,
        message: `⚠️ Danger detected on your route: ${dangerType}`,
        timestamp: new Date()
    });

    // Emit to route room
    emitToRoute(userId, EVENTS.ROUTE_UNSAFE, {
        routeId,
        dangerType,
        severity,
        recommendation: 'Consider alternative route',
        timestamp: new Date()
    });
};

/**
 * New incident reported event
 */
const handleIncidentReported = (data) => {
    const { incident, barangayId, reporterId } = data;

    logger.info(`New incident reported: ${incident.title} in barangay ${barangayId}`);

    // Notify barangay subscribers
    emitToBarangay(barangayId, EVENTS.INCIDENT_REPORTED, {
        incident,
        timestamp: new Date()
    });

    // Notify admins and staff for verification
    emitToRole('admin', EVENTS.INCIDENT_REPORTED, {
        incident,
        requiresVerification: true,
        timestamp: new Date()
    });

    emitToRole('staff', EVENTS.INCIDENT_REPORTED, {
        incident,
        requiresVerification: true,
        timestamp: new Date()
    });

    // If critical severity, broadcast to all
    if (incident.severity === 'critical' || incident.severity === 'high') {
        broadcast(EVENTS.EMERGENCY_ALERT, {
            type: 'incident',
            incident,
            message: `🚨 ${incident.severity.toUpperCase()} incident reported: ${incident.title}`,
            timestamp: new Date()
        });
    }
};

/**
 * Incident verified event
 */
const handleIncidentVerified = (data) => {
    const { incident, barangayId, verifiedBy } = data;

    logger.info(`Incident verified: ${incident.title}`);

    // Notify barangay
    emitToBarangay(barangayId, EVENTS.INCIDENT_VERIFIED, {
        incident,
        verifiedBy,
        timestamp: new Date()
    });

    // Notify reporter
    if (incident.reported_by) {
        emitToUser(incident.reported_by, EVENTS.INCIDENT_VERIFIED, {
            incident,
            message: 'Your incident report has been verified',
            timestamp: new Date()
        });
    }

    // Trigger route recomputation if affects routes
    if (incident.latitude && incident.longitude) {
        broadcast(EVENTS.ROUTE_RECOMPUTE, {
            reason: 'incident_verified',
            location: {
                latitude: incident.latitude,
                longitude: incident.longitude
            },
            timestamp: new Date()
        });
    }
};

/**
 * Emergency announcement event
 */
const handleEmergencyAnnouncement = (data) => {
    const { announcement, targetAudience, targetBarangays } = data;

    logger.warn(`Emergency announcement: ${announcement.title}`);
    console.log('🚨 [EMERGENCY ANNOUNCEMENT] Processing:', {
        title: announcement.title,
        targetAudience,
        targetBarangays,
        priority: announcement.priority,
        type: announcement.type
    });

    if (targetAudience === 'all') {
        // Broadcast to everyone
        console.log('🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users');
        broadcast(EVENTS.ANNOUNCEMENT_NEW, {
            announcement,
            priority: announcement.priority,
            timestamp: new Date()
        });

        // Also send as emergency alert for high priority
        if (announcement.priority === 'urgent' || announcement.priority === 'high' || announcement.type === 'emergency') {
            console.log('🚨 [EMERGENCY ANNOUNCEMENT] Also sending as EMERGENCY_ALERT');
            broadcast(EVENTS.EMERGENCY_ALERT, {
                type: 'announcement',
                announcement,
                message: announcement.title,
                timestamp: new Date()
            });
        }
    } else if (targetAudience === 'specific_barangay' && targetBarangays) {
        // Emit to specific barangays
        console.log('🚨 [EMERGENCY ANNOUNCEMENT] Sending to specific barangays:', targetBarangays);
        targetBarangays.forEach(barangayId => {
            emitToBarangay(barangayId, EVENTS.ANNOUNCEMENT_NEW, {
                announcement,
                priority: announcement.priority,
                timestamp: new Date()
            });
        });
    } else {
        // Emit to specific role
        console.log('🚨 [EMERGENCY ANNOUNCEMENT] Sending to role:', targetAudience);
        emitToRole(targetAudience, EVENTS.ANNOUNCEMENT_NEW, {
            announcement,
            priority: announcement.priority,
            timestamp: new Date()
        });
    }

    console.log('✅ [EMERGENCY ANNOUNCEMENT] Processing complete');
};

/**
 * Evacuation order event
 */
const handleEvacuationOrder = (data) => {
    const { barangayIds, reason, shelters, urgency } = data;

    logger.warn(`Evacuation order issued for ${barangayIds.length} barangays`);

    barangayIds.forEach(barangayId => {
        emitToBarangay(barangayId, EVENTS.EVACUATION_ORDER, {
            barangayId,
            reason,
            shelters,
            urgency,
            message: `🚨 EVACUATION ORDER: ${reason}`,
            timestamp: new Date()
        });
    });

    // Notify all admins and staff
    emitToRole('admin', EVENTS.EVACUATION_ORDER, {
        barangayIds,
        reason,
        urgency,
        timestamp: new Date()
    });

    emitToRole('staff', EVENTS.EVACUATION_ORDER, {
        barangayIds,
        reason,
        urgency,
        timestamp: new Date()
    });

    // Broadcast emergency alert
    broadcast(EVENTS.EMERGENCY_ALERT, {
        type: 'evacuation',
        barangayIds,
        reason,
        urgency,
        message: '🚨 EVACUATION ORDER ISSUED',
        timestamp: new Date()
    });
};

/**
 * New notification event
 */
const handleNewNotification = (data) => {
    const { userId, notification } = data;

    logger.info(`New notification for user ${userId}: ${notification.title}`);

    emitToUser(userId, EVENTS.NOTIFICATION_NEW, {
        notification,
        timestamp: new Date()
    });
};

/**
 * Traffic update event
 */
const handleTrafficUpdated = (data) => {
    const { barangayId, location, trafficLevel, roadCondition } = data;

    logger.info(`Traffic updated in barangay ${barangayId}: ${trafficLevel}`);

    emitToBarangay(barangayId, EVENTS.TRAFFIC_UPDATED, {
        location,
        trafficLevel,
        roadCondition,
        timestamp: new Date()
    });

    // If road blocked, send alert
    if (roadCondition === 'blocked' || roadCondition === 'flooded') {
        emitToBarangay(barangayId, EVENTS.ROAD_BLOCKED, {
            location,
            reason: roadCondition,
            message: `⚠️ Road ${roadCondition} at ${location}`,
            timestamp: new Date()
        });

        // Trigger route recomputation
        broadcast(EVENTS.ROUTE_RECOMPUTE, {
            reason: 'road_blocked',
            location,
            timestamp: new Date()
        });
    }
};

/**
 * Shelter recommendation event
 */
const handleShelterRecommended = (data) => {
    const { userId, shelter, reason, distance } = data;

    logger.info(`Shelter recommended for user ${userId}: ${shelter.name}`);

    emitToUser(userId, EVENTS.SHELTER_RECOMMENDED, {
        shelter,
        reason,
        distance,
        message: `Recommended shelter: ${shelter.name}`,
        timestamp: new Date()
    });
};

module.exports = {
    EVENTS,
    handleWindChanged,
    handleFloodUpdated,
    handleRouteDanger,
    handleIncidentReported,
    handleIncidentVerified,
    handleEmergencyAnnouncement,
    handleEvacuationOrder,
    handleNewNotification,
    handleTrafficUpdated,
    handleShelterRecommended
};
