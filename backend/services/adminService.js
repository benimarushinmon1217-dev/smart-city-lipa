/**
 * Admin Service
 * Business logic for admin operations
 */

const { User, Incident, Report, Barangay, Establishment, Announcement, Notification, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');
const { handleIncidentVerified, handleEmergencyAnnouncement, handleEvacuationOrder } = require('../sockets/eventHandlers');

class AdminService {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        try {
            const [
                totalUsers,
                activeUsers,
                totalIncidents,
                pendingIncidents,
                verifiedIncidents,
                totalReports,
                pendingReports,
                totalBarangays,
                highRiskBarangays,
                totalEstablishments,
                activeAnnouncements
            ] = await Promise.all([
                User.count(),
                User.count({ where: { is_active: true } }),
                Incident.count(),
                Incident.count({ where: { status: 'reported' } }),
                Incident.count({ where: { is_verified: true } }),
                Report.count(),
                Report.count({ where: { status: 'pending' } }),
                Barangay.count(),
                Barangay.count({ where: { flood_risk_level: 'High' } }),
                Establishment.count(),
                Announcement.count({ where: { is_active: true } })
            ]);

            // Get recent incidents
            const recentIncidents = await Incident.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'reporter', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: Barangay, as: 'barangay', attributes: ['id', 'name'] }
                ]
            });

            // Get incident breakdown by severity
            const incidentsBySeverity = await Incident.findAll({
                attributes: [
                    'severity',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['severity']
            });

            // Get incident breakdown by type
            const incidentsByType = await Incident.findAll({
                attributes: [
                    'incident_type',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['incident_type']
            });

            const stats = {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    inactive: totalUsers - activeUsers
                },
                incidents: {
                    total: totalIncidents,
                    pending: pendingIncidents,
                    verified: verifiedIncidents,
                    bySeverity: incidentsBySeverity,
                    byType: incidentsByType,
                    recent: recentIncidents
                },
                reports: {
                    total: totalReports,
                    pending: pendingReports,
                    resolved: totalReports - pendingReports
                },
                barangays: {
                    total: totalBarangays,
                    highRisk: highRiskBarangays
                },
                establishments: {
                    total: totalEstablishments
                },
                announcements: {
                    active: activeAnnouncements
                }
            };

            // Emit stats update to admin users
            try {
                const { emitToRole } = require('../config/socket');
                emitToRole('admin', 'stats:updated', {
                    stats,
                    timestamp: new Date()
                });
            } catch (socketError) {
                logger.error('Failed to emit stats:updated event:', socketError);
            }

            return stats;
        } catch (error) {
            logger.error('Failed to get dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Get all users with filters and pagination
     */
    async getUsers(options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                role,
                is_active,
                search
            } = options;

            const offset = (page - 1) * limit;
            const where = {};

            if (role) where.role = role;
            if (is_active !== undefined) where.is_active = is_active;
            if (search) {
                where[Op.or] = [
                    { first_name: { [Op.like]: `%${search}%` } },
                    { last_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await User.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']],
                attributes: { exclude: ['password'] }
            });

            return {
                users: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Failed to get users:', error);
            throw error;
        }
    }

    /**
     * Update user role or status
     */
    async updateUser(userId, updateData) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Don't allow updating password through this method
            delete updateData.password;

            await user.update(updateData);

            logger.info(`User ${userId} updated by admin`);

            return user;
        } catch (error) {
            logger.error('Failed to update user:', error);
            throw error;
        }
    }

    /**
     * Activate user
     */
    async activateUser(userId) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            await user.update({ is_active: true });

            logger.info(`User ${userId} activated by admin`);

            return user;
        } catch (error) {
            logger.error('Failed to activate user:', error);
            throw error;
        }
    }

    /**
     * Deactivate user
     */
    async deactivateUser(userId) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            await user.update({ is_active: false });

            logger.info(`User ${userId} deactivated by admin`);

            return user;
        } catch (error) {
            logger.error('Failed to deactivate user:', error);
            throw error;
        }
    }

    /**
     * Delete user - handles all related data cleanup
     */
    async deleteUser(userId, requestingAdminId) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Prevent admin from deleting their own account
            if (userId === requestingAdminId) {
                throw new Error('You cannot delete your own account');
            }

            // Clean up related data before deleting user
            // Delete notifications belonging to this user
            await Notification.destroy({
                where: { user_id: userId },
                transaction
            });

            // Delete announcements created by this user
            await Announcement.destroy({
                where: { created_by: userId },
                transaction
            });

            // Delete incidents reported by this user
            await Incident.destroy({
                where: { reported_by: userId },
                transaction
            });

            // Delete reports created by this user
            await Report.destroy({
                where: { user_id: userId },
                transaction
            });

            // Clear any reports assigned to this user (set to NULL only where allowed)
            await Report.update(
                { assigned_to: null },
                { where: { assigned_to: userId }, transaction }
            );

            // Clear verified_by for incidents verified by this user (set to NULL only where allowed)
            await Incident.update(
                { verified_by: null },
                { where: { verified_by: userId }, transaction }
            );

            // Delete the user
            await user.destroy({ transaction });

            await transaction.commit();

            logger.info(`User ${userId} deleted by admin ${requestingAdminId}`);

            return { message: 'User deleted successfully', userId };
        } catch (error) {
            await transaction.rollback();
            logger.error('Failed to delete user:', error);
            throw error;
        }
    }

    /**
     * Get all incidents with filters
     */
    async getIncidents(options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                status,
                severity,
                incident_type,
                is_verified,
                barangay_id,
                search
            } = options;

            const offset = (page - 1) * limit;
            const where = {};

            if (status) where.status = status;
            if (severity) where.severity = severity;
            if (incident_type) where.incident_type = incident_type;
            if (is_verified !== undefined) where.is_verified = is_verified;
            if (barangay_id) where.barangay_id = barangay_id;

            // Add search functionality (case-insensitive)
            if (search) {
                const searchPattern = `%${search}%`;
                where[Op.or] = [
                    { title: { [Op.like]: searchPattern } },
                    { description: { [Op.like]: searchPattern } },
                    { address: { [Op.like]: searchPattern } },
                    { reporter_name: { [Op.like]: searchPattern } }
                ];
            }

            const { count, rows } = await Incident.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'reporter', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: Barangay, as: 'barangay', attributes: ['id', 'name'] }
                ]
            });

            return {
                incidents: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Failed to get incidents:', error);
            throw error;
        }
    }

    /**
     * Verify incident
     */
    async verifyIncident(incidentId, verifiedBy) {
        try {
            const incident = await Incident.findByPk(incidentId, {
                include: [{ model: Barangay, as: 'barangay' }]
            });

            if (!incident) {
                throw new Error('Incident not found');
            }

            await incident.update({
                is_verified: true,
                verified_by: verifiedBy,
                verified_at: new Date(),
                status: 'verified'
            });

            // Notify reporter
            if (incident.reported_by) {
                await notificationService.createNotification({
                    user_id: incident.reported_by,
                    type: 'incident',
                    title: 'Incident Verified',
                    message: `Your incident report "${incident.title}" has been verified`,
                    priority: 'medium',
                    related_id: incident.id,
                    related_type: 'incident'
                });
            }

            // Emit real-time event
            handleIncidentVerified({
                incident: incident.toJSON(),
                barangayId: incident.barangay_id,
                verifiedBy
            });

            logger.info(`Incident ${incidentId} verified by admin ${verifiedBy}`);

            return incident;
        } catch (error) {
            logger.error('Failed to verify incident:', error);
            throw error;
        }
    }

    /**
     * Reject incident
     */
    async rejectIncident(incidentId, rejectedBy, reason) {
        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                throw new Error('Incident not found');
            }

            await incident.update({
                status: 'closed',
                resolution_notes: `Rejected: ${reason}`
            });

            // Notify reporter
            if (incident.reported_by) {
                await notificationService.createNotification({
                    user_id: incident.reported_by,
                    type: 'incident',
                    title: 'Incident Rejected',
                    message: `Your incident report "${incident.title}" was not verified. Reason: ${reason}`,
                    priority: 'medium',
                    related_id: incident.id,
                    related_type: 'incident'
                });
            }

            logger.info(`Incident ${incidentId} rejected by admin ${rejectedBy}`);

            return incident;
        } catch (error) {
            logger.error('Failed to reject incident:', error);
            throw error;
        }
    }

    /**
     * Update incident status
     */
    async updateIncidentStatus(incidentId, status, notes) {
        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                throw new Error('Incident not found');
            }

            const updateData = { status };

            if (status === 'resolved') {
                updateData.resolution_time = new Date();
                updateData.resolution_notes = notes;
            }

            await incident.update(updateData);

            // Notify reporter
            if (incident.reported_by) {
                await notificationService.createNotification({
                    user_id: incident.reported_by,
                    type: 'incident',
                    title: 'Incident Status Updated',
                    message: `Your incident "${incident.title}" status: ${status}`,
                    priority: 'medium',
                    related_id: incident.id,
                    related_type: 'incident'
                });
            }

            logger.info(`Incident ${incidentId} status updated to ${status}`);

            return incident;
        } catch (error) {
            logger.error('Failed to update incident status:', error);
            throw error;
        }
    }

    /**
     * Get all reports with filters
     */
    async getReports(options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                status,
                report_type,
                priority,
                barangay_id
            } = options;

            const offset = (page - 1) * limit;
            const where = {};

            if (status) where.status = status;
            if (report_type) where.report_type = report_type;
            if (priority) where.priority = priority;
            if (barangay_id) where.barangay_id = barangay_id;

            const { count, rows } = await Report.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: Barangay, as: 'barangay', attributes: ['id', 'name'] }
                ]
            });

            return {
                reports: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Failed to get reports:', error);
            throw error;
        }
    }

    /**
     * Update report status
     */
    async updateReportStatus(reportId, status, assignedTo, resolutionNotes) {
        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                throw new Error('Report not found');
            }

            const updateData = { status };

            if (assignedTo) updateData.assigned_to = assignedTo;
            if (resolutionNotes) updateData.resolution_notes = resolutionNotes;
            if (status === 'resolved') updateData.resolved_at = new Date();

            await report.update(updateData);

            // Notify reporter
            await notificationService.createNotification({
                user_id: report.user_id,
                type: 'report_update',
                title: 'Report Status Updated',
                message: `Your report "${report.title}" status: ${status}`,
                priority: 'medium',
                related_id: report.id,
                related_type: 'report'
            });

            logger.info(`Report ${reportId} status updated to ${status}`);

            return report;
        } catch (error) {
            logger.error('Failed to update report status:', error);
            throw error;
        }
    }

    /**
     * Create emergency announcement
     */
    async createEmergencyAnnouncement(data, createdBy) {
        try {
            const announcement = await Announcement.create({
                ...data,
                created_by: createdBy,
                published_at: new Date()
            });

            // Parse target barangays if string
            let targetBarangays = null;
            if (data.target_barangays) {
                targetBarangays = typeof data.target_barangays === 'string'
                    ? JSON.parse(data.target_barangays)
                    : data.target_barangays;
            }

            // Emit real-time event
            handleEmergencyAnnouncement({
                announcement: announcement.toJSON(),
                targetAudience: data.target_audience,
                targetBarangays
            });

            // Create notifications based on target audience
            if (data.target_audience === 'all') {
                await notificationService.notifyAll({
                    type: 'announcement',
                    title: announcement.title,
                    message: announcement.content,
                    priority: announcement.priority,
                    related_id: announcement.id,
                    related_type: 'announcement'
                });
            } else if (data.target_audience === 'specific_barangay' && targetBarangays) {
                for (const barangayId of targetBarangays) {
                    await notificationService.notifyBarangay(barangayId, {
                        type: 'announcement',
                        title: announcement.title,
                        message: announcement.content,
                        priority: announcement.priority,
                        related_id: announcement.id,
                        related_type: 'announcement'
                    });
                }
            } else {
                await notificationService.notifyByRole(data.target_audience, {
                    type: 'announcement',
                    title: announcement.title,
                    message: announcement.content,
                    priority: announcement.priority,
                    related_id: announcement.id,
                    related_type: 'announcement'
                });
            }

            logger.info(`Emergency announcement created by admin ${createdBy}`);

            return announcement;
        } catch (error) {
            logger.error('Failed to create emergency announcement:', error);
            throw error;
        }
    }

    /**
     * Issue evacuation order
     */
    async issueEvacuationOrder(data) {
        try {
            const { barangayIds, reason, urgency } = data;

            // Get shelters in affected barangays
            const shelters = await Establishment.findAll({
                where: {
                    type: 'evacuation',
                    barangay_id: { [Op.in]: barangayIds },
                    is_operational: true
                }
            });

            // Create announcement
            const announcement = await Announcement.create({
                title: `EVACUATION ORDER: ${reason}`,
                content: `Immediate evacuation required. Proceed to nearest evacuation center. Reason: ${reason}`,
                type: 'emergency',
                priority: 'urgent',
                target_audience: 'specific_barangay',
                target_barangays: JSON.stringify(barangayIds),
                created_by: data.createdBy,
                published_at: new Date()
            });

            // Emit real-time evacuation order
            handleEvacuationOrder({
                barangayIds,
                reason,
                shelters: shelters.map(s => s.toJSON()),
                urgency
            });

            // Notify all users in affected barangays
            for (const barangayId of barangayIds) {
                await notificationService.notifyBarangay(barangayId, {
                    type: 'evacuation_order',
                    title: '🚨 EVACUATION ORDER',
                    message: `Immediate evacuation required: ${reason}`,
                    priority: 'urgent',
                    related_id: announcement.id,
                    related_type: 'announcement'
                });
            }

            logger.warn(`Evacuation order issued for ${barangayIds.length} barangays`);

            return {
                announcement,
                affectedBarangays: barangayIds.length,
                availableShelters: shelters.length
            };
        } catch (error) {
            logger.error('Failed to issue evacuation order:', error);
            throw error;
        }
    }

    /**
     * Get analytics data
     */
    async getAnalytics(timeRange = '7d') {
        try {
            // Parse time range
            let days = 7;
            if (timeRange === '24h') days = 1;
            else if (timeRange === '7d') days = 7;
            else if (timeRange === '30d') days = 30;
            else if (timeRange === '90d') days = 90;
            else if (timeRange === 'all') days = 365 * 10; // 10 years for "all time"

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Get previous period for comparison
            const prevStartDate = new Date(startDate);
            prevStartDate.setDate(prevStartDate.getDate() - days);

            // Total incidents in current period
            const totalIncidents = await Incident.count({
                where: { created_at: { [Op.gte]: startDate } }
            });

            // Total incidents in previous period
            const prevTotalIncidents = await Incident.count({
                where: {
                    created_at: {
                        [Op.gte]: prevStartDate,
                        [Op.lt]: startDate
                    }
                }
            });

            // Calculate growth
            const incidentGrowth = prevTotalIncidents > 0
                ? Math.round(((totalIncidents - prevTotalIncidents) / prevTotalIncidents) * 100)
                : 0;

            // Active users (logged in within period)
            const activeUsers = await User.count({
                where: {
                    is_active: true,
                    last_login: { [Op.gte]: startDate }
                }
            });

            // Previous period active users
            const prevActiveUsers = await User.count({
                where: {
                    is_active: true,
                    last_login: {
                        [Op.gte]: prevStartDate,
                        [Op.lt]: startDate
                    }
                }
            });

            const userGrowth = prevActiveUsers > 0
                ? Math.round(((activeUsers - prevActiveUsers) / prevActiveUsers) * 100)
                : 0;

            // Critical events (high/critical severity incidents)
            const criticalEvents = await Incident.count({
                where: {
                    created_at: { [Op.gte]: startDate },
                    severity: { [Op.in]: ['high', 'critical'] }
                }
            });

            // Average response time (time from reported to resolved)
            const resolvedIncidents = await Incident.findAll({
                where: {
                    created_at: { [Op.gte]: startDate },
                    status: 'resolved',
                    resolution_time: { [Op.ne]: null }
                },
                attributes: ['created_at', 'resolution_time']
            });

            let avgResponseTime = 0;
            if (resolvedIncidents.length > 0) {
                const totalMinutes = resolvedIncidents.reduce((sum, incident) => {
                    const diff = new Date(incident.resolution_time) - new Date(incident.created_at);
                    return sum + (diff / 1000 / 60); // Convert to minutes
                }, 0);
                avgResponseTime = Math.round(totalMinutes / resolvedIncidents.length);
            }

            // Incidents over time (for chart)
            const incidentsOverTime = await Incident.findAll({
                where: { created_at: { [Op.gte]: startDate } },
                attributes: [
                    [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
                order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']],
                raw: true
            });

            // Incidents by type
            const incidentsByType = await Incident.findAll({
                where: { created_at: { [Op.gte]: startDate } },
                attributes: [
                    'incident_type',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['incident_type'],
                raw: true
            });

            // Incidents by severity
            const incidentsBySeverity = await Incident.findAll({
                where: { created_at: { [Op.gte]: startDate } },
                attributes: [
                    'severity',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['severity'],
                raw: true
            });

            // Top affected barangays
            const topBarangays = await Incident.findAll({
                where: { created_at: { [Op.gte]: startDate } },
                attributes: [
                    'barangay_id',
                    [require('sequelize').fn('COUNT', require('sequelize').col('Incident.id')), 'incidentCount']
                ],
                include: [{
                    model: Barangay,
                    as: 'barangay',
                    attributes: ['id', 'name', 'flood_risk_level', 'ashfall_risk_level']
                }],
                group: ['barangay_id', 'barangay.id'],
                order: [[require('sequelize').fn('COUNT', require('sequelize').col('Incident.id')), 'DESC']],
                limit: 10,
                raw: false
            });

            // Format top barangays
            const formattedTopBarangays = topBarangays.map(item => ({
                id: item.barangay?.id,
                name: item.barangay?.name,
                incidentCount: parseInt(item.dataValues.incidentCount),
                riskLevel: item.barangay?.flood_risk_level || item.barangay?.ashfall_risk_level || 'Low'
            }));

            // Response performance over time
            const responsePerformance = await Incident.findAll({
                where: {
                    created_at: { [Op.gte]: startDate },
                    status: 'resolved',
                    resolution_time: { [Op.ne]: null }
                },
                attributes: [
                    [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
                    [require('sequelize').fn('AVG',
                        require('sequelize').literal('TIMESTAMPDIFF(MINUTE, created_at, resolution_time)')
                    ), 'avgMinutes']
                ],
                group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
                order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']],
                raw: true
            });

            // System performance metrics
            const totalUsers = await User.count();
            const onlineUsers = require('../config/socket').getOnlineUsers().length;

            return {
                totalIncidents,
                incidentGrowth,
                activeUsers,
                userGrowth,
                avgResponseTime,
                criticalEvents,
                incidentsOverTime,
                incidentsByType,
                incidentsBySeverity,
                topBarangays: formattedTopBarangays,
                responsePerformance,
                apiUptime: 99.9, // TODO: Implement actual uptime tracking
                avgLoadTime: 1.2, // TODO: Implement actual load time tracking
                activeSessions: onlineUsers,
                timeRange: `${days} days`
            };
        } catch (error) {
            logger.error('Failed to get analytics:', error);
            throw error;
        }
    }
}

module.exports = new AdminService();
