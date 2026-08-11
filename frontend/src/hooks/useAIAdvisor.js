/**
 * useAIAdvisor Hook
 * Advanced AI evacuation advisor with proactive intelligence
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api.config';
import { useSocket } from './useSocket';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useAIAdvisor = () => {
    const [advisories, setAdvisories] = useState([]);
    const [isListening, setIsListening] = useState(true);
    const { user } = useAuthStore();
    const { on, off } = useSocket();

    // Fetch AI recommendations
    const {
        data: recommendationsData,
        refetch: refetchRecommendations,
    } = useQuery({
        queryKey: ['ai-recommendations', user?.id],
        queryFn: async () => {
            // TODO: Implement proper AI recommendations endpoint
            return { data: [] };
        },
        enabled: false, // Disabled until proper endpoint is implemented
        refetchInterval: 60000, // Refetch every minute
    });

    // Get route explanation
    const getRouteExplanation = useMutation({
        mutationFn: async ({ origin, destination, routeData }) => {
            const response = await api.post(API_ENDPOINTS.AI.EXPLAIN_ROUTE, {
                origin,
                destination,
                routeData,
            });
            return response.data;
        },
    });

    // Get hazard explanation
    const getHazardExplanation = useMutation({
        mutationFn: async ({ hazardType, location, severity }) => {
            const response = await api.post(API_ENDPOINTS.AI.EXPLAIN_HAZARD, {
                hazardType,
                location,
                severity,
            });
            return response.data;
        },
    });

    // Get evacuation advice
    const getEvacuationAdvice = useMutation({
        mutationFn: async ({ currentLocation, hazards, shelters }) => {
            const response = await api.post(API_ENDPOINTS.AI.EVACUATION_ADVICE, {
                currentLocation,
                hazards,
                shelters,
            });
            return response.data;
        },
    });

    // Ask AI question
    const askQuestion = useMutation({
        mutationFn: async ({ question, context }) => {
            const response = await api.post(API_ENDPOINTS.AI.CHATBOT, {
                question: question,
                hazard_data: context || {},
            });
            console.log('Chatbot API response:', response.data);
            return response.data;
        },
    });

    // Real-time AI advisories
    useEffect(() => {
        if (!isListening) return;

        // Proactive hazard warning
        on('ai:hazard_warning', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'warning',
                priority: 'high',
                title: 'Hazard Alert',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));

            toast.error(data.message, {
                icon: '⚠️',
                duration: 8000,
            });
        });

        // Route change recommendation
        on('ai:route_recommendation', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'route',
                priority: 'medium',
                title: 'Route Update',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));

            toast(data.message, {
                icon: '🗺️',
                duration: 6000,
            });
        });

        // Shelter capacity warning
        on('ai:shelter_warning', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'shelter',
                priority: 'medium',
                title: 'Shelter Update',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));

            toast.warning(data.message, {
                icon: '🏠',
                duration: 6000,
            });
        });

        // Evacuation recommendation
        on('ai:evacuation_recommended', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'evacuation',
                priority: 'critical',
                title: 'Evacuation Advisory',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));

            toast.error(data.message, {
                icon: '🚨',
                duration: 10000,
            });
        });

        // Safety tip
        on('ai:safety_tip', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'tip',
                priority: 'low',
                title: 'Safety Tip',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));

            toast(data.message, {
                icon: 'ℹ️',
                duration: 5000,
            });
        });

        // Weather update
        on('ai:weather_update', (data) => {
            const advisory = {
                id: Date.now(),
                type: 'weather',
                priority: 'medium',
                title: 'Weather Update',
                message: data.message,
                recommendation: data.recommendation,
                timestamp: new Date(),
            };

            setAdvisories(prev => [advisory, ...prev].slice(0, 10));
        });

        return () => {
            off('ai:hazard_warning');
            off('ai:route_recommendation');
            off('ai:shelter_warning');
            off('ai:evacuation_recommended');
            off('ai:safety_tip');
            off('ai:weather_update');
        };
    }, [on, off, isListening]);

    // Generate contextual advice based on current situation
    const generateContextualAdvice = useCallback(async (context) => {
        try {
            const response = await api.post(API_ENDPOINTS.AI.CONTEXTUAL_ADVICE, {
                userId: user?.id,
                barangayId: user?.barangayId,
                context,
            });

            return response.data;
        } catch (error) {
            console.error('Failed to generate contextual advice:', error);
            return null;
        }
    }, [user]);

    // Clear advisories
    const clearAdvisories = useCallback(() => {
        setAdvisories([]);
    }, []);

    // Toggle listening
    const toggleListening = useCallback(() => {
        setIsListening(prev => !prev);
    }, []);

    return {
        advisories,
        recommendations: recommendationsData?.data || [],
        isListening,
        getRouteExplanation: getRouteExplanation.mutate,
        isExplainingRoute: getRouteExplanation.isPending,
        getHazardExplanation: getHazardExplanation.mutate,
        isExplainingHazard: getHazardExplanation.isPending,
        getEvacuationAdvice: getEvacuationAdvice.mutate,
        isGettingAdvice: getEvacuationAdvice.isPending,
        askQuestion: askQuestion.mutate,
        isAsking: askQuestion.isPending,
        generateContextualAdvice,
        clearAdvisories,
        toggleListening,
        refetchRecommendations,
    };
};

// Advisory types
export const ADVISORY_TYPES = {
    WARNING: 'warning',
    ROUTE: 'route',
    SHELTER: 'shelter',
    EVACUATION: 'evacuation',
    TIP: 'tip',
    WEATHER: 'weather',
};

// Advisory priorities
export const ADVISORY_PRIORITIES = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
};

// Get advisory color
export const getAdvisoryColor = (type, priority) => {
    if (priority === ADVISORY_PRIORITIES.CRITICAL) {
        return 'bg-danger-50 border-danger-200 text-danger-900';
    }

    switch (type) {
        case ADVISORY_TYPES.WARNING:
        case ADVISORY_TYPES.EVACUATION:
            return 'bg-danger-50 border-danger-200 text-danger-900';
        case ADVISORY_TYPES.ROUTE:
            return 'bg-blue-50 border-blue-200 text-blue-900';
        case ADVISORY_TYPES.SHELTER:
            return 'bg-warning-50 border-warning-200 text-warning-900';
        case ADVISORY_TYPES.TIP:
            return 'bg-gray-50 border-gray-200 text-gray-900';
        case ADVISORY_TYPES.WEATHER:
            return 'bg-blue-50 border-blue-200 text-blue-900';
        default:
            return 'bg-gray-50 border-gray-200 text-gray-900';
    }
};

// Get advisory icon
export const getAdvisoryIcon = (type) => {
    switch (type) {
        case ADVISORY_TYPES.WARNING:
            return '⚠️';
        case ADVISORY_TYPES.ROUTE:
            return '🗺️';
        case ADVISORY_TYPES.SHELTER:
            return '🏠';
        case ADVISORY_TYPES.EVACUATION:
            return '🚨';
        case ADVISORY_TYPES.TIP:
            return 'ℹ️';
        case ADVISORY_TYPES.WEATHER:
            return '🌤️';
        default:
            return '📢';
    }
};
