/**
 * useIncidents Hook
 * Custom hook for incident management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import toast from 'react-hot-toast';

export const useIncidents = (filters = {}) => {
    const queryClient = useQueryClient();

    // Fetch incidents list
    const {
        data: incidents,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['incidents', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.severity) params.append('severity', filters.severity);
            if (filters.type) params.append('incident_type', filters.type); // Fixed: send as incident_type
            if (filters.barangayId) params.append('barangayId', filters.barangayId);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const response = await api.get(`${API_ENDPOINTS.INCIDENTS.LIST}?${params}`);
            return response.data;
        },
    });

    // Fetch single incident
    const useIncident = (id) => {
        return useQuery({
            queryKey: ['incident', id],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.INCIDENTS.GET_BY_ID(id));
                return response.data;
            },
            enabled: !!id,
        });
    };

    // Create incident mutation
    const createMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post(API_ENDPOINTS.INCIDENTS.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['incidents']);
            toast.success('Incident reported successfully');
        },
        onError: (error) => {
            console.error('Create incident error:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            // Show detailed validation errors if available
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to create incident';

            // If there are validation errors, show them
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                console.error('Validation errors:', validationErrors);

                // Show first validation error
                const firstError = validationErrors[0];
                if (firstError) {
                    toast.error(`${firstError.param}: ${firstError.msg}`);
                    return;
                }
            }

            toast.error(errorMessage);
        },
    });

    // Update incident mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.put(API_ENDPOINTS.INCIDENTS.UPDATE(id), data);
            return { response: response.data, id };
        },
        onSuccess: ({ response, id }) => {
            queryClient.invalidateQueries(['incidents']);
            queryClient.invalidateQueries(['incident', id]);
            toast.success('Incident updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update incident');
        },
    });

    // Delete incident mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(API_ENDPOINTS.INCIDENTS.DELETE(id));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['incidents']);
            toast.success('Incident deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete incident');
        },
    });

    // Update incident status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const response = await api.patch(API_ENDPOINTS.INCIDENTS.UPDATE_STATUS(id), { status });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['incidents']);
            queryClient.invalidateQueries(['incident', data.data.id]);
            toast.success('Incident status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    // Fetch nearby incidents
    const useNearbyIncidents = (lat, lng, radius = 5) => {
        return useQuery({
            queryKey: ['incidents', 'nearby', lat, lng, radius],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.INCIDENTS.NEARBY, {
                    params: { lat, lng, radius },
                });
                return response.data;
            },
            enabled: !!(lat && lng),
        });
    };

    return {
        incidents: incidents?.incidents || [],
        pagination: incidents?.pagination,
        isLoading,
        error,
        refetch,
        useIncident,
        useNearbyIncidents,
        createIncident: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateIncident: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteIncident: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        updateStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending,
    };
};
