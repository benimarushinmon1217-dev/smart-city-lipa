/**
 * Map Configuration
 * Leaflet map settings and constants
 */

export const MAP_CONFIG = {
    // Default center (Lipa City, Batangas)
    CENTER: {
        lat: parseFloat(import.meta.env.VITE_MAP_CENTER_LAT) || 13.9414,
        lng: parseFloat(import.meta.env.VITE_MAP_CENTER_LNG) || 121.1628,
    },

    // Default zoom level
    DEFAULT_ZOOM: parseInt(import.meta.env.VITE_MAP_ZOOM) || 13,
    MIN_ZOOM: 11,
    MAX_ZOOM: 18,

    // Tile layer
    TILE_LAYER: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },

    // Alternative tile layers
    TILE_LAYERS: {
        OPENSTREETMAP: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; OpenStreetMap contributors',
        },
        SATELLITE: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '&copy; Esri',
        },
    },
};

// Risk level colors
export const RISK_COLORS = {
    low: '#22c55e',      // Green
    medium: '#f59e0b',   // Amber
    high: '#ef4444',     // Red
    'very high': '#991b1b', // Dark red
    unknown: '#6b7280',  // Gray
};

// Incident severity colors
export const SEVERITY_COLORS = {
    low: '#3b82f6',      // Blue
    medium: '#f59e0b',   // Amber
    high: '#ef4444',     // Red
    critical: '#991b1b', // Dark red
};

// Incident type icons (using emoji for simplicity)
export const INCIDENT_ICONS = {
    flood: '🌊',
    fire: '🔥',
    earthquake: '🏚️',
    landslide: '⛰️',
    typhoon: '🌀',
    volcanic: '🌋',
    accident: '🚗',
    other: '⚠️',
};

// Map bounds for Lipa City (approximate)
export const LIPA_BOUNDS = [
    [13.88, 121.10], // Southwest
    [14.00, 121.22], // Northeast
];

export default MAP_CONFIG;
