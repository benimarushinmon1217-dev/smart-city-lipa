# Emergency Broadcast Fix - Users Not Receiving Alerts

## Issue
Users are not receiving emergency broadcasts sent by admins.

## Changes Applied

### 1. Fixed target_barangays Parsing
**File:** `backend/services/announcementService.js`

The frontend sends `target_barangays` as a JSON string, but the backend wasn't parsing it before passing to the socket handler.

**Added:**
```javascript
// Parse target_barangays if it's a JSON string
let parsedBarangays = data.target_barangays;
if (typeof data.target_barangays === 'string') {
    try {
        parsedBarangays = JSON.parse(data.target_barangays);
    } catch (e) {
        logger.warn('Failed to parse target_barangays:', e);
        parsedBarangays = null;
    }
}
```

### 2. Enhanced Emergency Alert Broadcasting
**File:** `backend/sockets/eventHandlers.js`

**Improvements:**
- Added detailed console logging to track broadcast flow
- Ensured `emergency:alert` is sent for critical/urgent/emergency announcements
- Moved emergency alert inside the `targetAudience === 'all'` block for better logic

**Key Changes:**
```javascript
if (targetAudience === 'all') {
    // Send announcement:new
    broadcast(EVENTS.ANNOUNCEMENT_NEW, { ... });
    
    // ALSO send emergency:alert for high priority
    if (announcement.priority === 'critical' || 
        announcement.priority === 'urgent' || 
        announcement.type === 'emergency') {
        broadcast(EVENTS.EMERGENCY_ALERT, { ... });
    }
}
```

### 3. Frontend Already Listening
**File:** `frontend/src/pages/dashboard/Dashboard.jsx`

Users ARE already listening for both events:
```javascript
on('emergency:alert', (data) => {
    toast.error(data.message || 'Emergency Alert!', {
        duration: 10000,
    });
});

on('announcement:new', (data) => {
    toast(data.title || 'New Announcement', {
        duration: 5000,
    });
});
```

## How It Works Now

### For "All Users" Broadcasts:

1. **Admin sends broadcast** with `target: 'all'`
2. **Backend creates announcement** in database
3. **Socket handler broadcasts TWO events:**
   - `announcement:new` - Shows as toast notification
   - `emergency:alert` - Shows as urgent red toast (if critical/urgent/emergency)
4. **All connected users receive** both events instantly
5. **Toast notifications appear** on user screens

### For "Specific Barangay" Broadcasts:

1. **Admin sends broadcast** with `target: 'barangay'` and `barangayId`
2. **Backend parses** `target_barangays` JSON string
3. **Socket handler emits** to specific barangay room
4. **Only users in that barangay** receive the announcement

## Testing Steps

### 1. Restart Backend (REQUIRED)
```bash
cd backend
node app.js
```

### 2. Test City-Wide Broadcast

**Admin Side:**
1. Go to Admin Dashboard → Broadcast
2. Fill in form:
   - **Title:** "Test Emergency Alert"
   - **Message:** "This is a test of the emergency broadcast system"
   - **Type:** Emergency Alert (🚨)
   - **Priority:** Critical
   - **Target:** All Users (City-wide)
3. Click "Send Emergency Broadcast"
4. Confirm the alert

**User Side (open in different browser/incognito):**
1. Login as a regular user
2. Go to Dashboard
3. **Expected:**
   - Red toast notification appears: "Test Emergency Alert"
   - Stays visible for 10 seconds
   - Shows emergency icon

### 3. Check Backend Console

You should see:
```
🚨 [EMERGENCY ANNOUNCEMENT] Processing: Test Emergency Alert
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to X connected clients
🚨 [EMERGENCY ANNOUNCEMENT] Also sending as EMERGENCY_ALERT
📡 [SOCKET] Broadcasting "emergency:alert" to X connected clients
✅ [EMERGENCY ANNOUNCEMENT] Processing complete
```

### 4. Check User Browser Console

You should see:
```
🔔 [FRONTEND] announcement:new event received
🔔 [FRONTEND] emergency:alert event received
```

### 5. Test Different Priority Levels

Try sending broadcasts with different priorities:
- **Critical** → Red toast, 10 seconds, both events
- **High** → Orange toast, 5 seconds, announcement:new only
- **Medium** → Default toast, 5 seconds
- **Low** → Default toast, 5 seconds

### 6. Test Barangay-Specific Broadcast

1. Send broadcast with:
   - **Target:** Specific Barangay
   - **Barangay ID:** 1 (or any valid ID)
2. **Expected:**
   - Only users in that barangay receive it
   - Other users don't see it

## Troubleshooting

### Users Still Not Receiving

**Check 1: Backend Running?**
```bash
# Backend must be restarted after changes
cd backend
node app.js
```

**Check 2: Users Connected to Socket?**
- Open browser console on user side
- Look for: `✅ [SOCKET] Connected to server`
- If not connected, refresh page

**Check 3: Backend Console Shows Broadcast?**
- Look for: `📡 [SOCKET] Broadcasting "announcement:new" to X connected clients`
- If X = 0, no users are connected
- If X > 0 but users not receiving, check frontend listeners

**Check 4: Frontend Listening?**
- Open browser console on user side
- Look for: `🔔 [FRONTEND] announcement:new event received`
- If not showing, check if Dashboard component is mounted

**Check 5: Toast Notifications Working?**
- Try creating an incident as user
- Should see toast: "Incident reported successfully"
- If no toasts appear, react-hot-toast may not be configured

### Backend Console Shows Errors

**Error: "Cannot read property 'emit' of undefined"**
- Socket.io not initialized
- Restart backend

**Error: "target_barangays is not iterable"**
- JSON parsing failed
- Check frontend is sending valid JSON string

**Error: "broadcast is not a function"**
- Import issue in eventHandlers.js
- Check: `const { broadcast } = require('../config/socket');`

### Frontend Console Shows Errors

**Error: "on is not a function"**
- useSocket hook not working
- Check socket connection

**Error: "toast is not defined"**
- react-hot-toast not imported
- Check: `import toast from 'react-hot-toast';`

## Event Flow Diagram

```
Admin Broadcast Form
        ↓
POST /api/v1/admin/announcements/emergency
        ↓
announcementService.createAnnouncement()
        ↓
handleEmergencyAnnouncement()
        ↓
    [target === 'all']
        ↓
broadcast('announcement:new')  ← All users receive
        ↓
broadcast('emergency:alert')   ← All users receive (if critical)
        ↓
User Dashboard Listeners
        ↓
Toast Notifications Appear
```

## Files Modified

1. ✅ `backend/services/announcementService.js` - Parse target_barangays JSON
2. ✅ `backend/sockets/eventHandlers.js` - Enhanced logging, fixed emergency alert logic

## Files Already Correct (No Changes)

- ✅ `frontend/src/pages/admin/Broadcast.jsx` - Sends correct data
- ✅ `frontend/src/pages/dashboard/Dashboard.jsx` - Listens for events
- ✅ `backend/config/socket.js` - Broadcast function works
- ✅ `backend/controllers/adminController.js` - Emergency announcement endpoint exists

## Next Steps

1. **Restart backend** (REQUIRED)
2. **Test city-wide broadcast** with admin account
3. **Check user receives** toast notification
4. **Verify backend console** shows broadcast logs
5. **Test barangay-specific** broadcast
6. **Test different priority** levels

**RESTART BACKEND AND TEST NOW!**
