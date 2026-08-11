/**
 * Establishment Service
 * Business logic for establishment/facility management
 */

const { Establishment, Barangay } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class EstablishmentService {
    /**
     * Get all establishments with optional filters
     */
    async getAllEstablishments(filters = {}) {
        try {
            const {
                type,
                barangay_id,
                search,
                page = 1,
                limit = 50
            } = filters;

            const whereClause = {};

            // Filter by type
            if (type) {
                whereClause.type = type;
            }

            // Filter by barangay
            if (barangay_id) {
                whereClause.barangay_id = barangay_id;
            }

            // Search by name or address
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ];
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Establishment.findAndCountAll({
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
                order: [['name', 'ASC']]
            });

            return {
                establishments: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllEstablishments:', error);
            throw error;
        }
    }

    /**
     * Get establishment by ID
     */
    async getEstablishmentById(id) {
        try {
            const establishment = await Establishment.findByPk(id, {
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            if (!establishment) {
                throw new Error('Establishment not found');
            }

            return establishment;
        } catch (error) {
            logger.error('Error in getEstablishmentById:', error);
            throw error;
        }
    }

    /**
     * Get establishments by type
     */
    async getEstablishmentsByType(type, barangayId = null) {
        try {
            const whereClause = { type };

            if (barangayId) {
                whereClause.barangay_id = barangayId;
            }

            const establishments = await Establishment.findAll({
                where: whereClause,
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['name', 'ASC']]
            });

            return establishments;
        } catch (error) {
            logger.error('Error in getEstablishmentsByType:', error);
            throw error;
        }
    }

    /**
     * Get evacuation centers
     */
    async getEvacuationCenters(barangayId = null) {
        try {
            return await this.getEstablishmentsByType('evacuation', barangayId);
        } catch (error) {
            logger.error('Error in getEvacuationCenters:', error);
            throw error;
        }
    }

    /**
     * Get hospitals
     */
    async getHospitals(barangayId = null) {
        try {
            return await this.getEstablishmentsByType('hospital', barangayId);
        } catch (error) {
            logger.error('Error in getHospitals:', error);
            throw error;
        }
    }

    /**
     * Create new establishment
     */
    async createEstablishment(data) {
        try {
            // Verify barangay exists
            const barangay = await Barangay.findByPk(data.barangay_id);
            if (!barangay) {
                throw new Error('Barangay not found');
            }

            const establishment = await Establishment.create(data);
            logger.info(`Establishment created: ${establishment.name} (ID: ${establishment.id})`);

            // Reload with barangay data
            await establishment.reload({
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            // Emit socket event for real-time updates
            try {
                const { broadcast } = require('../config/socket');
                broadcast('establishment:created', {
                    establishment: establishment.toJSON(),
                    type: establishment.type,
                    timestamp: new Date()
                });

                if (establishment.type === 'evacuation') {
                    broadcast('shelter:created', {
                        shelter: establishment.toJSON(),
                        timestamp: new Date()
                    });
                }
            } catch (socketError) {
                logger.error('Failed to emit establishment:created event:', socketError);
            }

            return establishment;
        } catch (error) {
            logger.error('Error in createEstablishment:', error);
            throw error;
        }
    }

    /**
     * Update establishment
     */
    async updateEstablishment(id, data) {
        try {
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                throw new Error('Establishment not found');
            }

            // If barangay is being updated, verify it exists
            if (data.barangay_id && data.barangay_id !== establishment.barangay_id) {
                const barangay = await Barangay.findByPk(data.barangay_id);
                if (!barangay) {
                    throw new Error('Barangay not found');
                }
            }

            await establishment.update(data);
            logger.info(`Establishment updated: ${establishment.name} (ID: ${id})`);

            // Reload with barangay data
            await establishment.reload({
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            // Emit socket event for real-time updates
            try {
                const { broadcast } = require('../config/socket');
                broadcast('establishment:updated', {
                    establishment: establishment.toJSON(),
                    type: establishment.type,
                    timestamp: new Date()
                });

                if (establishment.type === 'evacuation') {
                    broadcast('shelter:updated', {
                        shelter: establishment.toJSON(),
                        timestamp: new Date()
                    });
                }
            } catch (socketError) {
                logger.error('Failed to emit establishment:updated event:', socketError);
            }

            return establishment;
        } catch (error) {
            logger.error('Error in updateEstablishment:', error);
            throw error;
        }
    }

    /**
     * Delete establishment
     */
    async deleteEstablishment(id) {
        try {
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                throw new Error('Establishment not found');
            }

            const establishmentData = establishment.toJSON();
            await establishment.destroy();
            logger.info(`Establishment deleted: ${establishment.name} (ID: ${id})`);

            // Emit socket event for real-time updates
            try {
                const { broadcast } = require('../config/socket');
                broadcast('establishment:deleted', {
                    id,
                    type: establishmentData.type,
                    timestamp: new Date()
                });

                if (establishmentData.type === 'evacuation') {
                    broadcast('shelter:deleted', {
                        id,
                        timestamp: new Date()
                    });
                }
            } catch (socketError) {
                logger.error('Failed to emit establishment:deleted event:', socketError);
            }

            return { message: 'Establishment deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteEstablishment:', error);
            throw error;
        }
    }

    /**
     * Find nearest establishments by type
     */
    async findNearestByType(type, latitude, longitude, limit = 5) {
        try {
            const establishments = await Establishment.findAll({
                where: { type },
                include: [
                    {
                        model: Barangay,
                        as: 'barangay',
                        attributes: ['id', 'name']
                    }
                ]
            });

            // Calculate distances
            const withDistances = establishments.map(est => {
                const distance = this.calculateDistance(
                    latitude,
                    longitude,
                    est.latitude,
                    est.longitude
                );

                return {
                    ...est.toJSON(),
                    distance
                };
            });

            // Sort by distance and limit
            withDistances.sort((a, b) => a.distance - b.distance);

            return withDistances.slice(0, limit);
        } catch (error) {
            logger.error('Error in findNearestByType:', error);
            throw error;
        }
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance; // Distance in km
    }

    /**
     * Convert degrees to radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = new EstablishmentService();
