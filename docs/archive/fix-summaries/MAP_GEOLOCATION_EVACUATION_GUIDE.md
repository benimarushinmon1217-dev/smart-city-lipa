# Map Geolocation & Evacuation Routing System - Complete Guide

## 🎯 Features Implemented

### 1. **User Geolocation** ✅
- Automatically centers map on user's current location
- Shows user location marker with pulsing animation
- Accuracy circle around user position
- "Locate Me" button for manual location refresh
- Permission handling and error messages

### 2. **Evacuation Centers Display** ✅
- Shows all evacuation centers on map
- Color-coded markers based on capacity:
  - 🟢 Green: Available (< 80% capacity)
  - 🟡 Yellow: Almost Full (80-99% capacity)
  - 🔴 Red: Full (100% capacity)
  - ⚫ Gray: Closed/Not operational
- Detailed popup information:
  - Center name and description
  - Address and barangay
  - Capacity and current occupancy
  - Contact number
  - Available facilities
  - "Get Directions" button
  - "Call Center" button

### 3. **Evacuation Routing** ✅
- Finds nearest evacuation center from user location
- Displays route line on map
- Shows distance and estimated walking time
- Direct navigation to Google Maps
- Route information popup
- Toggle button to show/hide route

### 4. **Additional Facilities** ✅
- Hospitals
- Police stations
- Fire stations
- All with coordinates and contact information

## 📁 Files Created/Modified

### New Files
1. **`frontend/src/hooks/useEstablishments.js`**
   - Hook for fetching establishments/evacuation centers
   - Methods: useEvacuationCenters, useHospitals, useFindNearest

2. **`frontend/src/components/map/EvacuationRoute.jsx`**
   - Component for displaying evacuation route
   - Calculates nearest center
   - Shows route line and destination marker

### Modified Files
3. **`frontend/src/components/map/MapContainer.jsx`**
   - Added geolocation functionality
   - User location marker with pulsing animation
   - "Locate Me" button
   - "Show Evacuation Route" button
   - Location status indicator

4. **`frontend/src/components/map/ShelterMarkers.jsx`**
   - Updated to use evacuation centers (type: 'evacuation')
   - Enhanced popup with better UI
   - Capacity visualization with progress bar
   - Facilities display
   - Better icons and colors

5. **`backend/seedData.js`**
   - Fixed establishment types (shelter → evacuation)
   - Added 6 establishments:
     - 3 evacuation centers with full details
     - 1 hospital
     - 1 police station
     - 1 fire station

## 🗺️ How It Works

### User Flow

1. **User opens map page**
   ```
   → Browser requests location permission
   → User grants permission
   → Map centers on user location
   → User location marker appears
   ```

2. **View evacuation centers**
   ```
   → Evacuation centers load automatically
   → Markers appear on map (color-coded)
   → Click marker to see details
   → Click "Get Directions" for navigation
   ```

3. **Find evacuation route**
   ```
   → Click "Show Evacuation Route" button (map pin icon)
   → System finds nearest evacuation center
   → Route line appears on map
   → Distance and time displayed
   → Click destination marker for details
   → Click "Start Navigation" for turn-by-turn directions
   ```

### Technical Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER OPENS MAP                                │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              GEOLOCATION API REQUEST                             │
│  navigator.geolocation.getCurrentPosition()                      │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              GET USER COORDINATES                                │
│  { lat: 13.9411, lng: 121.1633 }                                │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              CENTER MAP ON USER LOCATION                         │
│  map.flyTo([lat, lng], zoom: 15)                                │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              FETCH EVACUATION CENTERS                            │
│  GET /api/establishments/evacuation/centers                      │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              DISPLAY MARKERS ON MAP                              │
│  • User location marker (blue, pulsing)                         │
│  • Evacuation center markers (color-coded)                      │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         USER CLICKS "SHOW EVACUATION ROUTE"                      │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         FIND NEAREST EVACUATION CENTER                           │
│  POST /api/ai/route-recommendation/evacuation-center            │
│  Body: { latitude, longitude }                                  │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         CALCULATE ROUTE                                          │
│  • Distance (Haversine formula)                                 │
│  • Estimated time (distance / walking speed)                    │
│  • Route points [origin, destination]                           │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         DISPLAY ROUTE ON MAP                                     │
│  • Green dashed line from user to center                        │
│  • Destination marker at evacuation center                      │
│  • Route info popup                                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🧪 Testing Instructions

### Test 1: Geolocation
1. Open map page: `http://localhost:5173/map`
2. **Expected**: Browser asks for location permission
3. Click "Allow"
4. **Expected**:
   - Map centers on your location
   - Blue pulsing marker appears at your location
   - "Location Active" badge appears top-right
   - Success toast: "Location found!"

### Test 2: Evacuation Centers
1. On map page, look for house icons (🏠)
2. **Expected**: See 3 evacuation center markers
3. Click on a marker
4. **Expected**: Popup shows:
   - Center name
   - Address and barangay
   - Capacity bar (0/200, 0/500, 0/300)
   - Contact number
   - Facilities list
   - "Get Directions" button
   - "Call Center" button

### Test 3: Evacuation Route
1. Click the map pin button (bottom-right, below navigation button)
2. **Expected**:
   - Green dashed line appears from your location to nearest center
   - Toast: "Nearest evacuation center: [name]"
   - Destination marker appears at center
3. Click destination marker
4. **Expected**: Popup shows:
   - "Nearest Evacuation Center" title
   - Distance (e.g., "1.23 km away")
   - Estimated time (e.g., "~15 min walk")
   - "Start Navigation" button
