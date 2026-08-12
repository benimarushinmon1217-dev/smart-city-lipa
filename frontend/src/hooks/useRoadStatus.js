/**
 * useRoadStatus Hook
 * Manage dynamic road conditions and status updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import { useSocket } from './useSocket';
import toast from 'react-hot-toast';

export const useRoadStatus = () => {
    const queryClient = useQueryClient();
    const { on, off } = useSocket();

    // Fetch all road statuses
    const {
        data: roadStatusData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['road-status'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.TRAFFIC.ROAD_STATUS);
            return response.data;
        },
        refetchInterval: 300000, // Refetch every 5 minutes as a fallback
    });

    // Update road status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ roadId, status, reason, severity }) => {
            const response = await api.patch(API_ENDPOINTS.TRAFFIC.UPDATE_ROAD_STATUS(roadId), {
                status,
                reason,
                severity,
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['road-status']);
            queryClient.invalidateQueries(['routes']);
            toast.success('Road status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update road status');
        },
    });

    // Report road issue mutation
    const reportIssueMutation = useMutation({
        mutationFn: async (issueData) => {
            const response = await api.post(API_ENDPOINTS.TRAFFIC.REPORT_ROAD_ISSUE, issueData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['road-status']);
            toast.success('Road issue reported');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to report issue');
        },
    });

    // Real-time road status updates
    useEffect(() => {
        // Road status changed
        on('road:status_changed', (data) => {
            queryClient.invalidateQueries(['road-status']);
            queryClient.invalidateQueries(['routes']);

            // Show notification based on severity
            const message = `Road ${data.status}: ${data.roadName || 'Unknown road'}`;

            if (data.severity === 'critical' || data.status === 'blocked') {
                toast.error(message, { icon: '🚧', duration: 5000 });
            } else if (data.severity === 'high' || data.status === 'flooded') {
                toast.warning(message, { icon: '⚠️', duration: 4000 });
            } else {
                toast(message, { icon: 'ℹ️', duration: 3000 });
            }
        });

        // Route recalculation triggered
        on('route:recalculating', (data) => {
            toast.loading('Recalculating safer route...', {
                id: 'route-recalc',
                duration: 2000
            });
        });

        // New route available
        on('route:updated', (data) => {
            toast.success('Route updated to avoid hazards', {
                id: 'route-recalc',
                icon: '🗺️',
                duration: 4000
            });
            queryClient.invalidateQueries(['routes']);
        });

        // Road cleared
        on('road:cleared', (data) => {
            queryClient.invalidateQueries(['road-status']);
            toast.success(`Road cleared: ${data.roadName}`, {
                icon: '✅',
                duration: 3000
            });
        });

        return () => {
            off('road:status_changed');
            off('route:recalculating');
            off('route:updated');
            off('road:cleared');
        };
    }, [on, off, queryClient]);

    return {
        roadStatuses: roadStatusData?.data || [],
        isLoading,
        error,
        refetch,
        updateRoadStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending,
        reportRoadIssue: reportIssueMutation.mutate,
        isReportingIssue: reportIssueMutation.isPending,
    };
};

// Road status constants
export const ROAD_STATUS = {
    CLEAR: 'clear',
    FLOODED: 'flooded',
    BLOCKED: 'blocked',
    INACCESSIBLE: 'inaccessible',
    CONGESTED: 'congested',
    HAZARDOUS: 'hazardous',
    UNDER_REPAIR: 'under_repair',
};

export const ROAD_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};

export const getRoadStatusColor = (status) => {
    switch (status) {
        case ROAD_STATUS.CLEAR:
            return 'text-success-600 bg-success-100';
        case ROAD_STATUS.FLOODED:
            return 'text-blue-600 bg-blue-100';
        case ROAD_STATUS.BLOCKED:
            return 'text-danger-600 bg-danger-100';
        case ROAD_STATUS.INACCESSIBLE:
            return 'text-danger-600 bg-danger-100';
        case ROAD_STATUS.CONGESTED:
            return 'text-warning-600 bg-warning-100';
        case ROAD_STATUS.HAZARDOUS:
            return 'text-danger-600 bg-danger-100';
        case ROAD_STATUS.UNDER_REPAIR:
            return 'text-gray-600 bg-gray-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

export const getRoadStatusIcon = (status) => {
    switch (status) {
        case ROAD_STATUS.CLEAR:
            return '✅';
        case ROAD_STATUS.FLOODED:
            return '🌊';
        case ROAD_STATUS.BLOCKED:
            return '🚧';
        case ROAD_STATUS.INACCESSIBLE:
            return '⛔';
        case ROAD_STATUS.CONGESTED:
            return '🚗';
        case ROAD_STATUS.HAZARDOUS:
            return '⚠️';
        case ROAD_STATUS.UNDER_REPAIR:
            return '🔧';
        default:
            return '📍';
    }
};
