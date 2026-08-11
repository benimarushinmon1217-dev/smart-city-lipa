/**
 * API Service
 * Axios instance with interceptors for authentication and error handling
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        // Return data directly
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (refreshToken) {
                    // Try to refresh token
                    const response = await axios.post(
                        `${API_CONFIG.BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    const { accessToken } = response.data.data;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

// Helper function for file uploads
export const createFormData = (data, fileField = 'images') => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        if (key === fileField && Array.isArray(data[key])) {
            // Handle multiple files
            data[key].forEach((file) => {
                formData.append(fileField, file);
            });
        } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return formData;
};

// Helper function for multipart/form-data requests
export const uploadFile = (url, formData) => {
    return api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default api;
export { api };
