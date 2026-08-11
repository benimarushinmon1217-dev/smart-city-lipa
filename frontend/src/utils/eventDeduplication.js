/**
 * Event Deduplication Utility
 * Prevents duplicate socket events from being processed
 */

class EventDeduplicator {
    constructor(windowMs = 1000) {
        this.windowMs = windowMs;
        this.eventCache = new Map();
    }

    /**
     * Check if an event is a duplicate
     * @param {string} eventType - Type of event
     * @param {string|number} eventId - Unique identifier for the event
     * @returns {boolean} - True if duplicate, false if new
     */
    isDuplicate(eventType, eventId) {
        const key = `${eventType}:${eventId}`;
        const now = Date.now();

        if (this.eventCache.has(key)) {
            const timestamp = this.eventCache.get(key);
            if (now - timestamp < this.windowMs) {
                return true; // Duplicate within time window
            }
        }

        // Store new event
        this.eventCache.set(key, now);

        // Clean up old entries
        this.cleanup();

        return false;
    }

    /**
     * Clean up expired entries from cache
     */
    cleanup() {
        const now = Date.now();
        const expiredKeys = [];

        for (const [key, timestamp] of this.eventCache.entries()) {
            if (now - timestamp > this.windowMs) {
                expiredKeys.push(key);
            }
        }

        expiredKeys.forEach((key) => this.eventCache.delete(key));
    }

    /**
     * Clear all cached events
     */
    clear() {
        this.eventCache.clear();
    }

    /**
     * Get cache size
     */
    size() {
        return this.eventCache.size;
    }
}

// Create singleton instance
const eventDeduplicator = new EventDeduplicator(1000); // 1 second window

export default eventDeduplicator;
