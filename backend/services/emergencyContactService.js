/**
 * Emergency Contact Service
 * Business logic for emergency hotlines and contact information
 */

const { EmergencyContact } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class EmergencyContactService {
    /**
     * Get all emergency contacts with optional filters
     */
    async getAllContacts(filters = {}) {
        try {
            const {
                type,
                is_active,
                search,
                page = 1,
                limit = 50
            } = filters;

            const whereClause = {};

            // Filter by type
            if (type) {
                whereClause.type = type;
            }

            // Filter by active status
            if (is_active !== undefined) {
                whereClause.is_active = is_active === 'true';
            }

            // Search by name
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } }
                ];
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await EmergencyContact.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: offset,
                order: [['priority', 'DESC'], ['type', 'ASC'], ['name', 'ASC']]
            });

            return {
                contacts: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllContacts:', error);
            throw error;
        }
    }

    /**
     * Get active emergency contacts
     */
    async getActiveContacts() {
        try {
            const contacts = await EmergencyContact.findAll({
                where: { is_active: true },
                order: [['priority', 'DESC'], ['type', 'ASC'], ['name', 'ASC']]
            });

            // Group by type
            const grouped = contacts.reduce((acc, contact) => {
                const type = contact.type;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(contact);
                return acc;
            }, {});

            return grouped;
        } catch (error) {
            logger.error('Error in getActiveContacts:', error);
            throw error;
        }
    }

    /**
     * Get emergency contact by ID
     */
    async getContactById(id) {
        try {
            const contact = await EmergencyContact.findByPk(id);

            if (!contact) {
                throw new Error('Emergency contact not found');
            }

            return contact;
        } catch (error) {
            logger.error('Error in getContactById:', error);
            throw error;
        }
    }

    /**
     * Get contacts by type
     */
    async getContactsByCategory(type) {
        try {
            const contacts = await EmergencyContact.findAll({
                where: {
                    type,
                    is_active: true
                },
                order: [['priority', 'DESC'], ['name', 'ASC']]
            });

            return contacts;
        } catch (error) {
            logger.error('Error in getContactsByCategory:', error);
            throw error;
        }
    }

    /**
     * Get emergency hotlines (most critical contacts)
     */
    async getEmergencyHotlines() {
        try {
            const hotlines = await EmergencyContact.findAll({
                where: {
                    type: { [Op.in]: ['police', 'fire', 'medical', 'disaster_response'] },
                    is_active: true
                },
                order: [['priority', 'DESC'], ['type', 'ASC'], ['name', 'ASC']]
            });

            return hotlines;
        } catch (error) {
            logger.error('Error in getEmergencyHotlines:', error);
            throw error;
        }
    }

    /**
     * Create new emergency contact
     */
    async createContact(data) {
        try {
            const contact = await EmergencyContact.create(data);
            logger.info(`Emergency contact created: ${contact.name} (ID: ${contact.id})`);

            return contact;
        } catch (error) {
            logger.error('Error in createContact:', error);
            throw error;
        }
    }

    /**
     * Update emergency contact
     */
    async updateContact(id, data) {
        try {
            const contact = await EmergencyContact.findByPk(id);

            if (!contact) {
                throw new Error('Emergency contact not found');
            }

            await contact.update(data);
            logger.info(`Emergency contact updated: ${contact.name} (ID: ${id})`);

            return contact;
        } catch (error) {
            logger.error('Error in updateContact:', error);
            throw error;
        }
    }

    /**
     * Delete emergency contact
     */
    async deleteContact(id) {
        try {
            const contact = await EmergencyContact.findByPk(id);

            if (!contact) {
                throw new Error('Emergency contact not found');
            }

            await contact.destroy();
            logger.info(`Emergency contact deleted: ${contact.name} (ID: ${id})`);

            return { message: 'Emergency contact deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteContact:', error);
            throw error;
        }
    }

    /**
     * Deactivate emergency contact
     */
    async deactivateContact(id) {
        try {
            const contact = await EmergencyContact.findByPk(id);

            if (!contact) {
                throw new Error('Emergency contact not found');
            }

            await contact.update({ is_active: false });
            logger.info(`Emergency contact deactivated: ${contact.name} (ID: ${id})`);

            return contact;
        } catch (error) {
            logger.error('Error in deactivateContact:', error);
            throw error;
        }
    }

    /**
     * Get contact statistics
     */
    async getContactStats() {
        try {
            const [
                totalContacts,
                activeContacts,
                typeCounts
            ] = await Promise.all([
                EmergencyContact.count(),
                EmergencyContact.count({ where: { is_active: true } }),
                EmergencyContact.findAll({
                    attributes: [
                        'type',
                        [EmergencyContact.sequelize.fn('COUNT', EmergencyContact.sequelize.col('id')), 'count']
                    ],
                    where: { is_active: true },
                    group: ['type']
                })
            ]);

            const byType = typeCounts.reduce((acc, item) => {
                acc[item.type] = parseInt(item.get('count'));
                return acc;
            }, {});

            return {
                total: totalContacts,
                active: activeContacts,
                by_type: byType
            };
        } catch (error) {
            logger.error('Error in getContactStats:', error);
            throw error;
        }
    }
}

module.exports = new EmergencyContactService();
