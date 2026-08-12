/**
 * useAdmin Hook
 * Custom hook for admin operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import toast from 'react-hot-toast';

export const useAdmin = () => {
    const queryClient = useQueryClient();

    // Fetch dashboard statistics
    const useDashboardStats = () => {
        return useQuery({
            queryKey: ['admin', 'stats'],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.ADMIN.STATS);
                return response.data;
            },
            refetchInterval: 300000, // Refetch every 5 minutes as a fallback: 60000, // Refetch every minute
        });
    };

    // Fetch all users
    const useUsers = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'users', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.role && filters.role !== '') params.append('role', filters.role);
                if (filters.status && filters.status !== '') params.append('is_active', filters.status);
                if (filters.search && filters.search !== '') params.append('search', filters.search);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);

                console.log('🔍 [useAdmin] Fetching users with params:', params.toString());
                const response = await api.get(`${API_ENDPOINTS.ADMIN.USERS}?${params}`);
                console.log('📦 [useAdmin] Users response:', response.data);
                return response.data;
            },
        });
    };

    // Fetch single user
    const useUser = (id) => {
        return useQuery({
            queryKey: ['admin', 'user', id],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
                return response.data;
            },
            enabled: !!id,
        });
    };

    // Update user role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const response = await api.patch(API_ENDPOINTS.ADMIN.UPDATE_ROLE(userId), { role });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            toast.success('User role updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
        },
    });

    // Deactivate user mutation
    const deactivateUserMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await api.put(API_ENDPOINTS.ADMIN.DEACTIVATE_USER(userId));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            toast.success('User deactivated successfully');
        },
        onError: (error) => {
            console.error('Deactivate user error:', error);
            toast.error(error.response?.data?.message || 'Failed to deactivate user');
        },
    });

    // Activate user mutation
    const activateUserMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await api.put(API_ENDPOINTS.ADMIN.ACTIVATE_USER(userId));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            toast.success('User activated successfully');
        },
        onError: (error) => {
            console.error('Activate user error:', error);
            toast.error(error.response?.data?.message || 'Failed to activate user');
        },
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await api.delete(API_ENDPOINTS.ADMIN.DELETE_USER(userId));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'users']);
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        },
    });

    // Fetch all incidents (admin view)
    const useAllIncidents = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'incidents', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.status) params.append('status', filters.status);
                if (filters.severity) params.append('severity', filters.severity);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);

                const response = await api.get(`${API_ENDPOINTS.ADMIN.INCIDENTS}?${params}`);
                return response.data;
            },
        });
    };

    // Fetch all reports (admin view)
    const useAllReports = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'reports', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.status) params.append('status', filters.status);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);

                const response = await api.get(`${API_ENDPOINTS.ADMIN.REPORTS}?${params}`);
                return response.data;
            },
        });
    };

    // Create announcement mutation
    const createAnnouncementMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post(API_ENDPOINTS.ADMIN.CREATE_ANNOUNCEMENT, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Announcement created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create announcement');
        },
    });

    // Send emergency alert mutation - Use announcements endpoint
    const sendEmergencyAlertMutation = useMutation({
        mutationFn: async (data) => {
            // Map target to correct target_audience value
            let targetAudience = 'all';
            if (data.target === 'barangay') {
                targetAudience = 'specific_barangay';
            }

            // Use emergency announcements endpoint for proper alert handling
            const announcementData = {
                title: data.title,
                content: data.message,
                type: data.type || 'emergency',
                priority: data.priority === 'critical' ? 'urgent' : data.priority, // Map critical to urgent
                target_audience: targetAudience,
                target_barangays: data.target === 'barangay' && data.barangayId
                    ? JSON.stringify([parseInt(data.barangayId)])
                    : null,
            };

            console.log('📤 Sending emergency alert:', announcementData);

            // Use the emergency announcement endpoint for high-priority alerts
            const endpoint = data.priority === 'critical' || data.type === 'emergency' || data.type === 'evacuation'
                ? API_ENDPOINTS.ADMIN.EMERGENCY_ANNOUNCEMENT
                : '/announcements';

            const response = await api.post(endpoint, announcementData);

            // Return both response and original data for use in onSuccess
            return { response: response.data, originalData: data, announcementData };
        },
        onSuccess: (result) => {
            const { originalData, announcementData } = result;

            toast.success('Emergency alert sent successfully');

            // Manually trigger emergency modal for urgent/emergency alerts
            const shouldShowModal =
                originalData.priority === 'critical' ||
                originalData.priority === 'urgent' ||
                originalData.type === 'emergency' ||
                originalData.type === 'evacuation';

            if (shouldShowModal) {
                console.log('🚨 [useAdmin] Manually triggering emergency modal via custom event');
                window.dispatchEvent(new CustomEvent('emergency-alert', {
                    detail: {
                        announcement: announcementData,
                        timestamp: new Date().toISOString()
                    }
                }));
            }
        },
        onError: (error) => {
            console.error('❌ Emergency alert error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to send alert');
        },
    });

    // Fetch activity logs
    const useActivityLogs = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'logs', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.userId) params.append('userId', filters.userId);
                if (filters.action) params.append('action', filters.action);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);

                const response = await api.get(`${API_ENDPOINTS.ADMIN.ACTIVITY_LOGS}?${params}`);
                return response.data;
            },
        });
    };

    return {
        useDashboardStats,
        useUsers,
        useUser,
        useAllIncidents,
        useAllReports,
        useActivityLogs,
        updateRole: updateRoleMutation.mutate,
        isUpdatingRole: updateRoleMutation.isPending,
        deactivateUser: deactivateUserMutation.mutate,
        isDeactivating: deactivateUserMutation.isPending,
        activateUser: activateUserMutation.mutate,
        isActivating: activateUserMutation.isPending,
        deleteUser: deleteUserMutation.mutate,
        isDeletingUser: deleteUserMutation.isPending,
        createAnnouncement: createAnnouncementMutation.mutate,
        isCreatingAnnouncement: createAnnouncementMutation.isPending,
        sendEmergencyAlert: sendEmergencyAlertMutation.mutate,
        isSendingAlert: sendEmergencyAlertMutation.isPending,
    };
};
