/**
 * Emergency Contact Service
 * API calls for emergency hotlines and contact information
 */

import api from './api';

const emergencyContactService = {
    /**
     * Get all active emergency contacts grouped by category
     */
    getActiveContacts: async () => {
        const response = await api.get('/emergency-contacts/active');
        return response.data;
    },

    /**
     * Get emergency hotlines (high priority contacts)
     */
    getEmergencyHotlines: async () => {
        const response = await api.get('/emergency-contacts/hotlines');
        return response.data;
    },

    /**
     * Get all emergency contacts with filters
     */
    getAllContacts: async (filters = {}) => {
        const response = await api.get('/emergency-contacts', { params: filters });
        return response.data;
    },

    /**
     * Get contacts by category
     */
    getByCategory: async (category) => {
        const response = await api.get(`/emergency-contacts/category/${category}`);
        return response.data;
    },

    /**
     * Get contact by ID
     */
    getContactById: async (id) => {
        const response = await api.get(`/emergency-contacts/${id}`);
        return response.data;
    },

    /**
     * Get contact statistics
     */
    getContactStats: async () => {
        const response = await api.get('/emergency-contacts/stats');
        return response.data;
    },

    // Admin functions
    /**
     * Create new emergency contact (Admin only)
     */
    createContact: async (contactData) => {
        const response = await api.post('/emergency-contacts', contactData);
        return response.data;
    },

    /**
     * Update emergency contact (Admin only)
     */
    updateContact: async (id, contactData) => {
        const response = await api.put(`/emergency-contacts/${id}`, contactData);
        return response.data;
    },

    /**
     * Deactivate emergency contact (Admin only)
     */
    deactivateContact: async (id) => {
        const response = await api.put(`/emergency-contacts/${id}/deactivate`);
        return response.data;
    },

    /**
     * Delete emergency contact (Admin only)
     */
    deleteContact: async (id) => {
        const response = await api.delete(`/emergency-contacts/${id}`);
        return response.data;
    }
};

export default emergencyContactService;
