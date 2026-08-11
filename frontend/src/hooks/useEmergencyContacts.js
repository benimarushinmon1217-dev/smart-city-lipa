/**
 * useEmergencyContacts Hook
 * React Query hook for emergency contacts data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import emergencyContactService from '../services/emergencyContactService';
import toast from 'react-hot-toast';

/**
 * Get all active emergency contacts
 */
export const useActiveContacts = () => {
    return useQuery({
        queryKey: ['emergency-contacts', 'active'],
        queryFn: emergencyContactService.getActiveContacts,
        staleTime: 10 * 60 * 1000, // 10 minutes - this data doesn't change often
    });
};

/**
 * Get emergency hotlines
 */
export const useEmergencyHotlines = () => {
    return useQuery({
        queryKey: ['emergency-contacts', 'hotlines'],
        queryFn: emergencyContactService.getEmergencyHotlines,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Get all emergency contacts with filters
 */
export const useEmergencyContacts = (filters = {}) => {
    return useQuery({
        queryKey: ['emergency-contacts', filters],
        queryFn: () => emergencyContactService.getAllContacts(filters),
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Get contacts by category
 */
export const useContactsByCategory = (category) => {
    return useQuery({
        queryKey: ['emergency-contacts', 'category', category],
        queryFn: () => emergencyContactService.getByCategory(category),
        enabled: !!category,
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Get contact by ID
 */
export const useContactById = (id) => {
    return useQuery({
        queryKey: ['emergency-contacts', id],
        queryFn: () => emergencyContactService.getContactById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Get contact statistics
 */
export const useContactStats = () => {
    return useQuery({
        queryKey: ['emergency-contacts', 'stats'],
        queryFn: emergencyContactService.getContactStats,
        staleTime: 10 * 60 * 1000,
    });
};

// Admin mutations
/**
 * Create emergency contact mutation
 */
export const useCreateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: emergencyContactService.createContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
            toast.success('Emergency contact created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create emergency contact');
        },
    });
};

/**
 * Update emergency contact mutation
 */
export const useUpdateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => emergencyContactService.updateContact(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
            toast.success('Emergency contact updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update emergency contact');
        },
    });
};

/**
 * Deactivate emergency contact mutation
 */
export const useDeactivateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: emergencyContactService.deactivateContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
            toast.success('Emergency contact deactivated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to deactivate emergency contact');
        },
    });
};

/**
 * Delete emergency contact mutation
 */
export const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: emergencyContactService.deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
            toast.success('Emergency contact deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete emergency contact');
        },
    });
};
