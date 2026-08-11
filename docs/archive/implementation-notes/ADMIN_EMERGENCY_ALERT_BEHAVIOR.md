# Admin Emergency Alert Behavior

## How It Works

### GlobalEmergencyAlert Component
**Location:** `frontend/src/App.jsx`
**Condition:** `{isAuthenticated && <GlobalEmergencyAlert />}`

**This means:**
- ✅ Shows for ALL authenticated users (including admins)
- ✅ Shows on ALL pages (Dashboard, Broadcast, Map, etc.)
- ✅ Admins WILL receive their own broadcasts
- ✅ Admins WILL see emergency alerts from other admins

### Expected Behavior

**When Admin Sends Broadcast:**
1. Admin fills form and clicks "Send Emergency Broadcast"
2. Backend creates announcement and broadcasts socket event
3. **ALL connected users receive event** (including the admin who sent it)
4. Emergency modal appears for everyone
5. Admin sees success toast: "✅ Emergency alert sent successfully!"
6. Admin also sees: "📡 Broadcast delivered to ALL USERS"

**When User Receives Broadcast:**
1. Socket event received: `announcement:new`
2. Priority/type checked: `urgent/high` or `emergency/evacuation`
3. Emergency modal appears with siren sound
4. User must click "I UNDERSTAND" to close

## Testing Steps

### Test 1: Admin Receives Own Broadcast
1. **Admin browser:** Login as admin
2. **Open console:** F12
3. **Type:** `window.testEmergencyAlert()`
4. **Expected:** Red flashing modal appears
5. **If YES:** Component works for admin ✅
6. **If NO:** Component not loaded for admin ❌

### Test 2: Admin Receives Real Broadcast
1. **Admin browser:** Go to Broadcast page
2. **Send emergency alert** (Title: "Test", Priority: Critical, Target: All)
3. **Check console** for:
   ```
   📢 [GLOBAL ALERT] Announcement received: {...}
   🚨 [GLOBAL ALERT] Showing emergency modal
   ```
4. **Expected:** Modal appears on admin screen too
5. **If NO:** Check console for errors

### Test 3: User Receives Broadcast
1. **User browser:** Login as regular user
2. **Open console:** F12
3. **Admin sends broadcast**
4. **Check user console** for same logs
5. **Expected:** Modal appears on user screen

### Test 4: Two-Way Test
1. **Browser A:** Admin account
2. **Browser B:** User account
3. **Admin sends broadcast**
4. **Expected:** BOTH browsers show modal

## Why Admin Might Not See Modal

### Reason 1: Component Not Loaded
**Check:**
```javascript
// In admin browser console
typeof window.testEmergencyAlert
// Should return: "function"
```

**If undefined:**
- Component not rendering
- Check if logged in
- Hard refresh: Ctrl+Shift+R

### Reason 2: Socket Not Connected
**Check:**
```javascript
// In admin browser console
window.socketService
// Should show connected: true
```

**If not connected:**
- Backend not running
- Restart backend
- Refresh browser

### Reason 3: On Wrong Page
**Note:** Modal should appear on ALL pages, but check:
- Are you on the Broadcast page when sending?
- Modal should still appear even on Broadcast page
- Try navigating to Dashboard after sending

### Reason 4: Modal Behind Other Elements
**Check:**
- Modal has `z-index: 9999`
- Should be on top of everything
- Try clicking outside modal area
- Check browser DevTools for modal element

### Reason 5: Event Not Received
**Check admin console for:**
```
📢 [GLOBAL ALERT] Announcement received: {...}
```

**If missing:**
- Socket event not received
- Check backend logs
- Check socket connection

## Backend Logs to Check

When admin sends broadcast, backend should show:
```
🚨 [EMERGENCY ANNOUNCEMENT] Processing: Test Alert
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to X connected clients
✅ [EMERGENCY ANNOUNCEMENT] Processing complete
```

**Important:** X should be >= 1 (at least the admin is connected)

## Admin Console Logs

When admin sends broadcast, admin console should show:
```
📢 [GLOBAL ALERT] Announcement received: {
  "announcement": {
    "title": "Test Alert",
    "content": "Test message",
    "type": "emergency",
    "priority": "urgent"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
📢 [GLOBAL ALERT] Priority: urgent Type: emergency
🚨 [GLOBAL ALERT] Showing emergency modal
🚨 [GLOBAL ALERT] Rendering emergency modal with alert: {...}
```

## Design Decision: Should Admin See Own Broadcasts?

### Current Behavior: YES ✅
**Pros:**
- Admin can verify broadcast was sent
- Admin can see what users see
- Admin can test the system
- Consistent behavior for all users

**Cons:**
- Admin might find it annoying
- Admin already knows they sent it

### Alternative: NO ❌
**To implement:**
```javascript
// In GlobalEmergencyAlert.jsx
on('announcement:new', (data) => {
    // Check if current user is admin who sent it
    if (data.created_by === currentUserId && userRole === 'admin') {
        console.log('Skipping - admin sent this');
        return;
    }
    // Show modal
});
```

**Recommendation:** Keep current behavior (YES)
- Admins should see what users see
- Helps with testing and verification
- Can always close modal quickly

## Quick Test Commands

### Test Admin Component
```javascript
// In admin browser console
window.testEmergencyAlert()
// Should show modal
```

### Test User Component
```javascript
// In user browser console
window.testEmergencyAlert()
// Should show modal
```

### Check Component Loaded
```javascript
// In any browser console
typeof window.testEmergencyAlert
// Should return: "function"
```

### Check Socket Connected
```javascript
// In any browser console
window.socketService?.connected
// Should return: true
```

## Summary

**Q: Should admin see emergency alerts?**
**A: YES** - Admins see all emergency alerts, including their own

**Q: Why doesn't admin see modal?**
**A: Check:**
1. Component loaded? (`window.testEmergencyAlert`)
2. Socket connected? (`window.socketService.connected`)
3. Console shows event? (`📢 [GLOBAL ALERT] Announcement received`)
4. Priority correct? (`urgent` or `high`, NOT `critical`)

**Q: How to test?**
**A: Run:** `window.testEmergencyAlert()` in console

**OPEN CONSOLE ON ADMIN SIDE AND RUN: window.testEmergencyAlert()**
