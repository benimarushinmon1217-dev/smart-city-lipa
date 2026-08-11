/**
 * Notification Service
 * Handles notification creation and real-time delivery
 */

const { Notification, User } = require('../models');
const { emitToUser } = require('../config/socket');
const { handleNewNotification } = require('../sockets/eventHandlers');
const logger = require('../utils/logger');

class NotificationService {
    /**
     * Create and send notification to user
     */
    async createNotification(data) {
        try {
            const {
                user_id,
                type,
                title,
                message,
                priority = 'medium',
                related_id,
                related_type,
                action_url,
                metadata
            } = data;

            // Create notification in database
            const notification = await Notification.create({
                user_id,
                type,
                title,
                message,
                priority,
                related_id,
                related_type,
                action_url,
                metadata: metadata ? JSON.stringify(metadata) : null
            });

            // Send real-time notification
            handleNewNotification({
                userId: user_id,
                notification: notification.toJSON()
            });

            logger.info(`Notification created for user ${user_id}: ${title}`);

            return notification;
        } catch (error) {
            logger.error('Failed to create notification:', error);
            throw error;
        }
    }

    /**
     * Create notifications for multiple users
     */
    async createBulkNotifications(userIds, notificationData) {
        try {
            const notifications = await Promise.all(
                userIds.map(userId =>
                    this.createNotification({
                        ...notificationData,
                        user_id: userId
                    })
                )
            );

            logger.info(`Created ${notifications.length} bulk notifications`);

            return notifications;
        } catch (error) {
            logger.error('Failed to create bulk notifications:', error);
            throw error;
        }
    }

    /**
     * Notify all users in a barangay
     */
    async notifyBarangay(barangayId, notificationData) {
        try {
            // Get all users in the barangay
            const users = await User.findAll({
                where: { barangay: barangayId },
                attributes: ['id']
            });

            const userIds = users.map(u => u.id);

            if (userIds.length === 0) {
                logger.warn(`No users found in barangay ${barangayId}`);
                return [];
            }

            return await this.createBulkNotifications(userIds, notificationData);
        } catch (error) {
            logger.error(`Failed to notify barangay ${barangayId}:`, error);
            throw error;
        }
    }

    /**
     * Notify users by role
     */
    async notifyByRole(role, notificationData) {
        try {
            const users = await User.findAll({
                where: { role, is_active: true },
                attributes: ['id']
            });

            const userIds = users.map(u => u.id);

            if (userIds.length === 0) {
                logger.warn(`No active users found with role ${role}`);
                return [];
            }

            return await this.createBulkNotifications(userIds, notificationData);
        } catch (error) {
            logger.error(`Failed to notify role ${role}:`, error);
            throw error;
        }
    }

    /**
     * Notify all active users
     */
    async notifyAll(notificationData) {
        try {
            const users = await User.findAll({
                where: { is_active: true },
                attributes: ['id']
            });

            const userIds = users.map(u => u.id);

            return await this.createBulkNotifications(userIds, notificationData);
        } catch (error) {
            logger.error('Failed to notify all users:', error);
            throw error;
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOne({
                where: { id: notificationId, user_id: userId }
            });

            if (!notification) {
                throw new Error('Notification not found');
            }

            await notification.update({
                is_read: true,
                read_at: new Date()
            });

            logger.info(`Notification ${notificationId} marked as read by user ${userId}`);

            return notification;
        } catch (error) {
            logger.error('Failed to mark notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        try {
            const result = await Notification.update(
                {
                    is_read: true,
                    read_at: new Date()
                },
                {
                    where: {
                        user_id: userId,
                        is_read: false
                    }
                }
            );

            logger.info(`Marked all notifications as read for user ${userId}`);

            return result;
        } catch (error) {
            logger.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Get user notifications with pagination
     */
    async getUserNotifications(userId, options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                unreadOnly = false
            } = options;

            const offset = (page - 1) * limit;

            const where = { user_id: userId };
            if (unreadOnly) {
                where.is_read = false;
            }

            console.log('📋 [NOTIFICATION SERVICE] Getting notifications for user:', userId);
            console.log('📋 [NOTIFICATION SERVICE] Query options:', { page, limit, unreadOnly, where });

            const { count, rows } = await Notification.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            console.log('📋 [NOTIFICATION SERVICE] Found', count, 'notifications for user', userId);
            console.log('📋 [NOTIFICATION SERVICE] Returning', rows.length, 'notifications');

            return {
                notifications: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Failed to get user notifications:', error);
            throw error;
        }
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId) {
        try {
            console.log('📋 [NOTIFICATION SERVICE] Getting unread count for user:', userId);

            const count = await Notification.count({
                where: {
                    user_id: userId,
                    is_read: false
                }
            });

            console.log('📋 [NOTIFICATION SERVICE] Unread count for user', userId, ':', count);

            return count;
        } catch (error) {
            logger.error('Failed to get unread count:', error);
            throw error;
        }
    }

    /**
     * Delete notification
     */
    async deleteNotification(notificationId, userId) {
        try {
            const result = await Notification.destroy({
                where: {
                    id: notificationId,
                    user_id: userId
                }
            });

            if (result === 0) {
                throw new Error('Notification not found');
            }

            logger.info(`Notification ${notificationId} deleted by user ${userId}`);

            return true;
        } catch (error) {
            logger.error('Failed to delete notification:', error);
            throw error;
        }
    }

    /**
     * Delete all read notifications for a user
     */
    async deleteReadNotifications(userId) {
        try {
            const result = await Notification.destroy({
                where: {
                    user_id: userId,
                    is_read: true
                }
            });

            logger.info(`Deleted ${result} read notifications for user ${userId}`);

            return result;
        } catch (error) {
            logger.error('Failed to delete read notifications:', error);
            throw error;
        }
    }

    /**
     * Delete ALL notifications for a user (Clear All)
     */
    async clearAll(userId) {
        try {
            const result = await Notification.destroy({
                where: {
                    user_id: userId
                }
            });

            logger.info(`Cleared all ${result} notifications for user ${userId}`);

            return result;
        } catch (error) {
            logger.error('Failed to clear all notifications:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();
