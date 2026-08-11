/**
 * useSocket Hook
 * Custom hook for Socket.io real-time features
 */

import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { useNotificationStore } from '../stores/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useSocket = () => {
    // Don't set up event listeners here - they should be centralized in App.jsx
    // This hook only provides utility functions for components that need them

    // Connect to socket
    const connect = useCallback(() => {
        socketService.connect();
    }, []);

    // Disconnect from socket
    const disconnect = useCallback(() => {
        socketService.disconnect();
    }, []);

    // Subscribe to barangay updates
    const subscribeToBarangay = useCallback((barangayId) => {
        socketService.subscribeToBarangay(barangayId);
    }, []);

    // Unsubscribe from barangay updates
    const unsubscribeFromBarangay = useCallback((barangayId) => {
        socketService.unsubscribeFromBarangay(barangayId);
    }, []);

    return {
        connect,
        disconnect,
        subscribeToBarangay,
        unsubscribeFromBarangay,
        emit: socketService.emit.bind(socketService),
        on: socketService.on.bind(socketService),
        off: socketService.off.bind(socketService),
    };
};
