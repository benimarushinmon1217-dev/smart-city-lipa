# Emergency Alert Debugging Guide

## Quick Test Steps

### Step 1: Test Modal Component Directly
1. **Refresh browser** (Ctrl+Shift+R)
2. **Open browser console** (F12)
3. **Type in console:** `window.testEmergencyAlert()`
4. **Press Enter**
5. **Expected:** Red flashing modal appears with siren sound

**If modal appears:** ✅ Modal component works!
**If modal doesn't appear:** ❌ Component not loaded or has error

### Step 2: Check Component is Loaded
**Open browser console and look for:**
```
🌐 [GLOBAL ALERT] Component mounted
🧪 [TEST] Added window.testEmergencyAlert() function
🌐 [GLOBAL ALERT] Setting up emergency alert listeners
```

**If you see these:** ✅ Component is loaded
**If you don't see these:** ❌ Component not rendering

### Step 3: Check Socket Connection
**Look for in console:**
```
✅ [SOCKET] Connected to server
✅ [SOCKET] Socket ID: abc123...
```

**If connected:** ✅ Socket works
**If not connected:** ❌ Backend not running or socket issue

### Step 4: Send Emergency Broadcast
**Admin side:**
1. Go to Broadcast page
2. Fill form:
   - Title: "Test Alert"
   - Message: "Test message"
   - Type: Emergency Alert
   - Priority: Critical (urgent)
   - Target: All Users
3. Click Send

**User console should show:**
```
📢 [GLOBAL ALERT] Announcement received: {...}
📢 [GLOBAL ALERT] Full data: {...}
📢 [GLOBAL ALERT] Priority: urgent Type: emergency
🚨 [GLOBAL ALERT] Showing emergency modal
🚨 [GLOBAL ALERT] Rendering emergency modal with alert: {...}
```

**Backend console should show:**
```
🚨 [EMERGENCY ANNOUNCEMENT] Processing: Test Alert
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to X connected clients
✅ [EMERGENCY ANNOUNCEMENT] Processing complete
```

## Troubleshooting

### Issue 1: Component Not Loaded
**Symptoms:**
- No console logs starting with `🌐 [GLOBAL ALERT]`
- `window.testEmergencyAlert` is undefined

**Solutions:**
1. Check App.jsx has `<GlobalEmergencyAlert />`
2. Check you're logged in (component only shows when authenticated)
3. Hard refresh: Ctrl+Shift+R
4. Check browser console for import errors

**Test:**
```javascript
// In browser console
typeof window.testEmergencyAlert
// Should return: "function"
// If returns: "undefined" → Component not loaded
```

### Issue 2: Socket Not Connected
**Symptoms:**
- No `✅ [SOCKET] Connected` message
- Events not received

**Solutions:**
1. **Check backend is running:**
   - Open: `http://localhost:5000/api/v1/health` (or your backend URL)
   - Should return JSON response
   
2. **Restart backend:**
   ```bash
   cd backend
   node app.js
   ```

3. **Check socket URL in frontend:**
   - File: `frontend/src/config/api.config.js`
   - Should be: `http://localhost:5000` (or your backend URL)

4. **Refresh browser** after backend restart

### Issue 3: Events Sent But Not Received
**Symptoms:**
- Backend shows "Broadcasting to X clients"
- User console shows no "Announcement received"

**Solutions:**
1. **Check socket listeners are set up:**
   ```javascript
   // In browser console
   window.socketService
   // Should show socket service object
   ```

2. **Check event name matches:**
   - Backend emits: `announcement:new`
   - Frontend listens for: `announcement:new`
   - Must match exactly!

3. **Check user is in correct room:**
   - For "all" broadcasts, all connected users should receive
   - Check backend logs for number of connected clients

### Issue 4: Modal Renders But Not Visible
**Symptoms:**
- Console shows "Rendering emergency modal"
- No modal visible on screen

**Solutions:**
1. **Check z-index:**
   - Modal should have `z-[9999]`
   - Check if other elements have higher z-index

2. **Check modal state:**
   ```javascript
   // In browser console
   window.testEmergencyAlert()
   // Modal should appear
   ```

3. **Check CSS is loaded:**
   - Inspect element in DevTools
   - Check if styles are applied

### Issue 5: Priority/Type Not Matching
**Symptoms:**
- Console shows "Not showing modal - priority/type not urgent"
- Event received but modal doesn't show

**Solutions:**
1. **Check priority value:**
   - Must be: `'urgent'` or `'high'`
   - NOT: `'critical'` (invalid)

2. **Check type value:**
   - Must be: `'emergency'` or `'evacuation'`
   - Case-sensitive!

3. **Check data structure:**
   ```javascript
   // Console should show:
   Priority: urgent Type: emergency
   // NOT:
   Priority: undefined Type: undefined
   ```

## Manual Testing Commands

### Test 1: Trigger Modal Manually
```javascript
// In browser console
window.testEmergencyAlert()
```

### Test 2: Check Component State
```javascript
// Check if component is mounted
typeof window.testEmergencyAlert
// Should return: "function"
```

### Test 3: Check Socket Connection
```javascript
// Check socket service
window.socketService
// Should show socket object with connected: true
```

### Test 4: Simulate Socket Event
```javascript
// Manually trigger announcement event
window.socketService.emit('announcement:new', {
    announcement: {
        title: 'Manual Test',
        content: 'Testing socket event',
        type: 'emergency',
        priority: 'urgent'
    },
    timestamp: new Date().toISOString()
})
```

## Expected Console Output

### On Page Load (User Side)
```
🌐 [GLOBAL ALERT] Component mounted
🧪 [TEST] Added window.testEmergencyAlert() function
🌐 [GLOBAL ALERT] Setting up emergency alert listeners
✅ [SOCKET] Connected to server
✅ [SOCKET] Socket ID: abc123...
```

### When Broadcast Sent (User Side)
```
📢 [GLOBAL ALERT] Announcement received: {announcement: {...}, timestamp: "..."}
📢 [GLOBAL ALERT] Full data: {
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

### When Broadcast Sent (Backend)
```
🚨 [EMERGENCY ANNOUNCEMENT] Processing: Test Alert
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to 2 connected clients
📡 [SOCKET] Event data: {"announcement":{"title":"Test Alert"...
✅ [SOCKET] Broadcast complete for "announcement:new"
✅ [EMERGENCY ANNOUNCEMENT] Processing complete
```

## Quick Checklist

- [ ] Backend is running (`http://localhost:5000`)
- [ ] Frontend is running (`http://localhost:5173`)
- [ ] User is logged in
- [ ] Browser console is open (F12)
- [ ] Component mounted (see `🌐 [GLOBAL ALERT] Component mounted`)
- [ ] Socket connected (see `✅ [SOCKET] Connected`)
- [ ] `window.testEmergencyAlert()` works
- [ ] Backend shows "Broadcasting to X clients" where X > 0
- [ ] User console shows "Announcement received"
- [ ] Priority is `'urgent'` or `'high'` (NOT `'critical'`)
- [ ] Type is `'emergency'` or `'evacuation'`

## Next Steps

1. **Refresh browser** (Ctrl+Shift+R)
2. **Open console** (F12)
3. **Type:** `window.testEmergencyAlert()`
4. **Check:** Does modal appear?
   - **YES:** Socket issue, check backend
   - **NO:** Component issue, check console errors
5. **Send real broadcast** from admin
6. **Check console** for event logs
7. **Report:** What console logs do you see?

**REFRESH BROWSER, OPEN CONSOLE, AND RUN: window.testEmergencyAlert()**
