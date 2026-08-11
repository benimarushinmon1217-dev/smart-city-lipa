/**
 * useBarangays Hook
 * Custom hook for barangay data operations
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';

export const useBarangays = () => {
    const {
        data: response,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['barangays'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.BARANGAYS.LIST);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return {
        barangays: response?.data?.barangays || response?.barangays || [],
        isLoading,
        error,
        refetch,
    };
};

export const useBarangay = (id) => {
    return useQuery({
        queryKey: ['barangay', id],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.BARANGAYS.GET_BY_ID(id));
            return response.data;
        },
        enabled: !!id,
    });
};
