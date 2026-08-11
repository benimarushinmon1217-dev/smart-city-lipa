/**
 * Database Synchronization Utility
 * Creates all tables based on Sequelize models
 */

const { sequelize } = require('../config/database');
const logger = require('./logger');

// Import all models
require('../models');

const syncDatabase = async (options = {}) => {
    try {
        logger.info('Starting database synchronization...');

        // Sync all models
        await sequelize.sync(options);

        logger.info('✅ Database synchronized successfully');

        if (options.force) {
            logger.warn('⚠️  All tables were dropped and recreated (force: true)');
        }

        if (options.alter) {
            logger.info('📝 Tables were altered to match models (alter: true)');
        }

        return true;
    } catch (error) {
        logger.error('❌ Database synchronization failed:', error);
        throw error;
    }
};

// Run sync if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const alter = args.includes('--alter');

    syncDatabase({ force, alter })
        .then(() => {
            console.log('Database sync completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database sync failed:', error);
            process.exit(1);
        });
}

module.exports = syncDatabase;