5. Click "Start Navigation"
6. **Expected**: Opens Google Maps with walking directions

### Test 4: Manual Location Refresh
1. Click navigation button (bottom-right)
2. **Expected**:
   - Map re-centers on your location
   - Toast: "Location found!"

### Test 5: Seed Data
1. Run seed script:
   ```bash
   cd backend
   npm run seed
   ```
2. **Expected**: Creates:
   - 3 evacuation centers
   - 1 hospital
   - 1 police station
   - 1 fire station
3. Refresh map
4. **Expected**: All markers appear

## 📊 Evacuation Centers Data

### From Seed Data

| Name | Type | Barangay | Capacity | Coordinates |
|------|------|----------|----------|-------------|
| Barangay 1 Evacuation Center | evacuation | Barangay 1 | 200 | 13.9411, 121.1633 |
| Lipa City Sports Complex | evacuation | Antipolo del Norte | 500 | 13.9425, 121.1645 |
| Bolbok Elementary School | evacuation | Bolbok | 300 | 13.9380, 121.1620 |
| Lipa City Medical Center | hospital | Barangay 1 | - | 13.9408, 121.1628 |
| Lipa City Police Station | police | Barangay 1 | - | 13.9415, 121.1635 |
| Lipa City Fire Station | fire_station | Barangay 1 | - | 13.9418, 121.1640 |

## 🎨 UI Elements

### Map Buttons
1. **Navigation Button** (bottom-right, top)
   - Icon: Navigation compass
   - Color: Blue (primary) when no location, Gray (secondary) when located
   - Action: Get/refresh user location

2. **Evacuation Route Button** (bottom-right, bottom)
   - Icon: Map pin
   - Color: Gray (secondary) when off, Blue (primary) when on
   - Action: Toggle evacuation route display
   - Only visible when user location is available

### Map Indicators
1. **Live Updates** (top-left)
   - Green pulsing dot
   - Text: "Live Updates"

2. **Location Active** (top-right)
   - Map pin icon
   - Text: "Location Active"
   - Only visible when user location is available

### Markers
1. **User Location**
   - Blue circle with white border
   - Pulsing animation
   - Light blue accuracy circle (50m radius)

2. **Evacuation Centers**
   - House emoji (🏠)
   - Circular background
   - Colors:
     - Green: Available
     - Yellow: Almost full
     - Red: Full
     - Gray: Closed

3. **Route Destination**
   - Larger house emoji
   - Green circular background
   - White border with shadow

### Route Line
- Color: Green (#22c55e)
- Style: Dashed line
- Width: 4px
- Opacity: 80%

## 🔧 Configuration

### Map Center (Default)
```javascript
// frontend/src/config/map.config.js
CENTER: {
  lat: 13.9411,  // Lipa City center
  lng: 121.1633
}
```

### Walking Speed (for time estimation)
```javascript
// frontend/src/components/map/EvacuationRoute.jsx
const estimatedTime = Math.ceil((distance / 5) * 60); // 5 km/h
```

### Geolocation Options
```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // 10 seconds timeout
  maximumAge: 0              // Don't use cached position
}
```

## 🚀 API Endpoints Used

### 1. Get Evacuation Centers
```
GET /api/establishments/evacuation/centers
Query params: ?barangay_id=1 (optional)
Response: { centers: [...] }
```

### 2. Find Nearest Evacuation Center
```
POST /api/ai/route-recommendation/evacuation-center
Body: { latitude: 13.9411, longitude: 121.1633 }
Response: {
  found: true,
  nearest: { id, name, address, latitude, longitude, distance, ... },
  alternatives: [...],
  total_available: 3
}
```

## 🔒 Permissions

### Browser Geolocation Permission
- Required for user location features
- Requested automatically on map load
- Can be manually triggered with "Locate Me" button
- Error handling for:
  - Permission denied
  - Position unavailable
  - Timeout

## 📱 Mobile Considerations

- Touch-friendly button sizes
- Responsive popups
- Works with device GPS
- Optimized for mobile browsers
- Click-to-call functionality for contact numbers

## 🎯 Future Enhancements

### Possible Additions
1. **Real-time routing** using OSRM or Google Directions API
2. **Multiple route options** (fastest, safest, shortest)
3. **Hazard-aware routing** (avoid flooded areas)
4. **Turn-by-turn navigation** within the app
5. **Offline maps** for emergency situations
6. **Route sharing** via SMS or social media
7. **Estimated arrival time** based on current traffic
8. **Alternative evacuation centers** if nearest is full
9. **Real-time capacity updates** via WebSocket
10. **Voice navigation** for accessibility

## ✅ Checklist

- [x] User geolocation with permission handling
- [x] Map centers on user location
- [x] User location marker with animation
- [x] Evacuation centers display on map
- [x] Color-coded markers by capacity
- [x] Detailed evacuation center popups
- [x] Find nearest evacuation center
- [x] Display evacuation route
- [x] Distance and time calculation
- [x] Google Maps integration for navigation
- [x] Toggle evacuation route on/off
- [x] Seed data with evacuation centers
- [x] Contact information and facilities
- [x] Responsive design
- [x] Error handling
- [x] Toast notifications

## 🎉 Status: COMPLETE

All requested features have been implemented:
- ✅ Map centers on user's specific location
- ✅ Evacuation routing system
- ✅ Evacuation centers/shelters with coordinates
- ✅ Facility data utilized
- ✅ Distance calculation
- ✅ Navigation integration

---

**Last Updated**: 2026-05-15  
**Status**: ✅ FULLY FUNCTIONAL  
**Ready for**: Testing and deployment
