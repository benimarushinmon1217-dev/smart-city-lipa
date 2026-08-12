/**
 * useNotifications Hook
 * Custom hook for notification management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const { addNotification, markAsRead: markAsReadStore } = useNotificationStore();
    const { user, isAuthenticated } = useAuthStore();

    console.log('🔔 [useNotifications] Hook initialized');
    console.log('🔔 [useNotifications] User:', user?.email, 'Role:', user?.role);
    console.log('🔔 [useNotifications] Is authenticated:', isAuthenticated);

    // Fetch notifications
    const {
        data: notifications,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            console.log('🔔 [useNotifications] Fetching notifications...');
            try {
                const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
                console.log('🔔 [useNotifications] Raw response:', response);
                console.log('🔔 [useNotifications] Response data:', response.data);
                return response.data;
            } catch (err) {
                console.error('🔔 [useNotifications] Fetch error:', err);
                console.error('🔔 [useNotifications] Error response:', err.response);
                throw err;
            }
        },
        enabled: isAuthenticated, // Only run query if authenticated
        refetchInterval: false,
        retry: false, // Don't retry on 401 errors
    });

    // Fetch unread count
    const { data: unreadCount } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            console.log('🔔 [useNotifications] Fetching unread count...');
            try {
                const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
                console.log('🔔 [useNotifications] Unread count response:', response.data);
                return response.data;
            } catch (err) {
                console.error('🔔 [useNotifications] Unread count error:', err);
                throw err;
            }
        },
        enabled: isAuthenticated, // Only run query if authenticated
        refetchInterval: false,
        retry: false, // Don't retry on 401 errors
    });

    console.log('🔔 [useNotifications] Query enabled:', isAuthenticated);
    console.log('🔔 [useNotifications] Notifications data:', notifications);
    console.log('🔔 [useNotifications] Unread count data:', unreadCount);
    console.log('🔔 [useNotifications] Is loading:', isLoading);
    console.log('🔔 [useNotifications] Error:', error);

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id) => {
            console.log('🔔 [useNotifications] Marking notification as read:', id);
            try {
                const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
                console.log('🔔 [useNotifications] Mark as read response:', response.data);
                return response.data;
            } catch (err) {
                console.error('🔔 [useNotifications] Mark as read error:', err);
                console.error('🔔 [useNotifications] Error response:', err.response);
                throw err;
            }
        },
        onSuccess: (data, id) => {
            console.log('🔔 [useNotifications] Successfully marked as read:', id);
            markAsReadStore(id);
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['notifications', 'unread-count']);
        },
        onError: (error) => {
            console.error('🔔 [useNotifications] Mark as read mutation error:', error);
            toast.error(error.response?.data?.message || 'Failed to mark as read');
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            console.log('🔔 [useNotifications] Marking all as read...');
            const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
            console.log('🔔 [useNotifications] Mark all response:', response.data);
            return response.data;
        },
        onSuccess: () => {
            console.log('🔔 [useNotifications] Successfully marked all as read');
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['notifications', 'unread-count']);
            toast.success('All notifications marked as read');
        },
        onError: (error) => {
            console.error('🔔 [useNotifications] Mark all error:', error);
            toast.error(error.response?.data?.message || 'Failed to mark all as read');
        },
    });

    // Delete notification mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['notifications', 'unread-count']);
            toast.success('Notification deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete notification');
        },
    });

    // Clear all notifications mutation
    const clearAllMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['notifications', 'unread-count']);
            toast.success('All notifications cleared');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to clear notifications');
        },
    });

    return {
        notifications: Array.isArray(notifications) ? notifications : (notifications?.data || []),
        unreadCount: unreadCount?.count !== undefined ? unreadCount.count : (unreadCount?.data?.count || 0),
        isLoading,
        error,
        refetch,
        markAsRead: markAsReadMutation.mutate,
        isMarkingAsRead: markAsReadMutation.isPending,
        markAllAsRead: markAllAsReadMutation.mutate,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        deleteNotification: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        clearAll: clearAllMutation.mutate,
        isClearing: clearAllMutation.isPending,
    };
};
