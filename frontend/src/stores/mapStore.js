/**
 * Map Store
 * Global state management for map-related data
 */

import { create } from 'zustand';

export const useMapStore = create((set) => ({
    // User location
    userLocation: null,
    setUserLocation: (location) => set({ userLocation: location }),

    // Selected barangay
    selectedBarangay: null,
    setSelectedBarangay: (barangay) => set({ selectedBarangay: barangay }),

    // Wind conditions
    windDirection: 90, // Default: East
    windSpeed: 20, // Default: 20 km/h
    setWindDirection: (direction) => set({ windDirection: direction }),
    setWindSpeed: (speed) => set({ windSpeed: speed }),
    setWindConditions: (direction, speed) => set({ windDirection: direction, windSpeed: speed }),

    // Map filters
    activeFilters: {
        incidents: true,
        shelters: true,
        facilities: true,
        hazards: true,
        barangays: true,
    },
    setActiveFilters: (filters) => set({ activeFilters: filters }),
    toggleFilter: (filterName) => set((state) => ({
        activeFilters: {
            ...state.activeFilters,
            [filterName]: !state.activeFilters[filterName],
        },
    })),

    // Evacuation route
    evacuationRoute: null,
    setEvacuationRoute: (route) => set({ evacuationRoute: route }),

    // Wind animation state
    showWindAnimation: false,
    showWindBarbs: false,
    setShowWindAnimation: (show) => set({ showWindAnimation: show }),
    setShowWindBarbs: (show) => set({ showWindBarbs: show }),

    // Reset all state
    reset: () => set({
        userLocation: null,
        selectedBarangay: null,
        windDirection: 90,
        windSpeed: 20,
        activeFilters: {
            incidents: true,
            shelters: true,
            facilities: true,
            hazards: true,
            barangays: true,
        },
        evacuationRoute: null,
        showWindAnimation: false,
        showWindBarbs: false,
    }),
}));
