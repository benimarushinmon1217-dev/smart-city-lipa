/**
 * Database Configuration
 * Sequelize connection setup for MySQL / Aiven MySQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',

        // Aiven requires SSL/TLS
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },

        logging:
            process.env.NODE_ENV === 'development'
                ? console.log
                : false,

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: false
        },

        timezone: '+08:00'
    }
);

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        return false;
    }
};

module.exports = {
    sequelize,
    testConnection
};