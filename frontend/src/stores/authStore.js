/**
 * Authentication Store
 * Zustand store for authentication state
 */

import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
    // State
    user: authService.getStoredUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    // Actions
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { user } = await authService.login(credentials);
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.register(userData);
            set({ isLoading: false });
            return user;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
    },

    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.updateProfile(profileData);
            set({ user, isLoading: false });
            return user;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    refreshUser: async () => {
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true });
            return user;
        } catch (error) {
            set({ user: null, isAuthenticated: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    // Direct setters for external use
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setToken: (token) => {
        // Token is stored in localStorage by authService
        // This just updates the authenticated state
        set({ isAuthenticated: !!token });
    },

    // Getters
    isAdmin: () => get().user?.role === 'admin',
    isStaff: () => get().user?.role === 'staff',
    hasRole: (role) => get().user?.role === role,
}));

export default useAuthStore;
export { useAuthStore };

