/**
 * Application Constants
 * Shared constants used throughout the application
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Smart City Lipa';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// User roles
export const ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user',
};

// Incident types
export const INCIDENT_TYPES = [
    { value: 'flood', label: 'Flood' },
    { value: 'fire', label: 'Fire' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'landslide', label: 'Landslide' },
    { value: 'typhoon', label: 'Typhoon' },
    { value: 'volcanic_activity', label: 'Volcanic Activity' },
    { value: 'traffic_accident', label: 'Traffic Accident' },
    { value: 'medical_emergency', label: 'Medical Emergency' },
    { value: 'other', label: 'Other' },
];

// Severity levels
export const SEVERITY_LEVELS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

// Incident statuses
export const INCIDENT_STATUSES = [
    { value: 'reported', label: 'Reported' },
    { value: 'verified', label: 'Verified' },
    { value: 'responding', label: 'Responding' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

// Report types
export const REPORT_TYPES = [
    { value: 'flood', label: 'Flood Report' },
    { value: 'road_blockage', label: 'Road Blockage' },
    { value: 'hazard', label: 'Hazard Report' },
    { value: 'infrastructure', label: 'Infrastructure Damage' },
    { value: 'other', label: 'Other' },
];

// Report statuses
export const REPORT_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
];

// Risk levels
export const RISK_LEVELS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'very high', label: 'Very High' },
];

// Announcement types
export const ANNOUNCEMENT_TYPES = [
    { value: 'general', label: 'General' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'weather', label: 'Weather Alert' },
    { value: 'evacuation', label: 'Evacuation Notice' },
    { value: 'maintenance', label: 'Maintenance' },
];

// Priority levels
export const PRIORITY_LEVELS = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

// Establishment types
export const ESTABLISHMENT_TYPES = [
    { value: 'evacuation', label: 'Evacuation Center' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'police', label: 'Police Station' },
    { value: 'fire', label: 'Fire Station' },
    { value: 'government', label: 'Government Office' },
    { value: 'school', label: 'School' },
    { value: 'church', label: 'Church' },
    { value: 'other', label: 'Other' },
];

// Traffic levels
export const TRAFFIC_LEVELS = [
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'heavy', label: 'Heavy' },
];

// Road conditions
export const ROAD_CONDITIONS = [
    { value: 'clear', label: 'Clear' },
    { value: 'congested', label: 'Congested' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'flooded', label: 'Flooded' },
    { value: 'damaged', label: 'Damaged' },
];

// Emergency contact categories
export const EMERGENCY_CATEGORIES = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'police', label: 'Police' },
    { value: 'fire', label: 'Fire' },
    { value: 'medical', label: 'Medical' },
    { value: 'disaster', label: 'Disaster Response' },
    { value: 'utility', label: 'Utility' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' },
];

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// File upload limits
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 5,
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
};

// Local storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
    MAP_LAYER: 'map_layer',
};

// Query keys for React Query
export const QUERY_KEYS = {
    AUTH: 'auth',
    USER: 'user',
    INCIDENTS: 'incidents',
    INCIDENT_DETAIL: 'incident-detail',
    INCIDENT_FEED: 'incident-feed',
    REPORTS: 'reports',
    REPORT_DETAIL: 'report-detail',
    NOTIFICATIONS: 'notifications',
    UNREAD_COUNT: 'unread-count',
    BARANGAYS: 'barangays',
    BARANGAY_DETAIL: 'barangay-detail',
    ESTABLISHMENTS: 'establishments',
    ANNOUNCEMENTS: 'announcements',
    TRAFFIC: 'traffic',
    EMERGENCY_CONTACTS: 'emergency-contacts',
    ADMIN_DASHBOARD: 'admin-dashboard',
    ADMIN_USERS: 'admin-users',
    ADMIN_INCIDENTS: 'admin-incidents',
    ADMIN_REPORTS: 'admin-reports',
};

// Feature flags
export const FEATURES = {
    AI_CHATBOT: import.meta.env.VITE_ENABLE_AI_CHATBOT === 'true',
    REAL_TIME: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
};

export default {
    APP_NAME,
    APP_VERSION,
    ROLES,
    INCIDENT_TYPES,
    SEVERITY_LEVELS,
    INCIDENT_STATUSES,
    REPORT_TYPES,
    REPORT_STATUSES,
    RISK_LEVELS,
    ANNOUNCEMENT_TYPES,
    PRIORITY_LEVELS,
    ESTABLISHMENT_TYPES,
    TRAFFIC_LEVELS,
    ROAD_CONDITIONS,
    EMERGENCY_CATEGORIES,
    PAGINATION,
    FILE_UPLOAD,
    STORAGE_KEYS,
    QUERY_KEYS,
    FEATURES,
};
