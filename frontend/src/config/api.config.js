/**
 * API Configuration
 * Centralized API endpoint configuration
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    TIMEOUT: 30000, // 30 seconds
};

// Export BASE_URL separately for convenience
export const API_BASE_URL = API_CONFIG.BASE_URL;

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
    },

    // Admin
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        STATS: '/admin/dashboard',  // Fixed: was '/admin/stats', backend uses '/admin/dashboard'
        USERS: '/admin/users',
        USER_BY_ID: (id) => `/admin/users/${id}`,
        UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
        ACTIVATE_USER: (id) => `/admin/users/${id}/activate`,
        DEACTIVATE_USER: (id) => `/admin/users/${id}/deactivate`,
        DELETE_USER: (id) => `/admin/users/${id}`,
        INCIDENTS: '/admin/incidents',
        VERIFY_INCIDENT: (id) => `/admin/incidents/${id}/verify`,
        REJECT_INCIDENT: (id) => `/admin/incidents/${id}/reject`,
        UPDATE_INCIDENT_STATUS: (id) => `/admin/incidents/${id}/status`,
        REPORTS: '/admin/reports',
        UPDATE_REPORT_STATUS: (id) => `/admin/reports/${id}/status`,
        ANALYTICS: '/admin/analytics',
        ACTIVE_ALERTS: '/admin/active-alerts',
        HAZARD_STATS: '/admin/hazard-stats',
        CREATE_ANNOUNCEMENT: '/admin/announcements',
        SEND_ALERT: '/admin/alerts/send',
        EMERGENCY_ANNOUNCEMENT: '/admin/announcements/emergency',
        EVACUATION_ORDER: '/admin/evacuation/order',
        ACTIVITY_LOGS: '/admin/logs',
    },

    // Incidents
    INCIDENTS: {
        LIST: '/incidents',
        FEED: '/incidents/feed',
        STATS: '/incidents/stats',
        GET_BY_ID: (id) => `/incidents/${id}`,
        DETAIL: (id) => `/incidents/${id}`,
        CREATE: '/incidents',
        UPDATE: (id) => `/incidents/${id}`,
        UPDATE_STATUS: (id) => `/incidents/${id}/status`,
        VERIFY: (id) => `/incidents/${id}/verify`,
        REJECT: (id) => `/incidents/${id}/reject`,
        DELETE: (id) => `/incidents/${id}`,
        NEARBY: '/incidents/nearby',
    },

    // Reports
    REPORTS: {
        LIST: '/reports',
        STATS: '/reports/stats',
        GET_BY_ID: (id) => `/reports/${id}`,
        DETAIL: (id) => `/reports/${id}`,
        CREATE: '/reports',
        UPDATE: (id) => `/reports/${id}`,
        VERIFY: (id) => `/reports/${id}/verify`,
        ASSIGN: (id) => `/reports/${id}/assign`,
        RESOLVE: (id) => `/reports/${id}/resolve`,
        REJECT: (id) => `/reports/${id}/reject`,
        DELETE: (id) => `/reports/${id}`,
    },

    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_READ: (id) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        DELETE: (id) => `/notifications/${id}`,
        DELETE_READ: '/notifications/read',
        CLEAR_ALL: '/notifications/clear-all',
    },

    // AI Services
    AI: {
        CHATBOT: '/ai/chatbot',
        SUGGESTIONS: '/ai/chatbot/suggestions',
        ANALYZE_RISK: '/ai/analyze-risk',
        BARANGAY_RISK: (id) => `/ai/analyze-risk/barangay/${id}`,
        MULTI_HAZARD: '/ai/analyze-risk/multi-hazard',
        ROUTE_RECOMMENDATION: '/ai/route-recommendation',
        EVACUATION_CENTER: '/ai/route-recommendation/evacuation-center',
        HAZARD_SCORE: '/ai/route-recommendation/hazard-score',
        CHECK_INCIDENTS: '/ai/route-recommendation/check-incidents',
    },

    // Barangays
    BARANGAYS: {
        LIST: '/barangays',
        HIGH_RISK: '/barangays/risk/high',
        DETAIL: (id) => `/barangays/${id}`,
        GET_BY_ID: (id) => `/barangays/${id}`,
    },

    // Establishments
    ESTABLISHMENTS: {
        LIST: '/establishments',
        EVACUATION_CENTERS: '/establishments/evacuation/centers',
        HOSPITALS: '/establishments/hospitals/list',
        NEAREST: (type) => `/establishments/nearest/${type}`,
        BY_TYPE: (type) => `/establishments/type/${type}`,
        DETAIL: (id) => `/establishments/${id}`,
    },

    // Announcements
    ANNOUNCEMENTS: {
        LIST: '/announcements',
        ACTIVE: '/announcements/active',
        URGENT: '/announcements/urgent',
        BY_TYPE: (type) => `/announcements/type/${type}`,
        DETAIL: (id) => `/announcements/${id}`,
    },

    // Traffic
    TRAFFIC: {
        LIST: '/traffic',
        HOTSPOTS: '/traffic/hotspots',
        STATS: '/traffic/stats',
        BARANGAY_LATEST: (id) => `/traffic/barangay/${id}/latest`,
        DETAIL: (id) => `/traffic/${id}`,
    },

    // Emergency Contacts
    EMERGENCY_CONTACTS: {
        LIST: '/emergency-contacts',
        ACTIVE: '/emergency-contacts/active',
        HOTLINES: '/emergency-contacts/hotlines',
        STATS: '/emergency-contacts/stats',
        BY_CATEGORY: (category) => `/emergency-contacts/category/${category}`,
        DETAIL: (id) => `/emergency-contacts/${id}`,
    },
};

export default API_CONFIG;
