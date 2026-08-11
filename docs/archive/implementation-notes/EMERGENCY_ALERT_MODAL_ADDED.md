# Emergency Alert Modal - HIGH URGENCY UI ✅

## What Changed

Replaced simple toast notifications with a **full-screen flashing red emergency alert modal** that demands immediate attention.

## New Features

### 1. Emergency Alert Modal Component
**File:** `frontend/src/components/EmergencyAlertModal.jsx`

**Features:**
- 🚨 **Full-screen overlay** - Cannot be ignored
- 🔴 **Flashing red header** - Pulses for 10 seconds
- 🔊 **Alert sound** - 3 beeps using Web Audio API
- 📢 **Large, bold text** - Easy to read emergency details
- ⚠️ **Action instructions** - What users should do
- 🔇 **Mute button** - Can disable sound
- ❌ **Close button** - Must acknowledge to close
- 🎨 **Priority-based colors** - Red for urgent, orange for high
- ⏰ **Timestamp** - When alert was issued
- 📋 **Detailed content** - Full message with formatting

**Visual Effects:**
- Flashing background (pulses for 10 seconds)
- Bouncing animation (3 times)
- Red/orange gradient based on priority
- Large icons and text
- Warning strips top and bottom

### 2. Updated Dashboard
**File:** `frontend/src/pages/dashboard/Dashboard.jsx`

**Changes:**
- Added `emergencyAlert` state to store alert data
- Shows modal for `emergency:alert` events
- Shows modal for `announcement:new` with urgent/high priority
- Shows toast for low/medium priority announcements
- Modal appears on top of everything (z-index: 9999)

## When Modal Appears

### Always Shows Modal:
- ✅ `emergency:alert` event (any priority)
- ✅ `announcement:new` with `priority: 'urgent'`
- ✅ `announcement:new` with `priority: 'high'`
- ✅ `announcement:new` with `type: 'emergency'`
- ✅ `announcement:new` with `type: 'evacuation'`

### Shows Toast Only:
- 📢 `announcement:new` with `priority: 'medium'`
- 📢 `announcement:new` with `priority: 'low'`
- 📢 `announcement:new` with `type: 'general'`

## Modal Layout

```
┌─────────────────────────────────────────────────┐
│ 🚨 EMERGENCY ALERT          🔊 ❌              │ ← Flashing red header
│ May 16, 2026 10:30 AM                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  TYPHOON WARNING - IMMEDIATE EVACUATION        │ ← Large title
│                                                 │
│  ┃ A strong typhoon is approaching Lipa City.  │ ← Message box
│  ┃ All residents in low-lying areas must       │
│  ┃ evacuate immediately to designated shelters.│
│                                                 │
│  Priority: URGENT    Type: EMERGENCY            │ ← Badges
│                                                 │
│  ⚠️ What to do:                                │ ← Instructions
│  • Stay calm and follow official instructions  │
│  • Check for updates regularly                 │
│  • Ensure your safety and that of your family  │
│  • Contact emergency services if needed: 911   │
│                                                 │
│  [I UNDERSTAND - CLOSE ALERT]                  │ ← Big red button
│                                                 │
├─────────────────────────────────────────────────┤
│ ⚠️ Official emergency alert from Smart City ⚠️ │ ← Bottom strip
└─────────────────────────────────────────────────┘
```

## Testing Steps

### 1. Refresh Browser
Clear cache and refresh to load new component.

### 2. Send Emergency Broadcast
**Admin Side:**
1. Go to Admin Dashboard → Broadcast
2. Fill in form:
   - **Title:** "Test Emergency Alert"
   - **Message:** "This is a test of the emergency alert system. Please remain calm."
   - **Type:** Emergency Alert
   - **Priority:** Critical (urgent)
   - **Target:** All Users
3. Click "Send Emergency Broadcast"

**User Side (different browser):**
1. Login as regular user
2. Go to Dashboard
3. **Expected:**
   - Screen darkens with black overlay
   - Large red modal appears in center
   - Header flashes red
   - Modal bounces 3 times
   - 3 beep sounds play
   - Cannot interact with page until closed

### 3. Test Modal Features

**Sound:**
- Click 🔊 button to mute
- Click again to unmute
- Sound plays 3 beeps on load

**Close:**
- Click ❌ button in header
- Click "I UNDERSTAND - CLOSE ALERT" button
- Click outside modal (on dark overlay)

**Priority Colors:**
- Urgent → Red header
- High → Orange header
- Medium → Yellow header

### 4. Test Different Alert Types

**Emergency Alert:**
```javascript
Type: emergency
Priority: urgent
Result: Red flashing modal
```

**Evacuation Order:**
```javascript
Type: evacuation
Priority: urgent
Result: Red flashing modal with 🏃 icon
```

**Weather Alert:**
```javascript
Type: weather
Priority: high
Result: Orange flashing modal with ⛈️ icon
```

**General Announcement:**
```javascript
Type: general
Priority: medium
Result: Toast notification only (no modal)
```

## Sound Implementation

Uses **Web Audio API** to generate beep sounds:
- Frequency: 800 Hz (sine wave)
- Duration: 0.5 seconds per beep
- Volume: 30% (0.3 gain)
- Pattern: 3 beeps with 600ms gaps

**Browser Compatibility:**
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ⚠️ May require user interaction first (autoplay policy)

## Animations

**Flashing Effect:**
```css
@keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
Duration: 1s, infinite loop for 10 seconds
```

**Bounce Effect:**
```css
@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
Duration: 2s, repeats 3 times
```

**Pulse Effect:**
```css
animate-pulse (Tailwind)
Applied to: AlertTriangle icon
```

## Accessibility

- ✅ Keyboard accessible (Tab, Enter, Escape)
- ✅ Screen reader friendly (semantic HTML)
- ✅ High contrast colors
- ✅ Large text (3xl for title)
- ✅ Clear action buttons
- ✅ Sound can be muted
- ✅ Focus trap (modal captures focus)

## Mobile Responsive

- ✅ Full-screen on mobile
- ✅ Touch-friendly buttons
- ✅ Readable text sizes
- ✅ Scrollable content if needed
- ✅ Works in portrait/landscape

## Files Created

1. ✅ `frontend/src/components/EmergencyAlertModal.jsx` - New modal component

## Files Modified

1. ✅ `frontend/src/pages/dashboard/Dashboard.jsx` - Added modal integration

## Next Steps

1. ✅ Refresh browser
2. ✅ Test emergency broadcast
3. ✅ Verify modal appears with flashing red
4. ✅ Test sound (3 beeps)
5. ✅ Test mute button
6. ✅ Test close button
7. ✅ Test different priority levels
8. ✅ Test on mobile device

## Future Enhancements

- 📱 Push notifications (if user not on page)
- 📍 Location-based alerts (show distance to danger)
- 🗺️ Map integration (show affected areas)
- 📞 Emergency contact quick dial
- 🏃 Evacuation route suggestions
- 📊 Alert history log
- 🔔 Custom alert sounds
- 🌐 Multi-language support

**REFRESH BROWSER AND TEST THE EMERGENCY ALERT NOW!**
