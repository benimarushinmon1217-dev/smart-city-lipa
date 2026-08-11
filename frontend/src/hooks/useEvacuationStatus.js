/**
 * useEvacuationStatus Hook
 * Manage user evacuation status and tracking
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import { useSocket } from './useSocket';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const EVACUATION_STATUS = {
    SAFE: 'safe',
    EVACUATING: 'evacuating',
    STRANDED: 'stranded',
    REQUESTING_ASSISTANCE: 'requesting_assistance',
    AT_SHELTER: 'at_shelter',
};

export const useEvacuationStatus = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { on, off, emit } = useSocket();
    const [currentStatus, setCurrentStatus] = useState(EVACUATION_STATUS.SAFE);

    // Fetch user's evacuation status
    const { data: statusData, refetch } = useQuery({
        queryKey: ['evacuation-status', user?.id],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.USER.EVACUATION_STATUS);
            return response.data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (statusData?.data?.status) {
            setCurrentStatus(statusData.data.status);
        }
    }, [statusData]);

    // Update evacuation status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ status, location, notes }) => {
            const response = await api.post(API_ENDPOINTS.USER.UPDATE_EVACUATION_STATUS, {
                status,
                location,
                notes,
                timestamp: new Date().toISOString(),
            });
            return response.data;
        },
        onSuccess: (data) => {
            setCurrentStatus(data.data.status);
            queryClient.invalidateQueries(['evacuation-status']);

            // Emit real-time update
            emit('user:status_updated', {
                userId: user?.id,
                status: data.data.status,
                location: data.data.location,
            });

            // Show appropriate toast
            const messages = {
                [EVACUATION_STATUS.SAFE]: 'Status updated: Safe',
                [EVACUATION_STATUS.EVACUATING]: 'Status updated: Evacuating',
                [EVACUATION_STATUS.STRANDED]: 'Emergency services notified',
                [EVACUATION_STATUS.REQUESTING_ASSISTANCE]: 'Help request sent',
                [EVACUATION_STATUS.AT_SHELTER]: 'Checked in at shelter',
            };

            toast.success(messages[data.data.status] || 'Status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    // Request assistance mutation
    const requestAssistanceMutation = useMutation({
        mutationFn: async ({ location, urgency, description }) => {
            const response = await api.post(API_ENDPOINTS.USER.REQUEST_ASSISTANCE, {
                location,
                urgency,
                description,
                timestamp: new Date().toISOString(),
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Assistance request sent to emergency services', {
                icon: '🚨',
                duration: 5000,
            });
            updateStatusMutation.mutate({
                status: EVACUATION_STATUS.REQUESTING_ASSISTANCE
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to send request');
        },
    });

    // Check in at shelter mutation
    const checkInShelterMutation = useMutation({
        mutationFn: async ({ shelterId, numberOfPeople }) => {
            const response = await api.post(API_ENDPOINTS.USER.SHELTER_CHECKIN, {
                shelterId,
                numberOfPeople,
                timestamp: new Date().toISOString(),
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Checked in at shelter', {
                icon: '🏠',
                duration: 4000,
            });
            updateStatusMutation.mutate({
                status: EVACUATION_STATUS.AT_SHELTER
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to check in');
        },
    });

    // Real-time status updates
    useEffect(() => {
        // Admin updated user status
        on('evacuation:status_updated', (data) => {
            if (data.userId === user?.id) {
                setCurrentStatus(data.status);
                refetch();
                toast.info(`Status updated by admin: ${data.status}`);
            }
        });

        // Assistance response
        on('assistance:response', (data) => {
            toast.success(data.message, {
                icon: '🚑',
                duration: 8000,
            });
        });

        // Evacuation order
        on('evacuation:order', (data) => {
            toast.error(data.message, {
                icon: '🚨',
                duration: 10000,
            });
        });

        return () => {
            off('evacuation:status_updated');
            off('assistance:response');
            off('evacuation:order');
        };
    }, [on, off, user, refetch]);

    return {
        currentStatus,
        statusData: statusData?.data,
        updateStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending,
        requestAssistance: requestAssistanceMutation.mutate,
        isRequestingAssistance: requestAssistanceMutation.isPending,
        checkInShelter: checkInShelterMutation.mutate,
        isCheckingIn: checkInShelterMutation.isPending,
        refetch,
    };
};

// Get status color
export const getEvacuationStatusColor = (status) => {
    switch (status) {
        case EVACUATION_STATUS.SAFE:
            return 'bg-success-100 text-success-700 border-success-200';
        case EVACUATION_STATUS.EVACUATING:
            return 'bg-warning-100 text-warning-700 border-warning-200';
        case EVACUATION_STATUS.STRANDED:
            return 'bg-danger-100 text-danger-700 border-danger-200';
        case EVACUATION_STATUS.REQUESTING_ASSISTANCE:
            return 'bg-danger-100 text-danger-700 border-danger-200';
        case EVACUATION_STATUS.AT_SHELTER:
            return 'bg-blue-100 text-blue-700 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

// Get status icon
export const getEvacuationStatusIcon = (status) => {
    switch (status) {
        case EVACUATION_STATUS.SAFE:
            return '✅';
        case EVACUATION_STATUS.EVACUATING:
            return '🏃';
        case EVACUATION_STATUS.STRANDED:
            return '🆘';
        case EVACUATION_STATUS.REQUESTING_ASSISTANCE:
            return '🚨';
        case EVACUATION_STATUS.AT_SHELTER:
            return '🏠';
        default:
            return '📍';
    }
};

// Get status label
export const getEvacuationStatusLabel = (status) => {
    switch (status) {
        case EVACUATION_STATUS.SAFE:
            return 'Safe';
        case EVACUATION_STATUS.EVACUATING:
            return 'Evacuating';
        case EVACUATION_STATUS.STRANDED:
            return 'Stranded';
        case EVACUATION_STATUS.REQUESTING_ASSISTANCE:
            return 'Requesting Assistance';
        case EVACUATION_STATUS.AT_SHELTER:
            return 'At Shelter';
        default:
            return 'Unknown';
    }
};
