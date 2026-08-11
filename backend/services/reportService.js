/**
 * Report Service
 * Business logic for user report management
 */

const { Report, User, Barangay, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { emitToBarangay, emitToRole, emitToUser } = require('../config/socket');
const notificationService = require('./notificationService');

class ReportService {
    /**
     * Get all reports with filters and pagination
     */
    async getAllReports(filters = {}, pagination = {}, userId = null, userRole = 'user') {
        try {
            const {
                report_type,
                status,
                priority,
                barangay_id,
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

            // Users can only see their own reports unless admin/staff
            if (userRole === 'user' && userId) {
                where.user_id = userId;
            }

            if (report_type) {
                where.report_type = report_type;
            }

            if (status) {
                where.status = status;
            }

            if (priority) {
                where.priority = priority;
            }

            if (barangay_id) {
                where.barangay_id = barangay_id;
            }

            if (search) {
                where[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { location: { [Op.like]: `%${search}%` } }
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

            // Fetch reports
            const { count, rows } = await Report.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'first_name', 'last_name']
                    },
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'assignedUser',
                        attributes: ['id', 'first_name', 'last_name'],
                        required: false
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [[sort_by, sort_order]],
                distinct: true
            });

            // Parse JSON fields and handle anonymous reports
            const reports = rows.map(report => {
                const data = report.toJSON();

                // Parse images
                if (data.images) {
                    try {
                        data.images = JSON.parse(data.images);
                    } catch (e) {
                        data.images = [];
                    }
                }

                // Hide user info for anonymous reports (unless admin/staff)
                if (data.is_anonymous && userRole === 'user') {
                    data.user = {
                        id: null,
                        first_name: 'Anonymous',
                        last_name: 'User'
                    };
                }

                return data;
            });

            return {
                reports,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllReports:', error);
            throw error;
        }
    }

    /**
     * Get report by ID
     */
    async getReportById(reportId, userId = null, userRole = 'user') {
        try {
            const report = await Report.findByPk(reportId, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'first_name', 'last_name', 'phone']
                    },
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name', 'flood_risk_level', 'ashfall_risk_level'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'assignedUser',
                        attributes: ['id', 'first_name', 'last_name'],
                        required: false
                    }
                ]
            });

            if (!report) {
                return null;
            }

            // Check permissions
            if (userRole === 'user' && report.user_id !== userId) {
                throw new Error('Unauthorized to view this report');
            }

            const data = report.toJSON();

            // Parse images
            if (data.images) {
                try {
                    data.images = JSON.parse(data.images);
                } catch (e) {
                    data.images = [];
                }
            }

            // Hide user info for anonymous reports (unless admin/staff)
            if (data.is_anonymous && userRole === 'user') {
                data.user = {
                    id: null,
                    first_name: 'Anonymous',
                    last_name: 'User'
                };
            }

            return data;
        } catch (error) {
            logger.error('Error in getReportById:', error);
            throw error;
        }
    }

    /**
     * Create new report
     */
    async createReport(reportData, userId, imageFiles = []) {
        const transaction = await sequelize.transaction();

        try {
            // Process uploaded images
            const imagePaths = imageFiles.map(file => `/uploads/reports/${file.filename}`);

            // Create report
            const report = await Report.create({
                ...reportData,
                user_id: userId,
                images: JSON.stringify(imagePaths),
                status: 'pending'
            }, { transaction });

            await transaction.commit();

            // Fetch complete report data
            const completeReport = await this.getReportById(report.id, userId, 'admin');

            console.log('📋 [REPORT SERVICE] Creating notifications for new report', report.id);
            logger.info(`Creating notifications for new report ${report.id}`);

            // Create notifications for admins and staff
            try {
                console.log('📋 [REPORT SERVICE] Calling notificationService.notifyByRole for admins...');
                const adminNotifications = await notificationService.notifyByRole('admin', {
                    type: 'report',
                    title: 'New Report Submitted',
                    message: `New ${reportData.report_type} report: ${reportData.title}`,
                    priority: reportData.priority || 'medium',
                    related_id: report.id,
                    related_type: 'report'
                });
                console.log('📋 [REPORT SERVICE] Admin notifications created:', adminNotifications.length);
                logger.info(`Created ${adminNotifications.length} notifications for admins`);

                console.log('📋 [REPORT SERVICE] Calling notificationService.notifyByRole for staff...');
                const staffNotifications = await notificationService.notifyByRole('staff', {
                    type: 'report',
                    title: 'New Report Submitted',
                    message: `New ${reportData.report_type} report: ${reportData.title}`,
                    priority: reportData.priority || 'medium',
                    related_id: report.id,
                    related_type: 'report'
                });
                console.log('📋 [REPORT SERVICE] Staff notifications created:', staffNotifications.length);
                logger.info(`Created ${staffNotifications.length} notifications for staff`);
            } catch (notifError) {
                console.error('❌ [REPORT SERVICE] Error creating notifications:', notifError);
                console.error('❌ [REPORT SERVICE] Error stack:', notifError.stack);
                logger.error('Error creating notifications:', notifError);
            }

            // Emit real-time event to admin/staff
            logger.info('Emitting report:new socket event to admin and staff');
            emitToRole('admin', 'report:new', {
                report: completeReport,
                message: `New ${reportData.report_type} report submitted`
            });

            emitToRole('staff', 'report:new', {
                report: completeReport,
                message: `New ${reportData.report_type} report submitted`
            });

            // Emit to barangay if specified
            if (reportData.barangay_id) {
                emitToBarangay(reportData.barangay_id, 'report:new', {
                    report: completeReport,
                    message: 'New report submitted in your barangay'
                });
            }

            logger.info(`Report created: ${report.id} by user ${userId}`);

            return completeReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in createReport:', error);
            throw error;
        }
    }

    /**
     * Update report
     */
    async updateReport(reportId, updateData, userId, userRole) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Check permissions
            if (userRole === 'user' && report.user_id !== userId) {
                throw new Error('Unauthorized to update this report');
            }

            // Users can only update their own pending reports
            if (userRole === 'user' && report.status !== 'pending') {
                throw new Error('Cannot update report that is already being processed');
            }

            // Update report
            await report.update(updateData, { transaction });

            await transaction.commit();

            // Fetch updated report
            const updatedReport = await this.getReportById(reportId, userId, userRole);

            // Emit real-time update
            emitToUser(report.user_id, 'report:updated', {
                report: updatedReport,
                message: `Report status updated to ${updateData.status || report.status}`
            });

            // Notify assigned user if status changed
            if (updateData.status && report.assigned_to) {
                emitToUser(report.assigned_to, 'report:updated', {
                    report: updatedReport,
                    message: 'Assigned report status updated'
                });
            }

            logger.info(`Report updated: ${reportId} by user ${userId}`);

            return updatedReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in updateReport:', error);
            throw error;
        }
    }

    /**
     * Assign report to staff member
     */
    async assignReport(reportId, assignedToId, userId) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Update assignment
            await report.update({
                assigned_to: assignedToId,
                status: 'in_progress'
            }, { transaction });

            await transaction.commit();

            // Fetch updated report
            const updatedReport = await this.getReportById(reportId, userId, 'admin');

            // Notify assigned user
            emitToUser(assignedToId, 'report:assigned', {
                report: updatedReport,
                message: 'A new report has been assigned to you'
            });

            // Notify reporter
            emitToUser(report.user_id, 'report:updated', {
                report: updatedReport,
                message: 'Your report is now being processed'
            });

            logger.info(`Report assigned: ${reportId} to user ${assignedToId}`);

            return updatedReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in assignReport:', error);
            throw error;
        }
    }

    /**
     * Verify report
     */
    async verifyReport(reportId, userId) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Update report status to verified
            await report.update({
                status: 'verified'
            }, { transaction });

            await transaction.commit();

            // Fetch updated report
            const updatedReport = await this.getReportById(reportId, userId, 'admin');

            // Emit real-time event
            const { emitToRole, emitToUser } = require('../config/socket');

            // Notify admins and staff
            emitToRole('admin', 'report:verified', {
                report: updatedReport,
                message: 'Report verified'
            });

            emitToRole('staff', 'report:verified', {
                report: updatedReport,
                message: 'Report verified'
            });

            // Notify reporter
            if (report.user_id) {
                emitToUser(report.user_id, 'report:verified', {
                    report: updatedReport,
                    message: 'Your report has been verified'
                });
            }

            logger.info(`Report verified: ${reportId} by user ${userId}`);

            return updatedReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in verifyReport:', error);
            throw error;
        }
    }

    /**
     * Resolve report
     */
    async resolveReport(reportId, resolutionNotes, userId) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Update report
            await report.update({
                status: 'resolved',
                resolution_notes: resolutionNotes,
                resolved_by: userId,
                resolved_at: new Date()
            }, { transaction });

            await transaction.commit();

            // Fetch updated report
            const updatedReport = await this.getReportById(reportId, userId, 'admin');

            // Notify reporter
            emitToUser(report.user_id, 'report:resolved', {
                report: updatedReport,
                message: 'Your report has been resolved'
            });

            logger.info(`Report assigned: ${reportId} to user ${assignedToId}`);

            return updatedReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in assignReport:', error);
            throw error;
        }
    }

    /**
     * Resolve report
     */
    async resolveReport(reportId, resolutionNotes, userId) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Update status
            await report.update({
                status: 'resolved',
                resolution_notes: resolutionNotes,
                resolved_at: new Date()
            }, { transaction });

            await transaction.commit();

            // Fetch updated report
            const resolvedReport = await this.getReportById(reportId, userId, 'admin');

            // Notify reporter
            emitToUser(report.user_id, 'report:resolved', {
                report: resolvedReport,
                message: 'Your report has been resolved',
                resolution_notes: resolutionNotes
            });

            logger.info(`Report resolved: ${reportId} by user ${userId}`);

            return resolvedReport;
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in resolveReport:', error);
            throw error;
        }
    }

    /**
     * Reject report
     */
    async rejectReport(reportId, reason, userId) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Update status
            await report.update({
                status: 'rejected',
                resolution_notes: reason,
                resolved_at: new Date()
            }, { transaction });

            await transaction.commit();

            // Notify reporter
            emitToUser(report.user_id, 'report:rejected', {
                report_id: reportId,
                reason,
                message: 'Your report was not approved'
            });

            logger.info(`Report rejected: ${reportId} by user ${userId}`);

            return { message: 'Report rejected', reason };
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in rejectReport:', error);
            throw error;
        }
    }

    /**
     * Delete report
     */
    async deleteReport(reportId, userId, userRole) {
        const transaction = await sequelize.transaction();

        try {
            const report = await Report.findByPk(reportId);

            if (!report) {
                return null;
            }

            // Check permissions
            if (userRole === 'user' && report.user_id !== userId) {
                throw new Error('Unauthorized to delete this report');
            }

            await report.destroy({ transaction });

            await transaction.commit();

            // Emit real-time event
            const { emitToRole, emitToUser } = require('../config/socket');

            // Notify admins and staff
            emitToRole('admin', 'report:deleted', {
                report_id: reportId,
                message: 'Report deleted'
            });

            emitToRole('staff', 'report:deleted', {
                report_id: reportId,
                message: 'Report deleted'
            });

            // Notify the reporter
            if (report.user_id) {
                emitToUser(report.user_id, 'report:deleted', {
                    report_id: reportId,
                    message: 'Your report has been deleted'
                });
            }

            logger.info(`Report deleted: ${reportId} by user ${userId}`);

            return { message: 'Report deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            logger.error('Error in deleteReport:', error);
            throw error;
        }
    }

    /**
     * Get report statistics
     */
    async getReportStats(filters = {}) {
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
            const byType = await Report.findAll({
                where,
                attributes: [
                    'report_type',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['report_type']
            });

            // Get counts by status
            const byStatus = await Report.findAll({
                where,
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['status']
            });

            // Get counts by priority
            const byPriority = await Report.findAll({
                where,
                attributes: [
                    'priority',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                group: ['priority']
            });

            // Get total counts
            const total = await Report.count({ where });
            const pending = await Report.count({ where: { ...where, status: 'pending' } });
            const resolved = await Report.count({ where: { ...where, status: 'resolved' } });

            return {
                total,
                pending,
                resolved,
                by_type: byType,
                by_status: byStatus,
                by_priority: byPriority
            };
        } catch (error) {
            logger.error('Error in getReportStats:', error);
            throw error;
        }
    }
}

module.exports = new ReportService();
