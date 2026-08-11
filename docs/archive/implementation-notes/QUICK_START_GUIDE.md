# 🚀 Quick Start Guide - Smart City Lipa

## All Features Are Now Complete! ✅

This guide will help you test all the newly implemented features.

---

## 🎯 5 NEW FEATURES TO TEST

### 1. 📍 Barangay Info Panel

**How to Use:**
1. Open the map view
2. Click on any barangay boundary (colored polygon)
3. Info panel appears in top-left corner
4. View flood risk, ashfall risk, elevation, etc.
5. Click X to close

**What to Look For:**
- Barangay name and image
- Color-coded risk badges (red/yellow/green)
- Distance from Taal Volcano
- Geographic data (elevation, area, etc.)
- Safety warnings for high-risk areas

---

### 2. 🎨 Colored Route Segments

**How to Use:**
1. Enable your location (click navigation button)
2. Click "Show Evacuation Route" button (map pin icon)
3. Route displays with colored segments
4. Click the destination marker to see risk summary

**What to Look For:**
- 🔴 Red segments = High risk areas
- 🟡 Yellow segments = Medium risk areas
- 🟢 Green segments = Safe areas
- Risk percentage breakdown in popup
- Overall risk level badge

---

### 3. ⚖️ Route Comparison

**How to Use:**
1. Calculate an evacuation route
2. Change wind direction or speed (wind control panel)
3. Route recalculates automatically
4. Comparison panel appears in bottom-left

**What to Look For:**
- Initial route (nearest, straight-line)
- Best route (safest, road-based)
- Distance difference (+/- km)
- Time difference (+/- minutes)
- Explanation of why best route was chosen

---

### 4. 🌬️ Wind Change Alerts

**How to Use:**
1. Enable wind animation (wind control panel)
2. Change wind direction (click direction buttons)
3. Change wind speed (click speed buttons)
4. Watch for toast notifications

**What to Look For:**
- Toast notification appears with wind change info
- Severity indicator (color of toast)
- Recommendation message
- For significant changes: recalculation prompt button

**Alert Types:**
- 🔴 High severity: Direction change ≥90° or speed change ≥20 km/h
- 🟡 Medium severity: Moderate changes
- ⚪ Low severity: Minor changes

---

### 5. ⚡ Route Caching

**How to Use:**
1. Calculate a route from your location to evacuation center
2. Note the calculation time
3. Hide the route (click map pin button again)
4. Show the route again (click map pin button)
5. Route loads instantly from cache

**What to Look For:**
- Console message: `⚡ Using cached route: ...`
- Instant route display (no loading)
- Cache persists even after page reload
- Cache expires after 30 minutes

**To Test Cache:**
```javascript
// Open browser console
// Check cache stats
const stats = JSON.parse(localStorage.getItem('routeCache'));
console.log('Cache entries:', Object.keys(stats).length);
```

---

## 🎮 COMPLETE FEATURE WALKTHROUGH

### Step-by-Step Testing

#### 1. Initial Setup
```bash
# Start backend
cd backend
npm start

# Start frontend (in new terminal)
cd frontend
npm run dev
```

#### 2. Test Barangay Info
1. Navigate to map view
2. Click on "Barangay 1" (or any barangay)
3. ✅ Info panel should appear
4. ✅ Check all data fields are populated
5. ✅ Risk badges show correct colors
6. Click X to close

#### 3. Test Colored Routes
1. Click navigation button (bottom-right)
2. Allow location access
3. Click map pin button to show evacuation route
4. ✅ Route should display with colored segments
5. ✅ Click destination marker
6. ✅ Risk summary should show percentages
7. ✅ Verify colors match risk levels

#### 4. Test Route Comparison
1. With route displayed, open wind control
2. Change wind direction from E to W
3. ✅ Route recalculates
4. ✅ Comparison panel appears in bottom-left
5. ✅ Shows initial vs best route
6. ✅ Distance/time differences displayed
7. ✅ Explanation bullets are relevant

#### 5. Test Wind Alerts
1. Enable wind animation
2. Change wind direction: N → S
3. ✅ Toast notification appears
4. ✅ Message describes the change
5. ✅ Recommendation is provided
6. Change wind speed: 20 → 40 km/h
7. ✅ High severity alert appears
8. ✅ Recalculation prompt button shows

#### 6. Test Route Caching
1. Calculate route (note time)
2. Open browser console
3. ✅ Look for: `💾 Cached route: ...`
4. Hide route, then show again
5. ✅ Look for: `⚡ Using cached route: ...`
6. ✅ Route loads instantly
7. Reload page, calculate same route
8. ✅ Still loads from cache

---

## 🐛 TROUBLESHOOTING

### Barangay Info Panel Not Showing
- **Check**: Barangays layer is enabled (toggle in map controls)
- **Check**: Clicking directly on barangay polygon (not marker)
- **Check**: Console for errors

### Route Segments Not Colored
- **Check**: Barangay data is loaded
- **Check**: Route calculation completed successfully
- **Check**: Console for "analyzeRouteRisk" errors
- **Fix**: Ensure Turf.js is installed: `npm install @turf/turf`

