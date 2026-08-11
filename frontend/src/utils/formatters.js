/**
 * Formatter Utilities
 * Date, time, number, and text formatting functions
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return 'N/A';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr);
    } catch (error) {
        return 'Invalid date';
    }
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
    return formatDate(date, 'MMM dd, yyyy HH:mm');
};

/**
 * Format time only
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
    return formatDate(date, 'HH:mm');
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return 'N/A';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
        return 'Invalid date';
    }
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format risk level with color
 * @param {string} level - Risk level
 * @returns {object} Object with label and color
 */
export const formatRiskLevel = (level) => {
    const levels = {
        low: { label: 'Low', color: 'text-success-600 bg-success-50' },
        medium: { label: 'Medium', color: 'text-warning-600 bg-warning-50' },
        high: { label: 'High', color: 'text-danger-600 bg-danger-50' },
        'very high': { label: 'Very High', color: 'text-danger-700 bg-danger-100' },
        unknown: { label: 'Unknown', color: 'text-gray-600 bg-gray-50' },
    };
    return levels[level?.toLowerCase()] || levels.unknown;
};

/**
 * Format severity level
 * @param {string} severity - Severity level
 * @returns {object} Object with label and color
 */
export const formatSeverity = (severity) => {
    const severities = {
        low: { label: 'Low', color: 'text-blue-600 bg-blue-50' },
        medium: { label: 'Medium', color: 'text-warning-600 bg-warning-50' },
        high: { label: 'High', color: 'text-danger-600 bg-danger-50' },
        critical: { label: 'Critical', color: 'text-danger-700 bg-danger-100' },
    };
    return severities[severity?.toLowerCase()] || severities.low;
};

/**
 * Format status
 * @param {string} status - Status
 * @returns {object} Object with label and color
 */
export const formatStatus = (status) => {
    const statuses = {
        pending: { label: 'Pending', color: 'text-gray-600 bg-gray-50' },
        reported: { label: 'Reported', color: 'text-blue-600 bg-blue-50' },
        verified: { label: 'Verified', color: 'text-success-600 bg-success-50' },
        responding: { label: 'Responding', color: 'text-warning-600 bg-warning-50' },
        resolved: { label: 'Resolved', color: 'text-success-600 bg-success-50' },
        rejected: { label: 'Rejected', color: 'text-danger-600 bg-danger-50' },
        closed: { label: 'Closed', color: 'text-gray-600 bg-gray-50' },
    };
    return statuses[status?.toLowerCase()] || statuses.pending;
};

/**
 * Format coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng) => {
    if (!lat || !lng) return 'N/A';
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export default {
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeTime,
    formatNumber,
    formatFileSize,
    truncateText,
    capitalize,
    formatRiskLevel,
    formatSeverity,
    formatStatus,
    formatCoordinates,
};
