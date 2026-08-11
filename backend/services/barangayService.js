/**
 * Barangay Service
 * Business logic for barangay management
 */

const { Barangay, Establishment, Incident, Report, TrafficData } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class BarangayService {
    /**
     * Get all barangays with optional filters
     */
    async getAllBarangays(filters = {}) {
        try {
            const {
                flood_risk_level,
                ashfall_risk_level,
                search,
                page = 1,
                limit = 50
            } = filters;

            const whereClause = {};

            // Filter by flood risk level
            if (flood_risk_level) {
                whereClause.flood_risk_level = flood_risk_level;
            }

            // Filter by ashfall risk level
            if (ashfall_risk_level) {
                whereClause.ashfall_risk_level = ashfall_risk_level;
            }

            // Search by name
            if (search) {
                whereClause.name = {
                    [Op.like]: `%${search}%`
                };
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Barangay.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: offset,
                order: [['name', 'ASC']],
                attributes: {
                    exclude: ['geojson'] // Exclude large GeoJSON by default
                }
            });

            return {
                barangays: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllBarangays:', error);
            throw error;
        }
    }

    /**
     * Get barangay by ID with full details
     */
    async getBarangayById(id, includeGeoJSON = false) {
        try {
            const attributes = includeGeoJSON
                ? undefined
                : { exclude: ['geojson'] };

            const barangay = await Barangay.findByPk(id, {
                attributes,
                include: [
                    {
                        model: Establishment,
                        as: 'establishments',
                        attributes: ['id', 'name', 'type', 'latitude', 'longitude', 'address']
                    }
                ]
            });

            if (!barangay) {
                throw new Error('Barangay not found');
            }

            // Get statistics
            const stats = await this.getBarangayStats(id);

            return {
                ...barangay.toJSON(),
                statistics: stats
            };
        } catch (error) {
            logger.error('Error in getBarangayById:', error);
            throw error;
        }
    }

    /**
     * Get barangay statistics
     */
    async getBarangayStats(barangayId) {
        try {
            const [
                totalIncidents,
                activeIncidents,
                totalReports,
                pendingReports,
                totalEstablishments,
                evacuationCenters
            ] = await Promise.all([
                Incident.count({ where: { barangay_id: barangayId } }),
                Incident.count({
                    where: {
                        barangay_id: barangayId,
                        status: { [Op.in]: ['reported', 'verified', 'responding'] }
                    }
                }),
                Report.count({ where: { barangay_id: barangayId } }),
                Report.count({
                    where: {
                        barangay_id: barangayId,
                        status: 'pending'
                    }
                }),
                Establishment.count({ where: { barangay_id: barangayId } }),
                Establishment.count({
                    where: {
                        barangay_id: barangayId,
                        type: 'evacuation'
                    }
                })
            ]);

            return {
                incidents: {
                    total: totalIncidents,
                    active: activeIncidents
                },
                reports: {
                    total: totalReports,
                    pending: pendingReports
                },
                establishments: {
                    total: totalEstablishments,
                    evacuation_centers: evacuationCenters
                }
            };
        } catch (error) {
            logger.error('Error in getBarangayStats:', error);
            throw error;
        }
    }

    /**
     * Create new barangay
     */
    async createBarangay(data) {
        try {
            const barangay = await Barangay.create(data);
            logger.info(`Barangay created: ${barangay.name} (ID: ${barangay.id})`);
            return barangay;
        } catch (error) {
            logger.error('Error in createBarangay:', error);
            throw error;
        }
    }

    /**
     * Update barangay
     */
    async updateBarangay(id, data) {
        try {
            const barangay = await Barangay.findByPk(id);

            if (!barangay) {
                throw new Error('Barangay not found');
            }

            await barangay.update(data);
            logger.info(`Barangay updated: ${barangay.name} (ID: ${id})`);

            return barangay;
        } catch (error) {
            logger.error('Error in updateBarangay:', error);
            throw error;
        }
    }

    /**
     * Delete barangay
     */
    async deleteBarangay(id) {
        try {
            const barangay = await Barangay.findByPk(id);

            if (!barangay) {
                throw new Error('Barangay not found');
            }

            // Check for dependencies
            const hasIncidents = await Incident.count({ where: { barangay_id: id } });
            const hasReports = await Report.count({ where: { barangay_id: id } });
            const hasEstablishments = await Establishment.count({ where: { barangay_id: id } });

            if (hasIncidents > 0 || hasReports > 0 || hasEstablishments > 0) {
                throw new Error('Cannot delete barangay with existing incidents, reports, or establishments');
            }

            await barangay.destroy();
            logger.info(`Barangay deleted: ${barangay.name} (ID: ${id})`);

            return { message: 'Barangay deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteBarangay:', error);
            throw error;
        }
    }

    /**
     * Get barangays by flood risk level
     */
    async getBarangaysByRiskLevel(riskLevel, riskType = 'flood') {
        try {
            const whereClause = {};

            if (riskType === 'flood') {
                whereClause.flood_risk_level = riskLevel;
            } else if (riskType === 'ashfall') {
                whereClause.ashfall_risk_level = riskLevel;
            }

            const barangays = await Barangay.findAll({
                where: whereClause,
                attributes: { exclude: ['geojson'] },
                order: [['name', 'ASC']]
            });

            return barangays;
        } catch (error) {
            logger.error('Error in getBarangaysByRiskLevel:', error);
            throw error;
        }
    }

    /**
     * Get high-risk barangays
     */
    async getHighRiskBarangays() {
        try {
            const barangays = await Barangay.findAll({
                where: {
                    [Op.or]: [
                        { flood_risk_level: { [Op.in]: ['High', 'Very High'] } },
                        { ashfall_risk_level: { [Op.in]: ['High', 'Very High'] } }
                    ]
                },
                attributes: { exclude: ['geojson'] },
                order: [['name', 'ASC']]
            });

            return barangays;
        } catch (error) {
            logger.error('Error in getHighRiskBarangays:', error);
            throw error;
        }
    }
}

module.exports = new BarangayService();
