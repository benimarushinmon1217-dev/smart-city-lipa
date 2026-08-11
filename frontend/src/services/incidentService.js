/**
 * Incident Service
 * Handles incident-related API calls
 */

import api, { createFormData, uploadFile } from './api';
import { API_ENDPOINTS } from '../config/api.config';

class IncidentService {
    /**
     * Get all incidents
     */
    async getAll(params = {}) {
        return api.get(API_ENDPOINTS.INCIDENTS.LIST, { params });
    }

    /**
     * Get incident feed
     */
    async getFeed(params = {}) {
        return api.get(API_ENDPOINTS.INCIDENTS.FEED, { params });
    }

    /**
     * Get incident statistics
     */
    async getStats() {
        return api.get(API_ENDPOINTS.INCIDENTS.STATS);
    }

    /**
     * Get incident by ID
     */
    async getById(id) {
        return api.get(API_ENDPOINTS.INCIDENTS.DETAIL(id));
    }

    /**
     * Create new incident
     */
    async create(data) {
        // If there are images, use FormData
        if (data.images && data.images.length > 0) {
            const formData = createFormData(data, 'images');
            return uploadFile(API_ENDPOINTS.INCIDENTS.CREATE, formData);
        }
        return api.post(API_ENDPOINTS.INCIDENTS.CREATE, data);
    }

    /**
     * Update incident
     */
    async update(id, data) {
        return api.put(API_ENDPOINTS.INCIDENTS.UPDATE(id), data);
    }

    /**
     * Verify incident (Admin only)
     */
    async verify(id) {
        return api.post(API_ENDPOINTS.INCIDENTS.VERIFY(id));
    }

    /**
     * Reject incident (Admin only)
     */
    async reject(id, reason) {
        return api.post(API_ENDPOINTS.INCIDENTS.REJECT(id), { reason });
    }

    /**
     * Delete incident
     */
    async delete(id) {
        return api.delete(API_ENDPOINTS.INCIDENTS.DELETE(id));
    }
}

const incidentService = new IncidentService();
export default incidentService;
export { incidentService };
