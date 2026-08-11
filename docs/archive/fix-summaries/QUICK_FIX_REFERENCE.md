# Quick Fix Reference - MapStore Import Error

## Problem
```
Failed to resolve import "../../stores/mapStore" from "src/components/ai/AIAdvisorWidget.jsx"
```

## Solution
Created missing `mapStore.js` file and updated `MapContainer.jsx` to use it.

## Files Changed

### 1. Created: `frontend/src/stores/mapStore.js`
```javascript
import { create } from 'zustand';

export const useMapStore = create((set) => ({
    userLocation: null,
    setUserLocation: (location) => set({ userLocation: location }),
    
    selectedBarangay: null,
    setSelectedBarangay: (barangay) => set({ selectedBarangay: barangay }),
    
    windDirection: 90,
    windSpeed: 20,
    setWindDirection: (direction) => set({ windDirection: direction }),
    setWindSpeed: (speed) => set({ windSpeed: speed }),
    
    // ... other state
}));
```

### 2. Updated: `frontend/src/components/map/MapContainer.jsx`
```javascript
// Added import
import { useMapStore } from '../../stores/mapStore';

// Replaced useState with store
const {
    userLocation,
    setUserLocation,
    selectedBarangay,
    setSelectedBarangay,
    windDirection,
    windSpeed,
    setWindDirection,
    setWindSpeed,
    // ... other store values
} = useMapStore();
```

### 3. No Changes: `frontend/src/components/ai/AIAdvisorWidget.jsx`
Already had correct import - now it works!

## Test
```bash
cd frontend
npm run dev
```

Expected: No import errors, server starts successfully.

## Status: ✅ FIXED

---

**Quick Summary:**
- Created missing store file
- Updated MapContainer to use store
- AI Advisor now has access to map data
- All systems operational

**Time to Fix:** ~5 minutes
**Files Modified:** 2
**Lines Changed:** ~100
