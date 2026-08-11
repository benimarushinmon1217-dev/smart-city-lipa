/**
 * Express Application Configuration
 * Main app setup with middleware and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, require('./routes/authRoutes'));
app.use(`/api/${API_VERSION}/users`, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/admin`, require('./routes/adminRoutes'));
app.use(`/api/${API_VERSION}/barangays`, require('./routes/barangayRoutes'));
app.use(`/api/${API_VERSION}/incidents`, require('./routes/incidentRoutes'));
app.use(`/api/${API_VERSION}/reports`, require('./routes/reportRoutes'));
app.use(`/api/${API_VERSION}/establishments`, require('./routes/establishmentRoutes'));
app.use(`/api/${API_VERSION}/notifications`, require('./routes/notificationRoutes'));
app.use(`/api/${API_VERSION}/announcements`, require('./routes/announcementRoutes'));
app.use(`/api/${API_VERSION}/traffic`, require('./routes/trafficRoutes'));
app.use(`/api/${API_VERSION}/emergency-contacts`, require('./routes/emergencyContactRoutes'));
app.use(`/api/${API_VERSION}/ai`, require('./routes/aiRoutes'));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
