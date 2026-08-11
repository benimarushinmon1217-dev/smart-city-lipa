/**
 * Socket.io Configuration
 * Real-time communication setup
 */

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const jwtConfig = require('./jwt');
const logger = require('../utils/logger');
const { User } = require('../models');

let io;
const onlineUsers = new Map(); // Track online users: userId -> Set of socketIds

/**
 * Initialize Socket.io server
 */
const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: [
                process.env.CORS_ORIGIN || 'http://localhost:5173',
                'http://localhost:5174'
            ],
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                // Allow anonymous connections for public data
                socket.user = null;
                return next();
            }

            // Verify JWT token
            const decoded = jwt.verify(token, jwtConfig.secret);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user || !user.is_active) {
                return next(new Error('Authentication failed'));
            }

            socket.user = user;
            next();
        } catch (error) {
            logger.error('Socket authentication error:', error);
            // Allow connection but mark as unauthenticated
            socket.user = null;
            next();
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        const userId = socket.user?.id;
        const userRole = socket.user?.role;

        logger.info(`Socket connected: ${socket.id} | User: ${userId || 'anonymous'} | Role: ${userRole || 'none'}`);

        // Track online user
        if (userId) {
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);

            // Emit user online event to admins
            emitToRole('admin', 'user:online', {
                userId,
                role: userRole,
                timestamp: new Date()
            });

            logger.info(`User ${userId} is now online (${onlineUsers.get(userId).size} connections)`);
        }

        // Join user-specific room
        if (userId) {
            socket.join(`user:${userId}`);
            logger.info(`User ${userId} joined personal room`);
        }

        // Join role-based rooms
        if (userRole) {
            socket.join(`role:${userRole}`);
            logger.info(`User ${userId} joined role room: ${userRole}`);
        }

        // Handle barangay subscription
        socket.on('subscribe:barangay', (barangayId) => {
            if (barangayId) {
                socket.join(`barangay:${barangayId}`);
                logger.info(`Socket ${socket.id} subscribed to barangay: ${barangayId}`);
                socket.emit('subscribed:barangay', { barangayId });
            }
        });

        // Handle barangay unsubscription
        socket.on('unsubscribe:barangay', (barangayId) => {
            if (barangayId) {
                socket.leave(`barangay:${barangayId}`);
                logger.info(`Socket ${socket.id} unsubscribed from barangay: ${barangayId}`);
                socket.emit('unsubscribed:barangay', { barangayId });
            }
        });

        // Handle location updates (for dynamic routing)
        socket.on('location:update', (data) => {
            if (userId && data.latitude && data.longitude) {
                socket.broadcast.emit('user:location', {
                    userId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timestamp: new Date()
                });
            }
        });

        // Handle route tracking
        socket.on('route:start', (data) => {
            if (userId) {
                socket.join(`route:${userId}`);
                logger.info(`User ${userId} started route tracking`);
            }
        });

        socket.on('route:stop', () => {
            if (userId) {
                socket.leave(`route:${userId}`);
                logger.info(`User ${userId} stopped route tracking`);
            }
        });

        // Ping/pong for connection health
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: Date.now() });
        });

        // Disconnection handler
        socket.on('disconnect', (reason) => {
            logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason}`);

            // Remove from online users tracking
            if (userId && onlineUsers.has(userId)) {
                onlineUsers.get(userId).delete(socket.id);

                // If user has no more connections, mark as offline
                if (onlineUsers.get(userId).size === 0) {
                    onlineUsers.delete(userId);

                    // Emit user offline event to admins
                    emitToRole('admin', 'user:offline', {
                        userId,
                        role: userRole,
                        timestamp: new Date()
                    });

                    logger.info(`User ${userId} is now offline`);
                }
            }
        });

        // Error handler
        socket.on('error', (error) => {
            logger.error(`Socket error: ${socket.id}`, error);
        });
    });

    logger.info('✅ Socket.io server initialized');
    return io;
};

/**
 * Get Socket.io instance
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initializeSocket first.');
    }
    return io;
};

/**
 * Emit event to specific user
 */
const emitToUser = (userId, event, data) => {
    try {
        const io = getIO();
        io.to(`user:${userId}`).emit(event, data);
        logger.info(`Emitted ${event} to user ${userId}`);
    } catch (error) {
        logger.error(`Failed to emit to user ${userId}:`, error);
    }
};

/**
 * Emit event to specific barangay
 */
const emitToBarangay = (barangayId, event, data) => {
    try {
        const io = getIO();
        io.to(`barangay:${barangayId}`).emit(event, data);
        logger.info(`Emitted ${event} to barangay ${barangayId}`);
    } catch (error) {
        logger.error(`Failed to emit to barangay ${barangayId}:`, error);
    }
};

/**
 * Emit event to specific role
 */
const emitToRole = (role, event, data) => {
    try {
        const io = getIO();
        io.to(`role:${role}`).emit(event, data);
        logger.info(`Emitted ${event} to role ${role}`);
    } catch (error) {
        logger.error(`Failed to emit to role ${role}:`, error);
    }
};

/**
 * Broadcast event to all connected clients
 */
const broadcast = (event, data) => {
    try {
        const io = getIO();
        const connectedSockets = io.sockets.sockets.size;
        console.log(`📡 [SOCKET] Broadcasting "${event}" to ${connectedSockets} connected clients`);
        console.log(`📡 [SOCKET] Event data:`, JSON.stringify(data).substring(0, 200));
        io.emit(event, data);
        logger.info(`Broadcasted ${event} to all clients (${connectedSockets} sockets)`);
        console.log(`✅ [SOCKET] Broadcast complete for "${event}"`);
    } catch (error) {
        console.error(`❌ [SOCKET] Failed to broadcast ${event}:`, error);
        logger.error(`Failed to broadcast ${event}:`, error);
    }
};

/**
 * Emit to users on a specific route
 */
const emitToRoute = (userId, event, data) => {
    try {
        const io = getIO();
        io.to(`route:${userId}`).emit(event, data);
        logger.info(`Emitted ${event} to route ${userId}`);
    } catch (error) {
        logger.error(`Failed to emit to route ${userId}:`, error);
    }
};

/**
 * Get list of online users
 */
const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};

/**
 * Check if user is online
 */
const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
};

module.exports = {
    initializeSocket,
    getIO,
    emitToUser,
    emitToBarangay,
    emitToRole,
    broadcast,
    emitToRoute,
    getOnlineUsers,
    isUserOnline
};