### Route Comparison Not Appearing
- **Check**: Route was recalculated (not first calculation)
- **Check**: Wind direction or speed was changed
- **Check**: Initial route was stored

### Wind Alerts Not Showing
- **Check**: Wind animation or barbs are enabled
- **Check**: Wind direction/speed actually changed
- **Check**: Not on initial mount (first change is ignored)

### Route Cache Not Working
- **Check**: localStorage is enabled in browser
- **Check**: Console for cache messages
- **Check**: Same start/end coordinates (rounded to 4 decimals)
- **Clear**: `localStorage.removeItem('routeCache')`

---

## 📊 VERIFICATION CHECKLIST

### Visual Checks
- [ ] Barangay info panel displays correctly
- [ ] Route segments show in red/yellow/green
- [ ] Route comparison panel is readable
- [ ] Wind change toasts appear
- [ ] All panels are properly positioned

### Functional Checks
- [ ] Clicking barangays opens info panel
- [ ] Route risk analysis works
- [ ] Route comparison calculates differences
- [ ] Wind changes trigger alerts
- [ ] Routes load from cache

### Performance Checks
- [ ] Cached routes load instantly
- [ ] No console errors
- [ ] Map remains responsive
- [ ] Animations run smoothly
- [ ] No memory leaks

---

## 🎨 UI ELEMENTS REFERENCE

### Panel Locations
```
┌─────────────────────────────────────┐
│ [Barangay Info]    [Wind Control]   │
│                                      │
│                                      │
│                    [Map Controls]    │
│                                      │
│                                      │
│ [Route Comparison]  [Locate Me]     │
│                     [Show Route]     │
└─────────────────────────────────────┘
```

### Color Coding
- 🔴 **Red**: High risk / Danger
- 🟡 **Yellow**: Medium risk / Warning
- 🟢 **Green**: Low risk / Safe
- 🔵 **Blue**: Information / Primary
- ⚪ **Gray**: Unknown / Neutral

---

## 🔍 CONSOLE COMMANDS

### Check Route Cache
```javascript
// View cache contents
JSON.parse(localStorage.getItem('routeCache'))

// Count cached routes
Object.keys(JSON.parse(localStorage.getItem('routeCache'))).length

// Clear cache
localStorage.removeItem('routeCache')
```

### Debug Wind Changes
```javascript
// Check current wind state
console.log('Direction:', windDirection, 'Speed:', windSpeed)

// Monitor wind changes
// (Already logged automatically in useWindChangeDetection)
```

### Check Barangay Data
```javascript
// In browser console after clicking barangay
console.log('Selected:', selectedBarangay)
```

---

## 📱 MOBILE TESTING

### Responsive Features
- All panels are scrollable
- Touch-friendly buttons
- Readable text sizes
- Proper z-index layering

### Mobile-Specific Tests
1. Test on phone/tablet
2. Verify panels don't overlap
3. Check touch interactions
4. Test location services
5. Verify notifications appear

---

## 🎯 EXPECTED BEHAVIOR

### Normal Flow
1. User opens map
2. Clicks barangay → Info panel shows
3. Enables location → User marker appears
4. Shows route → Colored segments display
5. Changes wind → Alert appears
6. Recalculates → Comparison shows
7. Repeats route → Loads from cache

### Edge Cases
- No location access → Manual selection works
- No barangay data → Graceful fallback
- OSRM fails → Straight-line fallback
- Cache full → Oldest entry removed
- Cache expired → Fetches new data

---

## 🚀 PERFORMANCE TIPS

### Optimize Cache
- Cache stores 50 routes max
- 30-minute expiration
- Automatic cleanup
- localStorage persistence

### Improve Rendering
- Reduce particle count if laggy
- Disable wind animation on slow devices
- Close unused panels
- Clear old cache entries

---

## 📞 NEED HELP?

### Check These First
1. Browser console for errors
2. Network tab for failed requests
3. localStorage for cache data
4. React DevTools for component state

### Common Issues
- **"Cannot read property"**: Component not mounted
- **"Network error"**: Backend not running
- **"Cache not working"**: localStorage disabled
- **"Route not colored"**: Barangay data missing

---

## 🎉 SUCCESS INDICATORS

### You'll Know It's Working When:
✅ Clicking barangays shows detailed info  
✅ Routes display in multiple colors  
✅ Comparison panel appears after recalculation  
✅ Wind changes trigger notifications  
✅ Routes load instantly from cache  
✅ No console errors  
✅ Smooth animations  
✅ Responsive interactions  

---

## 📚 DOCUMENTATION REFERENCE

- `ALL_FEATURES_COMPLETE.md` - Complete feature list
- `MISSING_FEATURES_IMPLEMENTED.md` - Detailed implementation
- `PHASE_3_SUMMARY.md` - Phase 3 overview
- `FEATURE_COMPARISON_CHECKLIST.md` - Feature analysis

---

**Happy Testing! 🎉**

All features are implemented and ready to use. If you encounter any issues, check the troubleshooting section or review the detailed documentation files.
