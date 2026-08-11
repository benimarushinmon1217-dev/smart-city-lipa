/**
 * Authentication Service
 * API calls for authentication and user management
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api.config';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
    /**
     * Register new user
     */
    async register(userData) {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        console.log('Register response:', response);

        // Handle both response formats: direct data or wrapped in data.data
        const responseData = response.data.data || response.data;
        console.log('Response data:', responseData);
        const { user, token, refreshToken } = responseData;

        // Store tokens and user data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        return { user, token, refreshToken };
    }

    /**
     * Login user
     */
    async login(credentials) {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        console.log('Login response:', response);

        // Handle both response formats: direct data or wrapped in data.data
        const responseData = response.data.data || response.data;
        console.log('Response data:', responseData);
        const { user, token, refreshToken } = responseData;

        // Store tokens and user data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        return { user, token, refreshToken };
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        const user = response.data;

        // Update stored user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
        const user = response.data;

        // Update stored user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        return user;
    }

    /**
     * Change password
     */
    async changePassword(passwordData) {
        const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
        return response.data;
    }

    /**
     * Refresh access token
     */
    async refreshToken() {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
        const { accessToken } = response.data;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        return accessToken;
    }

    /**
     * Get stored user data
     */
    getStoredUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Get stored access token
     */
    getStoredToken() {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getStoredToken();
    }

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        const user = this.getStoredUser();
        return user?.role === role;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.hasRole('admin');
    }

    /**
     * Check if user is staff
     */
    isStaff() {
        return this.hasRole('staff');
    }
}

const authService = new AuthService();
export default authService;
export { authService };

