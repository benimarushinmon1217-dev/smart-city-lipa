/**
 * Traffic Service
 * Business logic for traffic monitoring data
 */

const { TrafficData, Barangay } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { handleTrafficUpdated } = require('../sockets/eventHandlers');

class TrafficService {
    /**
     * Get all traffic data with optional filters
     */
    async getAllTrafficData(filters = {}) {
        try {
            const {
                barangay_id,
                traffic_level,
                road_condition,
                page = 1,
                limit = 50
            } = filters;

            const whereClause = {};

            // Filter by barangay
            if (barangay_id) {
                whereClause.barangay_id = barangay_id;
            }

            // Filter by traffic level
            if (traffic_level) {
                whereClause.traffic_level = traffic_level;
            }

            // Filter by road condition
            if (road_condition) {
                whereClause.road_condition = road_condition;
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await TrafficData.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                limit: parseInt(limit),
                offset: offset,
                order: [['created_at', 'DESC']]
            });

            return {
                traffic_data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllTrafficData:', error);
            throw error;
        }
    }

    /**
     * Get traffic data by ID
     */
    async getTrafficDataById(id) {
        try {
            const trafficData = await TrafficData.findByPk(id, {
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            if (!trafficData) {
                throw new Error('Traffic data not found');
            }

            return trafficData;
        } catch (error) {
            logger.error('Error in getTrafficDataById:', error);
            throw error;
        }
    }

    /**
     * Get latest traffic data for barangay
     */
    async getLatestByBarangay(barangayId) {
        try {
            const trafficData = await TrafficData.findOne({
                where: { barangay_id: barangayId },
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return trafficData;
        } catch (error) {
            logger.error('Error in getLatestByBarangay:', error);
            throw error;
        }
    }

    /**
     * Get traffic hotspots (high traffic or blocked roads)
     */
    async getTrafficHotspots() {
        try {
            const hotspots = await TrafficData.findAll({
                where: {
                    [Op.or]: [
                        { traffic_level: 'heavy' },
                        { road_condition: { [Op.in]: ['blocked', 'flooded', 'damaged'] } }
                    ],
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
                    }
                },
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: 20
            });

            return hotspots;
        } catch (error) {
            logger.error('Error in getTrafficHotspots:', error);
            throw error;
        }
    }

    /**
     * Create new traffic data entry
     */
    async createTrafficData(data) {
        try {
            // Verify barangay exists
            const barangay = await Barangay.findByPk(data.barangay_id);
            if (!barangay) {
                throw new Error('Barangay not found');
            }

            const trafficData = await TrafficData.create(data);
            logger.info(`Traffic data created for barangay ${data.barangay_id} (ID: ${trafficData.id})`);

            // Reload with barangay data
            await trafficData.reload({
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            // Send real-time update
            handleTrafficUpdated({
                barangayId: data.barangay_id,
                location: data.location,
                trafficLevel: data.traffic_level,
                roadCondition: data.road_condition
            });

            return trafficData;
        } catch (error) {
            logger.error('Error in createTrafficData:', error);
            throw error;
        }
    }

    /**
     * Update traffic data
     */
    async updateTrafficData(id, data) {
        try {
            const trafficData = await TrafficData.findByPk(id);

            if (!trafficData) {
                throw new Error('Traffic data not found');
            }

            // If barangay is being updated, verify it exists
            if (data.barangay_id && data.barangay_id !== trafficData.barangay_id) {
                const barangay = await Barangay.findByPk(data.barangay_id);
                if (!barangay) {
                    throw new Error('Barangay not found');
                }
            }

            await trafficData.update(data);
            logger.info(`Traffic data updated (ID: ${id})`);

            // Reload with barangay data
            await trafficData.reload({
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            // Send real-time update
            handleTrafficUpdated({
                barangayId: trafficData.barangay_id,
                location: trafficData.location,
                trafficLevel: trafficData.traffic_level,
                roadCondition: trafficData.road_condition
            });

            return trafficData;
        } catch (error) {
            logger.error('Error in updateTrafficData:', error);
            throw error;
        }
    }

    /**
     * Delete traffic data
     */
    async deleteTrafficData(id) {
        try {
            const trafficData = await TrafficData.findByPk(id);

            if (!trafficData) {
                throw new Error('Traffic data not found');
            }

            await trafficData.destroy();
            logger.info(`Traffic data deleted (ID: ${id})`);

            return { message: 'Traffic data deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteTrafficData:', error);
            throw error;
        }
    }

    /**
     * Get traffic statistics
     */
    async getTrafficStats() {
        try {
            const [
                totalRecords,
                heavyTraffic,
                blockedRoads,
                recentUpdates
            ] = await Promise.all([
                TrafficData.count(),
                TrafficData.count({
                    where: {
                        traffic_level: 'heavy',
                        created_at: {
                            [Op.gte]: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
                        }
                    }
                }),
                TrafficData.count({
                    where: {
                        road_condition: { [Op.in]: ['blocked', 'flooded', 'damaged'] },
                        created_at: {
                            [Op.gte]: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
                        }
                    }
                }),
                TrafficData.count({
                    where: {
                        created_at: {
                            [Op.gte]: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
                        }
                    }
                })
            ]);

            return {
                total_records: totalRecords,
                heavy_traffic_areas: heavyTraffic,
                blocked_roads: blockedRoads,
                recent_updates: recentUpdates
            };
        } catch (error) {
            logger.error('Error in getTrafficStats:', error);
            throw error;
        }
    }
}

module.exports = new TrafficService();
