/**
 * Socket.io Configuration
 * Real-time event configuration
 */

export const SOCKET_CONFIG = {
    URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    OPTIONS: {
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    },
};

export const SOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    RECONNECT: 'reconnect',
    RECONNECT_ATTEMPT: 'reconnect_attempt',
    RECONNECT_ERROR: 'reconnect_error',
    RECONNECT_FAILED: 'reconnect_failed',

    // Subscription
    SUBSCRIBE_BARANGAY: 'subscribe:barangay',
    UNSUBSCRIBE_BARANGAY: 'unsubscribe:barangay',
    SUBSCRIBED_BARANGAY: 'subscribed:barangay',
    UNSUBSCRIBED_BARANGAY: 'unsubscribed:barangay',

    // Route tracking
    ROUTE_START: 'route:start',
    ROUTE_STOP: 'route:stop',

    // Health check
    PING: 'ping',
    PONG: 'pong',

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
    SYSTEM_ALERT: 'system:alert',
};

export default SOCKET_CONFIG;
