/**
 * Socket Service
 * Socket.io client for real-time communication
 */

import { io } from 'socket.io-client';
import { SOCKET_CONFIG, SOCKET_EVENTS } from '../config/socket.config';
import { STORAGE_KEYS } from '../utils/constants';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.listeners = new Map();
    }

    /**
     * Connect to socket server
     */
    connect() {
        if (this.socket?.connected) {
            return;
        }

        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        // Don't connect if no token (user not authenticated)
        if (!token) {
            console.log('Socket connection skipped - no auth token');
            return;
        }

        this.socket = io(SOCKET_CONFIG.URL, {
            ...SOCKET_CONFIG.OPTIONS,
            auth: { token },
            // Add transport options to reduce initial connection errors
            transports: ['websocket', 'polling'],
            upgrade: true,
        });

        this.setupEventListeners();

        // Small delay to ensure backend is ready
        setTimeout(() => {
            this.socket.connect();
        }, 100);
    }

    /**
     * Disconnect from socket server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.listeners.clear();
        }
    }

    /**
     * Setup default event listeners
     */
    setupEventListeners() {
        if (!this.socket) return;

        // Connection events
        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('Socket connected:', this.socket.id);
            this.connected = true;
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log('Socket disconnected:', reason);
            this.connected = false;
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            // Suppress initial connection errors - they're expected during startup
            if (this.socket.io.engine.transport.name !== 'websocket') {
                console.debug('Socket connection attempt failed, retrying...', error.message);
            }
        });

        this.socket.on(SOCKET_EVENTS.RECONNECT, (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
        });

        this.socket.on(SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
            // Only log if multiple attempts have failed
            console.debug('Socket reconnection attempt...', error.message);
        });

        this.socket.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
            console.warn('Socket reconnection failed after all attempts');
        });
    }

    /**
     * Subscribe to event
     */
    on(event, callback) {
        if (!this.socket) {
            console.warn('Socket not initialized');
            return;
        }

        const wrappedCallback = (data) => {
            callback(data);
        };

        // Keep a reference to the original callback so off()
        // can correctly find this wrapped listener later.
        wrappedCallback._originalCallback = callback;

        this.socket.on(event, wrappedCallback);

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(wrappedCallback);
    }

    off(event, callback) {
        if (!this.socket) {
            return;
        }

        if (!this.listeners.has(event)) {
            return;
        }

        const registeredListeners = this.listeners.get(event);

        // Remove ALL listeners for this event
        if (!callback) {
            registeredListeners.forEach((wrappedCallback) => {
                this.socket.off(event, wrappedCallback);
            });

            this.listeners.delete(event);
            return;
        }

        // Find the wrapper corresponding to the original callback
        const index = registeredListeners.findIndex(
            (wrappedCallback) =>
                wrappedCallback._originalCallback === callback
        );

        if (index !== -1) {
            const wrappedCallback = registeredListeners[index];

            this.socket.off(event, wrappedCallback);
            registeredListeners.splice(index, 1);

            if (registeredListeners.length === 0) {
                this.listeners.delete(event);
            }
        }
    }
    /**
     * Remove all listeners for a specific event or all events
     */
    removeAllListeners(event) {
        if (!this.socket) {
            console.warn('Socket not initialized');
            return;
        }

        if (event) {
            const registeredListeners = this.listeners.get(event);

            if (registeredListeners) {
                registeredListeners.forEach((wrappedCallback) => {
                    this.socket.off(event, wrappedCallback);
                });
            }

            this.listeners.delete(event);
        } else {
            // Remove listeners tracked by this service
            for (const [eventName, registeredListeners] of this.listeners.entries()) {
                registeredListeners.forEach((wrappedCallback) => {
                    this.socket.off(eventName, wrappedCallback);
                });
            }

            this.listeners.clear();
        }
    }
    /**
     * Emit event
     */
    emit(event, data) {
        if (!this.socket) {
            console.warn('Socket not initialized');
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * Subscribe to barangay updates
     */
    subscribeToBarangay(barangayId) {
        this.emit(SOCKET_EVENTS.SUBSCRIBE_BARANGAY, barangayId);
    }

    /**
     * Unsubscribe from barangay updates
     */
    unsubscribeFromBarangay(barangayId) {
        this.emit(SOCKET_EVENTS.UNSUBSCRIBE_BARANGAY, barangayId);
    }

    /**
     * Start route tracking
     */
    startRouteTracking(routeData) {
        this.emit(SOCKET_EVENTS.ROUTE_START, routeData);
    }

    /**
     * Stop route tracking
     */
    stopRouteTracking() {
        this.emit(SOCKET_EVENTS.ROUTE_STOP);
    }

    /**
     * Send ping
     */
    ping() {
        this.emit(SOCKET_EVENTS.PING);
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.connected && this.socket?.connected;
    }

    /**
     * Get socket ID
     */
    getSocketId() {
        return this.socket?.id;
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
export { socketService };

