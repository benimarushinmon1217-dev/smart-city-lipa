/**
 * useSocketEvents Hook
 * Centralized socket event handling - USE ONLY ONCE IN APP.JSX
 * This prevents duplicate event listeners and notifications
 */

import { useEffect } from 'react';
import { socketService } from '../services/socketService';
import { useNotificationStore } from '../stores/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useSocketEvents = () => {
    const queryClient = useQueryClient();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        console.log('🔌 [SOCKET EVENTS] Setting up centralized socket event listeners');
        console.log('🔌 [SOCKET EVENTS] This should only appear ONCE per app instance');

        // Connect socket
        socketService.connect();

        // Small delay to ensure socket is connected before setting up listeners
        const setupTimer = setTimeout(() => {
            console.log('🔌 [SOCKET EVENTS] Registering event listeners...');

            // Notification events
            socketService.on('notification:new', (notification) => {
                console.log('🔔 [SOCKET EVENTS] notification:new received:', notification);
                addNotification(notification);

                // Don't show toast here - toasts are already shown by specific event handlers
                // This prevents duplicate notifications
            });

            // Incident events
            socketService.on('incident:new', (data) => {
                console.log('🔔 [SOCKET EVENTS] incident:new received:', data);
                queryClient.invalidateQueries({ queryKey: ['incidents'] });
                queryClient.invalidateQueries({ queryKey: ['admin-incidents'] });

                const incidentId = data?.incident?.id || data?.id;
                const title = data?.incident?.title || data?.title || 'New incident';

                console.log('🔔 [SOCKET EVENTS] Showing toast for incident:', incidentId, title);
                toast.success(`New incident reported: ${title}`, {
                    id: `incident-new-${incidentId}`,
                    duration: 4000,
                });
            });

            socketService.on('incident:updated', (data) => {
                console.log('🔔 [SOCKET EVENTS] incident:updated received');
                queryClient.invalidateQueries({ queryKey: ['incidents'] });

                const incidentId = data?.incident?.id || data?.id;
                if (incidentId) {
                    queryClient.invalidateQueries({ queryKey: ['incident', incidentId] });
                }
            });

            socketService.on('incident:deleted', (data) => {
                console.log('🔔 [SOCKET EVENTS] incident:deleted received');
                queryClient.invalidateQueries({ queryKey: ['incidents'] });
            });

            // Report events
            socketService.on('report:new', (data) => {
                console.log('🔔 [SOCKET EVENTS] report:new received:', data);
                queryClient.invalidateQueries({ queryKey: ['reports'] });
                queryClient.invalidateQueries({ queryKey: ['admin-reports'] });

                const reportId = data?.report?.id || data?.id;
                const title = data?.report?.title || data?.title || 'New report';

                console.log('🔔 [SOCKET EVENTS] Showing toast for report:', reportId, title);
                toast('New report submitted: ' + title, {
                    id: `report-new-${reportId}`,
                    icon: 'ℹ️',
                    duration: 4000,
                });
            });

            socketService.on('report:verified', (data) => {
                console.log('🔔 [SOCKET EVENTS] report:verified received');
                queryClient.invalidateQueries({ queryKey: ['reports'] });

                const reportId = data?.report?.id || data?.id;
                if (reportId) {
                    queryClient.invalidateQueries({ queryKey: ['report', reportId] });
                }

                toast.success('Report verified', {
                    id: `report-verified-${reportId}`,
                    duration: 4000,
                });
            });

            socketService.on('report:rejected', (data) => {
                console.log('🔔 [SOCKET EVENTS] report:rejected received');
                queryClient.invalidateQueries({ queryKey: ['reports'] });

                const reportId = data?.report?.id || data?.id;
                if (reportId) {
                    queryClient.invalidateQueries({ queryKey: ['report', reportId] });
                }

                toast.warning('Report rejected', {
                    id: `report-rejected-${reportId}`,
                    duration: 4000,
                });
            });

            // Announcement events
            socketService.on('announcement:new', (announcement) => {
                const announcementId = announcement?.id || Date.now();
                toast(announcement.title, {
                    id: `announcement-${announcementId}`,
                    icon: '📢',
                    duration: 7000,
                });
            });

            // Emergency alert events
            socketService.on('alert:emergency', (alert) => {
                const alertId = alert?.id || Date.now();
                toast.error(alert.message, {
                    id: `alert-${alertId}`,
                    icon: '🚨',
                    duration: 10000,
                });
            });

            // Hazard events
            socketService.on('hazard:flood', (data) => {
                const hazardId = `flood-${data.barangayId || data.barangay}-${Date.now()}`;
                toast.warning(`Flood alert: ${data.barangay}`, {
                    id: hazardId,
                    icon: '🌊',
                    duration: 8000,
                });
            });

            socketService.on('hazard:wind', (data) => {
                const hazardId = `wind-${Date.now()}`;
                toast.warning(`Wind alert: ${data.message}`, {
                    id: hazardId,
                    icon: '💨',
                    duration: 8000,
                });
            });

            socketService.on('hazard:ashfall', (data) => {
                const hazardId = `ashfall-${Date.now()}`;
                toast.warning(`Ashfall alert: ${data.message}`, {
                    id: hazardId,
                    icon: '🌋',
                    duration: 8000,
                });
            });

            // Route events
            socketService.on('route:unsafe', (data) => {
                const routeId = `route-unsafe-${Date.now()}`;
                toast.error(`Route unsafe: ${data.message}`, {
                    id: routeId,
                    icon: '⚠️',
                    duration: 8000,
                });
            });

            // Traffic events
            socketService.on('traffic:updated', (data) => {
                console.log('🔔 [SOCKET EVENTS] traffic:updated received');
                queryClient.invalidateQueries({ queryKey: ['traffic'] });
            });

            // Connection events
            socketService.on('connect', () => {
                console.log('✅ [SOCKET EVENTS] Socket connected');
            });

            socketService.on('disconnect', () => {
                console.log('❌ [SOCKET EVENTS] Socket disconnected');
            });

            socketService.on('error', (error) => {
                console.error('❌ [SOCKET EVENTS] Socket error:', error);
                toast.error('Connection error. Retrying...', {
                    id: 'socket-error',
                    duration: 3000,
                });
            });

            console.log('✅ [SOCKET EVENTS] All event listeners registered');
        }, 500); // 500ms delay to ensure socket is connected

        // Cleanup - remove all listeners when App unmounts
        return () => {
            clearTimeout(setupTimer);
            console.log('🔌 [SOCKET EVENTS] Cleaning up socket event listeners');
            socketService.removeAllListeners();
        };
    }, [addNotification, queryClient]);
};
