/**
 * Notification Service
 * Handles notification-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

class NotificationService {
    /**
     * Get all notifications
     */
    async getAll(params = {}) {
        return api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
    }

    /**
     * Get unread count
     */
    async getUnreadCount() {
        return api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id) {
        return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    }

    /**
     * Delete notification
     */
    async delete(id) {
        return api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
    }

    /**
     * Clear all notifications
     */
    async clearAll() {
        return api.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL);
    }

    /**
     * Delete all read notifications
     */
    async deleteReadNotifications() {
        return api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_READ);
    }
}

const notificationService = new NotificationService();
export default notificationService;
export { notificationService };
