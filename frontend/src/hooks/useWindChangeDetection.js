/**
 * useWindChangeDetection Hook
 * Detects wind direction/speed changes and triggers alerts
 */

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useWindChangeDetection = ({
    windDirection,
    windSpeed,
    onWindChange,
    enabled = true,
}) => {
    const previousWind = useRef({
        direction: windDirection,
        speed: windSpeed,
    });
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            previousWind.current = { direction: windDirection, speed: windSpeed };
            return;
        }

        if (!enabled) return;

        const prev = previousWind.current;
        const directionChanged = prev.direction !== windDirection;
        const speedChanged = prev.speed !== windSpeed;

        if (directionChanged || speedChanged) {
            // Calculate direction change magnitude
            const directionDiff = Math.abs(windDirection - prev.direction);
            const normalizedDiff = Math.min(directionDiff, 360 - directionDiff);

            // Determine severity
            let severity = 'low';
            let message = '';
            let recommendation = '';

            if (directionChanged && speedChanged) {
                severity = 'high';
                message = `Wind changed: ${getDirectionName(prev.direction)} → ${getDirectionName(windDirection)}, ${prev.speed} → ${windSpeed} km/h`;
                recommendation = 'Routes are being recalculated based on new wind conditions.';
            } else if (directionChanged) {
                if (normalizedDiff >= 90) {
                    severity = 'high';
                    message = `Significant wind direction change: ${getDirectionName(prev.direction)} → ${getDirectionName(windDirection)}`;
                    recommendation = 'Ashfall patterns may have changed. Recalculating safe routes.';
                } else {
                    severity = 'medium';
                    message = `Wind direction changed to ${getDirectionName(windDirection)}`;
                    recommendation = 'Minor route adjustments may be needed.';
                }
            } else if (speedChanged) {
                const speedDiff = Math.abs(windSpeed - prev.speed);
                if (speedDiff >= 20) {
                    severity = 'high';
                    message = `Wind speed changed significantly: ${prev.speed} → ${windSpeed} km/h`;
                    recommendation = 'Hazard intensity may have changed. Stay alert.';
                } else {
                    severity = 'medium';
                    message = `Wind speed updated to ${windSpeed} km/h`;
                    recommendation = 'Monitor conditions closely.';
                }
            }

            // Show toast notification
            const toastOptions = {
                icon: '🌬️',
                duration: severity === 'high' ? 8000 : 5000,
            };

            if (severity === 'high') {
                toast.error(message, toastOptions);
            } else if (severity === 'medium') {
                toast(message, toastOptions);
            } else {
                toast(message, { ...toastOptions, duration: 3000 });
            }

            // Trigger callback
            if (onWindChange) {
                onWindChange({
                    previous: prev,
                    current: { direction: windDirection, speed: windSpeed },
                    severity,
                    message,
                    recommendation,
                    directionChanged,
                    speedChanged,
                    directionDiff: normalizedDiff,
                });
            }

            // Update previous wind
            previousWind.current = { direction: windDirection, speed: windSpeed };
        }
    }, [windDirection, windSpeed, enabled, onWindChange]);

    return {
        previousWind: previousWind.current,
    };
};

// Helper function to get direction name
const getDirectionName = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

export default useWindChangeDetection;
