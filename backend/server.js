/**
 * Server Entry Point
 * Starts the Express server and initializes database connection
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const { testConnection, sequelize } = require('./config/database');
const { initializeSocket } = require('./config/socket');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await testConnection();

        if (!isConnected) {
            logger.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Sync database (only in development)
        if (process.env.NODE_ENV === 'development') {
            logger.info('Syncing database models...');
            await sequelize.sync({ alter: false });
            logger.info('✅ Database models synced');
        }

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize Socket.io
        initializeSocket(server);

        // Start listening
        server.listen(PORT, () => {
            logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            logger.info(`📍 API available at http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
            logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
            logger.info(`🔌 Socket.io ready for real-time connections`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                logger.info('HTTP server closed');
                sequelize.close();
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT signal received: closing HTTP server');
            server.close(() => {
                logger.info('HTTP server closed');
                sequelize.close();
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();
