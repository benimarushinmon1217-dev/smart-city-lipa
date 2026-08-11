/**
 * useReports Hook
 * Custom hook for report management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import toast from 'react-hot-toast';

export const useReports = (filters = {}) => {
    const queryClient = useQueryClient();

    // Fetch reports list
    const {
        data: reports,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['reports', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.type) params.append('report_type', filters.type); // Fixed: send as report_type
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const response = await api.get(`${API_ENDPOINTS.REPORTS.LIST}?${params}`);
            return response.data;
        },
    });

    // Fetch single report
    const useReport = (id) => {
        return useQuery({
            queryKey: ['report', id],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.REPORTS.GET_BY_ID(id));
                return response.data;
            },
            enabled: !!id,
        });
    };

    // Fetch user's reports
    const useMyReports = () => {
        return useQuery({
            queryKey: ['reports', 'my'],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.REPORTS.MY_REPORTS);
                return response.data;
            },
        });
    };

    // Create report mutation
    const createMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post(API_ENDPOINTS.REPORTS.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reports']);
            toast.success('Report submitted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit report');
        },
    });

    // Update report mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.put(API_ENDPOINTS.REPORTS.UPDATE(id), data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['reports']);
            queryClient.invalidateQueries(['report', data.data.id]);
            toast.success('Report updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update report');
        },
    });

    // Delete report mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(API_ENDPOINTS.REPORTS.DELETE(id));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reports']);
            toast.success('Report deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete report');
        },
    });

    // Verify report mutation (Admin only)
    const verifyMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.patch(API_ENDPOINTS.REPORTS.VERIFY(id));
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['reports']);
            queryClient.invalidateQueries(['report', data.data.id]);
            toast.success('Report verified');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to verify report');
        },
    });

    // Reject report mutation (Admin only)
    const rejectMutation = useMutation({
        mutationFn: async ({ id, reason }) => {
            const response = await api.patch(API_ENDPOINTS.REPORTS.REJECT(id), { reason });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['reports']);
            queryClient.invalidateQueries(['report', data.data.id]);
            toast.success('Report rejected');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject report');
        },
    });

    return {
        reports: reports?.reports || [],
        pagination: reports?.pagination,
        isLoading,
        error,
        refetch,
        useReport,
        useMyReports,
        createReport: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateReport: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteReport: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        verifyReport: verifyMutation.mutate,
        isVerifying: verifyMutation.isPending,
        rejectReport: rejectMutation.mutate,
        isRejecting: rejectMutation.isPending,
    };
};
