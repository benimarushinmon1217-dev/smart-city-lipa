/**
 * Announcement Service
 * Business logic for system announcements and alerts
 */

const { Announcement, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');
const { handleEmergencyAnnouncement } = require('../sockets/eventHandlers');

class AnnouncementService {
    /**
     * Get all announcements with optional filters
     */
    async getAllAnnouncements(filters = {}) {
        try {
            const {
                type,
                priority,
                is_active,
                page = 1,
                limit = 20
            } = filters;

            const whereClause = {};

            // Filter by type
            if (type) {
                whereClause.type = type;
            }

            // Filter by priority
            if (priority) {
                whereClause.priority = priority;
            }

            // Filter by active status
            if (is_active !== undefined) {
                whereClause.is_active = is_active === 'true';
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Announcement.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ],
                limit: parseInt(limit),
                offset: offset,
                order: [['created_at', 'DESC']]
            });

            return {
                announcements: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllAnnouncements:', error);
            throw error;
        }
    }

    /**
     * Get active announcements
     */
    async getActiveAnnouncements(limit = 10) {
        try {
            const announcements = await Announcement.findAll({
                where: { is_active: true },
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ],
                limit: parseInt(limit),
                order: [['priority', 'DESC'], ['created_at', 'DESC']]
            });

            return announcements;
        } catch (error) {
            logger.error('Error in getActiveAnnouncements:', error);
            throw error;
        }
    }

    /**
     * Get announcement by ID
     */
    async getAnnouncementById(id) {
        try {
            const announcement = await Announcement.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ]
            });

            if (!announcement) {
                throw new Error('Announcement not found');
            }

            return announcement;
        } catch (error) {
            logger.error('Error in getAnnouncementById:', error);
            throw error;
        }
    }

    /**
     * Create new announcement
     */
    async createAnnouncement(data, createdBy) {
        try {
            const announcementData = {
                ...data,
                created_by: createdBy
            };

            const announcement = await Announcement.create(announcementData);
            logger.info(`Announcement created: ${announcement.title} (ID: ${announcement.id})`);

            // Reload with creator data
            await announcement.reload({
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ]
            });

            // Send real-time notification
            try {
                // Parse target_barangays if it's a JSON string
                let parsedBarangays = data.target_barangays;
                if (typeof data.target_barangays === 'string') {
                    try {
                        parsedBarangays = JSON.parse(data.target_barangays);
                    } catch (e) {
                        logger.warn('Failed to parse target_barangays:', e);
                        parsedBarangays = null;
                    }
                }

                handleEmergencyAnnouncement({
                    announcement: announcement.toJSON(),
                    targetAudience: data.target_audience || 'all',
                    targetBarangays: parsedBarangays
                });
            } catch (socketError) {
                logger.error('Socket notification failed:', socketError);
                // Don't fail announcement creation if socket fails
            }

            // Create notifications for users
            try {
                if (data.priority === 'urgent' || data.type === 'emergency') {
                    await this.sendAnnouncementNotifications(announcement);
                }
            } catch (notifError) {
                logger.error('Notification creation failed:', notifError);
                // Don't fail announcement creation if notifications fail
            }

            return announcement;
        } catch (error) {
            logger.error('Error in createAnnouncement:', error);
            throw error;
        }
    }

    /**
     * Update announcement
     */
    async updateAnnouncement(id, data) {
        try {
            const announcement = await Announcement.findByPk(id);

            if (!announcement) {
                throw new Error('Announcement not found');
            }

            await announcement.update(data);
            logger.info(`Announcement updated: ${announcement.title} (ID: ${id})`);

            // Reload with creator data
            await announcement.reload({
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ]
            });

            return announcement;
        } catch (error) {
            logger.error('Error in updateAnnouncement:', error);
            throw error;
        }
    }

    /**
     * Delete announcement
     */
    async deleteAnnouncement(id) {
        try {
            const announcement = await Announcement.findByPk(id);

            if (!announcement) {
                throw new Error('Announcement not found');
            }

            await announcement.destroy();
            logger.info(`Announcement deleted: ${announcement.title} (ID: ${id})`);

            return { message: 'Announcement deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteAnnouncement:', error);
            throw error;
        }
    }

    /**
     * Deactivate announcement
     */
    async deactivateAnnouncement(id) {
        try {
            const announcement = await Announcement.findByPk(id);

            if (!announcement) {
                throw new Error('Announcement not found');
            }

            await announcement.update({ is_active: false });
            logger.info(`Announcement deactivated: ${announcement.title} (ID: ${id})`);

            return announcement;
        } catch (error) {
            logger.error('Error in deactivateAnnouncement:', error);
            throw error;
        }
    }

    /**
     * Send announcement notifications to users
     */
    async sendAnnouncementNotifications(announcement) {
        try {
            const notificationData = {
                title: announcement.title,
                message: announcement.content,
                type: 'announcement',
                priority: announcement.priority,
                related_id: announcement.id,
                related_type: 'announcement'
            };

            // Send to all active users
            await notificationService.notifyAll(notificationData);

            logger.info(`Notifications sent for announcement: ${announcement.id}`);
        } catch (error) {
            logger.error('Error in sendAnnouncementNotifications:', error);
            // Don't throw - notification failure shouldn't fail announcement creation
        }
    }

    /**
     * Get urgent announcements
     */
    async getUrgentAnnouncements() {
        try {
            const announcements = await Announcement.findAll({
                where: {
                    is_active: true,
                    priority: 'urgent'
                },
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: 5
            });

            return announcements;
        } catch (error) {
            logger.error('Error in getUrgentAnnouncements:', error);
            throw error;
        }
    }

    /**
     * Get announcements by type
     */
    async getAnnouncementsByType(type, limit = 10) {
        try {
            const announcements = await Announcement.findAll({
                where: {
                    type,
                    is_active: true
                },
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name', 'role']
                    }
                ],
                limit: parseInt(limit),
                order: [['created_at', 'DESC']]
            });

            return announcements;
        } catch (error) {
            logger.error('Error in getAnnouncementsByType:', error);
            throw error;
        }
    }
}

module.exports = new AnnouncementService();
