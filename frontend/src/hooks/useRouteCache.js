/**
 * useRouteCache Hook
 * Caches OSRM route responses for performance optimization
 */

import { useState, useCallback, useEffect } from 'react';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached routes

export const useRouteCache = () => {
    const [cache, setCache] = useState(() => {
        // Load cache from localStorage on mount
        try {
            const stored = localStorage.getItem('routeCache');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Filter out expired entries
                const now = Date.now();
                const filtered = Object.entries(parsed).reduce((acc, [key, value]) => {
                    if (value.timestamp + CACHE_DURATION > now) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                return filtered;
            }
        } catch (e) {
            console.warn('Failed to load route cache:', e);
        }
        return {};
    });

    // Save cache to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('routeCache', JSON.stringify(cache));
        } catch (e) {
            console.warn('Failed to save route cache:', e);
        }
    }, [cache]);

    // Generate cache key from coordinates
    const generateKey = useCallback((startLat, startLng, endLat, endLng) => {
        // Round to 4 decimal places (~11m precision)
        const roundedStartLat = startLat.toFixed(4);
        const roundedStartLng = startLng.toFixed(4);
        const roundedEndLat = endLat.toFixed(4);
        const roundedEndLng = endLng.toFixed(4);
        return `${roundedStartLat},${roundedStartLng}-${roundedEndLat},${roundedEndLng}`;
    }, []);

    // Get cached route
    const getCachedRoute = useCallback((startLat, startLng, endLat, endLng) => {
        const key = generateKey(startLat, startLng, endLat, endLng);
        const cached = cache[key];

        if (!cached) {
            return null;
        }

        // Check if cache is still valid
        const now = Date.now();
        if (cached.timestamp + CACHE_DURATION < now) {
            // Cache expired, remove it
            setCache(prev => {
                const newCache = { ...prev };
                delete newCache[key];
                return newCache;
            });
            return null;
        }

        console.log('⚡ Using cached route:', key);
        return cached.data;
    }, [cache, generateKey]);

    // Set cached route
    const setCachedRoute = useCallback((startLat, startLng, endLat, endLng, routeData) => {
        const key = generateKey(startLat, startLng, endLat, endLng);

        setCache(prev => {
            const newCache = { ...prev };

            // If cache is full, remove oldest entry
            const entries = Object.entries(newCache);
            if (entries.length >= MAX_CACHE_SIZE) {
                const oldest = entries.reduce((min, [k, v]) =>
                    v.timestamp < min.timestamp ? { key: k, timestamp: v.timestamp } : min,
                    { key: null, timestamp: Infinity }
                );
                if (oldest.key) {
                    delete newCache[oldest.key];
                }
            }

            // Add new entry
            newCache[key] = {
                data: routeData,
                timestamp: Date.now(),
            };

            return newCache;
        });

        console.log('💾 Cached route:', key);
    }, [generateKey]);

    // Clear cache
    const clearCache = useCallback(() => {
        setCache({});
        localStorage.removeItem('routeCache');
        console.log('🗑️ Route cache cleared');
    }, []);

    // Get cache statistics
    const getCacheStats = useCallback(() => {
        const entries = Object.entries(cache);
        const now = Date.now();
        const valid = entries.filter(([, v]) => v.timestamp + CACHE_DURATION > now);

        return {
            total: entries.length,
            valid: valid.length,
            expired: entries.length - valid.length,
            size: MAX_CACHE_SIZE,
            usage: ((valid.length / MAX_CACHE_SIZE) * 100).toFixed(0),
        };
    }, [cache]);

    // Fetch route with caching
    const fetchRouteWithCache = useCallback(async (startLat, startLng, endLat, endLng) => {
        // Check cache first
        const cached = getCachedRoute(startLat, startLng, endLat, endLng);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        // Fetch from OSRM
        try {
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                // Cache the result
                setCachedRoute(startLat, startLng, endLat, endLng, data);
                return { data, fromCache: false };
            }

            throw new Error('No routes found');
        } catch (error) {
            console.error('OSRM fetch failed:', error);
            throw error;
        }
    }, [getCachedRoute, setCachedRoute]);

    return {
        getCachedRoute,
        setCachedRoute,
        clearCache,
        getCacheStats,
        fetchRouteWithCache,
        cacheSize: Object.keys(cache).length,
    };
};

export default useRouteCache;
