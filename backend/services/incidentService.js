/**
 * Incident Service
 * Business logic for incident management
 */

const { Incident, User, Barangay, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { emitToBarangay, emitToRole, broadcast } = require('../config/socket');
const notificationService = require('./notificationService');

class IncidentService {
    /**
     * Get all incidents with filters and pagination
     */
    async getAllIncidents(filters = {}, pagination = {}) {
        try {
            const {
                incident_type,
                severity,
                status,
                barangay_id,
                is_verified,
                search,
                start_date,
                end_date
            } = filters;

            const {
                page = 1,
                limit = 20,
                sort_by = 'created_at',
                sort_order = 'DESC'
            } = pagination;

            // Build where clause
            const where = {};

            if (incident_type) {
                where.incident_type = incident_type;
            }

            if (severity) {
                where.severity = severity;
            }

            if (status) {
                where.status = status;
            }

            if (barangay_id) {
                where.barangay_id = barangay_id;
            }

            if (is_verified !== undefined) {
                where.is_verified = is_verified === 'true' || is_verified === true;
            }

            if (search) {
                where[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ];
            }

            if (start_date || end_date) {
                where.created_at = {};
                if (start_date) {
                    where.created_at[Op.gte] = new Date(start_date);
                }
                if (end_date) {
                    where.created_at[Op.lte] = new Date(end_date);
                }
            }

            // Calculate offset
            const offset = (page - 1) * limit;

            // Fetch incidents
            const { count, rows } = await Incident.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'reporter',
                        attributes: ['id', 'email', 'first_name', 'last_name']
                    },
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    },
                    {
                        model: User,
                        as: 'verifier',
                        attributes: ['id', 'first_name', 'last_name'],
                        required: false
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sort_by, sort_order]],
                distinct: true
            });

            // Parse JSON fields
            const incidents = rows.map(incident => {
                const data = incident.toJSON();
                if (data.images) {
                    try {
                        data.images = JSON.parse(data.images);
                    } catch (e) {
                        data.images = [];
                    }
                }
                if (data.responders) {
                    try {
                        data.responders = JSON.parse(data.responders);
                    } catch (e) {
                        data.responders = [];
                    }
                }
                return data;
            });

            return {
                incidents,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllIncidents:', error);
            throw error;
        }
    }

    /**
     * Get incident by ID
     */
    async getIncidentById(incidentId) {
        try {
            const incident = await Incident.findByPk(incidentId, {
                include: [
                    {
                        model: User,
                        as: 'reporter',
                        attributes: ['id', 'email', 'first_name', 'last_name', 'phone']
                    },
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name', 'population']
                    },
                    {
                        model: User,
                        as: 'verifier',
                        attributes: ['id', 'first_name', 'last_name'],
                        required: false
                    }
                ]
            });

            if (!incident) {
                return null;
            }

            const data = incident.toJSON();

            // Parse JSON fields
            if (data.images) {
                try {
                    data.images = JSON.parse(data.images);
                } catch (e) {
                    data.images = [];
                }
            }

            if (data.responders) {
                try {
                    data.responders = JSON.parse(data.responders);
                } catch (e) {
                    data.responders = [];
                }
            }

            return data;
        } catch (error) {
            logger.error('Error in getIncidentById:', error);
            throw error;
        }
    }

    /**
     * Create new incident
     */
    async createIncident(incidentData, userId, imageFiles = []) {
        const transaction = await sequelize.transaction();

        try {
            // Process uploaded images
            const imagePaths = imageFiles.map(file => `/uploads/incidents/${file.filename}`);

            // Create incident
            const incident = await Incident.create({
                ...incidentData,
                reported_by: userId,
                images: JSON.stringify(imagePaths),
                status: 'reported',
                is_verified: false
            }, { transaction });

            await transaction.commit();

            // Fetch complete incident data
            const completeIncident = await this.getIncidentById(incident.id);

            logger.info(`Creating notifications for new incident ${incident.id}`);

            // Create notifications for admins and staff
            try {
                const adminNotifications = await notificationService.notifyByRole('admin', {
                    type: 'incident',
                    title: 'New Incident Reported',
                    message: `New ${incidentData.incident_type} incident: ${incidentData.title}`,
                    priority: incidentData.severity === 'critical' || incidentData.severity === 'high' ? 'high' : 'medium',
                    related_id: incident.id,
                    related_type: 'incident'
                });
                logger.info(`Created ${adminNotifications.length} notifications for admins`);

                const staffNotifications = await notificationService.notifyByRole('staff', {
                    type: 'incident',
                    title: 'New Incident Reported',
                    message: `New ${incidentData.incident_type} incident: ${incidentData.title}`,
                    priority: incidentData.severity === 'critical' || incidentData.severity === 'high' ? 'high' : 'medium',
                    related_id: incident.id,
                    related_type: 'incident'
                });
                logger.info(`Created ${staffNotifications.length} notifications for staff`);
            } catch (notifError) {
                logger.error('Error creating notifications:', notifError);
            }

            // DEBUG: Log before emitting
            console.log('🔥 [BACKEND] About to emit socket events for incident:', incident.id);
            console.log('🔥 [BACKEND] Incident data:', JSON.stringify(completeIncident, null, 2));

            // Emit real-time event to barangay room
            console.log('📡 [BACKEND] Emitting to barangay:', incidentData.barangay_id);
            emitToBarangay(incidentData.barangay_id, 'incident:new', {
                incident: completeIncident,
                message: `New ${incidentData.incident_type} incident reported in your barangay`
            });

            // Emit to admin/staff
            console.log('📡 [BACKEND] Emitting to admin role');
            emitToRole('admin', 'incident:new', {
                incident: completeIncident,
                message: 'New incident requires verification'
            });

            console.log('📡 [BACKEND] Emitting to staff role');
            emitToRole('staff', 'incident:new', {
                incident: completeIncident,
                message: 'New incident requires verification'
            });

            // Broadcast to all connected clients so everyone sees the new incident
            console.log('📡 [BACKEND] Broadcasting incident:new to ALL clients');
            broadcast('incident:new', {
                incident: completeIncident,
                message: `New ${incidentData.incident_type} incident reported`
            });

            console.log('✅ [BACKEND] All socket events emitted for incident:', incident.id);
            logger.info(`Incident created: ${incident.id} by user ${userId}`);

            return completeIncident;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in createIncident:', error);
            throw error;
        }
    }

    /**
     * Update incident
     */
    async updateIncident(incidentId, updateData, userId, userRole) {
        const transaction = await sequelize.transaction();

        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                return null;
            }

            // Check permissions
            if (userRole === 'user' && incident.reported_by !== userId) {
                throw new Error('Unauthorized to update this incident');
            }

            // Update incident
            await incident.update(updateData, { transaction });

            await transaction.commit();

            // Fetch updated incident
            const updatedIncident = await this.getIncidentById(incidentId);

            // Emit real-time update
            emitToBarangay(incident.barangay_id, 'incident:updated', {
                incident: updatedIncident,
                message: `Incident status updated to ${updateData.status || incident.status}`
            });

            // Broadcast to all connected clients
            broadcast('incident:updated', {
                incident: updatedIncident,
                message: `Incident updated: ${incident.title}`
            });

            logger.info(`Incident updated: ${incidentId} by user ${userId}`);

            return updatedIncident;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in updateIncident:', error);
            throw error;
        }
    }

    /**
     * Verify incident (Admin/Staff only)
     */
    async verifyIncident(incidentId, userId, verificationData) {
        const transaction = await sequelize.transaction();

        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                return null;
            }

            // Update verification status
            await incident.update({
                is_verified: true,
                verified_by: userId,
                verified_at: new Date(),
                status: 'verified',
                ...verificationData
            }, { transaction });

            await transaction.commit();

            // Fetch updated incident
            const verifiedIncident = await this.getIncidentById(incidentId);

            // Emit real-time verification
            emitToBarangay(incident.barangay_id, 'incident:verified', {
                incident: verifiedIncident,
                message: `Incident verified: ${incident.title}`
            });

            // Broadcast to all connected clients
            broadcast('incident:verified', {
                incident: verifiedIncident,
                message: `Incident verified: ${incident.title}`
            });

            // Notify reporter
            const io = require('../server').io;
            if (io) {
                io.to(`user:${incident.reported_by}`).emit('incident:verified', {
                    incident: verifiedIncident,
                    message: 'Your incident report has been verified'
                });
            }

            logger.info(`Incident verified: ${incidentId} by user ${userId}`);

            return verifiedIncident;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in verifyIncident:', error);
            throw error;
        }
    }

    /**
     * Reject incident (Admin/Staff only)
     */
    async rejectIncident(incidentId, userId, reason) {
        const transaction = await sequelize.transaction();

        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                return null;
            }

            // Update status
            await incident.update({
                status: 'closed',
                is_verified: false,
                verified_by: userId,
                verified_at: new Date(),
                resolution_notes: reason
            }, { transaction });

            await transaction.commit();

            // Notify reporter
            const io = require('../server').io;
            if (io) {
                io.to(`user:${incident.reported_by}`).emit('incident:rejected', {
                    incident_id: incidentId,
                    reason,
                    message: 'Your incident report was not verified'
                });
            }

            logger.info(`Incident rejected: ${incidentId} by user ${userId}`);

            return { message: 'Incident rejected', reason };
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in rejectIncident:', error);
            throw error;
        }
    }

    /**
     * Delete incident
     */
    async deleteIncident(incidentId, userId) {
        const transaction = await sequelize.transaction();

        try {
            const incident = await Incident.findByPk(incidentId);

            if (!incident) {
                return null;
            }

            await incident.destroy({ transaction });

            await transaction.commit();

            logger.info(`Incident deleted: ${incidentId} by user ${userId}`);

            return { message: 'Incident deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in deleteIncident:', error);
            throw error;
        }
    }

    /**
     * Get incident statistics
     */
    async getIncidentStats(filters = {}) {
        try {
            const { barangay_id, start_date, end_date } = filters;

            const where = {};

            if (barangay_id) {
                where.barangay_id = barangay_id;
            }

            if (start_date || end_date) {
                where.created_at = {};
                if (start_date) {
                    where.created_at[Op.gte] = new Date(start_date);
                }
                if (end_date) {
                    where.created_at[Op.lte] = new Date(end_date);
                }
            }

            // Get counts by type
            const byType = await Incident.findAll({
                where,
                attributes: [
                    'incident_type',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['incident_type']
            });

            // Get counts by severity
            const bySeverity = await Incident.findAll({
                where,
                attributes: [
                    'severity',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['severity']
            });

            // Get counts by status
            const byStatus = await Incident.findAll({
                where,
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['status']
            });

            // Get total counts
            const total = await Incident.count({ where });
            const verified = await Incident.count({ where: { ...where, is_verified: true } });
            const unverified = await Incident.count({ where: { ...where, is_verified: false } });

            return {
                total,
                verified,
                unverified,
                by_type: byType,
                by_severity: bySeverity,
                by_status: byStatus
            };
        } catch (error) {
            logger.error('Error in getIncidentStats:', error);
            throw error;
        }
    }

    /**
     * Get live incident feed (recent incidents)
     */
    async getLiveFeed(limit = 10) {
        try {
            const incidents = await Incident.findAll({
                where: {
                    status: {
                        [Op.in]: ['reported', 'verified', 'responding']
                    }
                },
                include: [
                    {
                        model: User,
                        as: 'reporter',
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit)
            });

            // Parse JSON fields
            const feed = incidents.map(incident => {
                const data = incident.toJSON();
                if (data.images) {
                    try {
                        data.images = JSON.parse(data.images);
                    } catch (e) {
                        data.images = [];
                    }
                }
                return data;
            });

            return feed;
        } catch (error) {
            logger.error('Error in getLiveFeed:', error);
            throw error;
        }
    }
}

module.exports = new IncidentService();
