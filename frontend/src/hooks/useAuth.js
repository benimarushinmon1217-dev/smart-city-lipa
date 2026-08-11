/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, setUser, setToken, logout: logoutStore } = useAuthStore();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            console.log('Login mutation onSuccess, data:', data);
            console.log('User:', data.user);
            console.log('Token:', data.token);

            setUser(data.user);
            setToken(data.token);
            toast.success('Login successful!');

            // Redirect based on role
            if (data.user.role === 'admin') {
                console.log('Navigating to /admin');
                navigate('/admin');
            } else {
                console.log('Navigating to /dashboard');
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            console.error('Login mutation onError:', error);
            // Generic error message for security - don't reveal if email/password is wrong
            toast.error('Login error. Please check your credentials and try again.');
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            setUser(data.user);
            setToken(data.token);
            toast.success('Registration successful!');
            navigate('/dashboard');
        },
        onError: (error) => {
            // Generic error message for security - don't reveal specific validation issues
            toast.error('Signup error. Please check your information and try again.');
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logoutStore();
            queryClient.clear();
            toast.success('Logged out successfully');
            navigate('/login');
        },
        onError: () => {
            // Still logout locally even if API call fails
            logoutStore();
            queryClient.clear();
            navigate('/login');
        },
    });

    // Get current user profile
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: authService.getProfile,
        enabled: !!user,
        retry: false,
        onError: () => {
            logoutStore();
            navigate('/login');
        },
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.invalidateQueries(['profile']);
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: authService.changePassword,
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        },
    });

    return {
        user,
        profile,
        isLoadingProfile,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
        updateProfile: updateProfileMutation.mutate,
        isUpdatingProfile: updateProfileMutation.isPending,
        changePassword: changePasswordMutation.mutate,
        isChangingPassword: changePasswordMutation.isPending,
    };
};
