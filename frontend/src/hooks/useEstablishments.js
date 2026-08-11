/**
 * useEstablishments Hook
 * Custom hook for establishment/facility management
 */

import { useQuery } from '@tantml:query/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';

export const useEstablishments = (filters = {}) => {
    // Fetch all establishments
    const {
        data: establishments,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['establishments', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.barangayId) params.append('barangayId', filters.barangayId);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`${API_ENDPOINTS.ESTABLISHMENTS.LIST}?${params}`);
            return response.data;
        },
    });

    // Fetch evacuation centers
    const useEvacuationCenters = (barangayId = null) => {
        return useQuery({
            queryKey: ['establishments', 'evacuation', barangayId],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (barangayId) params.append('barangay_id', barangayId);

                const response = await api.get(`${API_ENDPOINTS.ESTABLISHMENTS.EVACUATION_CENTERS}?${params}`);
                return response.data;
            },
        });
    };

    // Fetch hospitals
    const useHospitals = () => {
        return useQuery({
            queryKey: ['establishments', 'hospitals'],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.HOSPITALS);
                return response.data;
            },
        });
    };

    // Find nearest establishment by type
    const useFindNearest = (type, latitude, longitude) => {
        return useQuery({
            queryKey: ['establishments', 'nearest', type, latitude, longitude],
            queryFn: async () => {
                const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.NEAREST(type), {
                    params: { latitude, longitude },
                });
                return response.data;
            },
            enabled: !!(type && latitude && longitude),
        });
    };

    return {
        establishments: establishments?.establishments || [],
        pagination: establishments?.pagination,
        isLoading,
        error,
        refetch,
        useEvacuationCenters,
        useHospitals,
        useFindNearest,
    };
};
