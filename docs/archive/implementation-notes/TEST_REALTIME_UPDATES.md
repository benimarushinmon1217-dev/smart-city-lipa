# Test Plan: Real-Time Incident Updates

## Status
✅ Backend restarted with broadcast fixes
✅ Frontend running on http://localhost:5173
✅ Backend running on http://localhost:5000
✅ Socket.io server initialized

## What Was Fixed
Added `broadcast()` calls in `backend/services/incidentService.js` to emit socket events to ALL connected clients when:
- New incident is created (`incident:new`)
- Incident is updated (`incident:updated`)
- Incident is verified (`incident:verified`)

## Test Steps

### Test 1: Create New Incident
1. **Open Dashboard** (http://localhost:5173/dashboard)
   - Note the current "Active Incidents" count
   - Note the incidents in "Recent Incidents" section

2. **Open Incident List** in a new tab (http://localhost:5173/incidents)
   - Note the current incidents displayed

3. **Open Map View** in another tab (http://localhost:5173/map)
   - Note the current incident markers

4. **Create New Incident** (http://localhost:5173/incidents/new)
   - Fill in the form:
     - Title: "Test Real-Time Update"
     - Type: "Flood"
     - Barangay: Select any barangay
     - Severity: "High"
     - Description: "Testing real-time socket updates"
   - Click "Submit Report"

5. **Expected Results** (should happen within 1-2 seconds):
   - ✅ Success toast appears: "Incident reported successfully"
   - ✅ Redirected to incidents list page
   - ✅ New incident appears at the top of the list
   - ✅ Switch to Dashboard tab → New incident appears in "Recent Incidents"
   - ✅ Active Incidents count increases by 1
   - ✅ Switch to Map tab → New incident marker appears on map
   - ✅ **NO PAGE REFRESH NEEDED**

### Test 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for socket messages:
   - ✅ "Socket connected: [socket-id]"
   - ✅ When incident created: Should see toast notification
   - ❌ Should NOT see errors like "incident:new handler failed"

### Test 3: Check Backend Logs
1. Look at backend terminal output
2. When incident is created, should see:
   - ✅ "Incident created: [id] by user [userId]"
   - ✅ "Emitted incident:new to barangay [barangayId]"
   - ✅ "Emitted incident:new to role admin"
   - ✅ "Emitted incident:new to role staff"
   - ✅ "Broadcasted incident:new to all clients" ← **NEW**

### Test 4: Multiple Browser Windows
1. Open the app in TWO different browser windows (or incognito)
2. Login to both
3. In Window 1: Go to Dashboard
4. In Window 2: Create a new incident
5. **Expected**: Window 1 dashboard updates automatically without refresh

### Test 5: Notifications
1. Create a new incident
2. Check if a notification was created
3. Go to Notifications page (http://localhost:5173/notifications)
4. **Expected**: New notification appears (if backend creates notifications for incidents)

## Troubleshooting

### If incidents don't appear in real-time:

**Check 1: Socket Connection**
- Open browser console
- Look for "Socket connected: [id]"
- If not connected, check CORS settings in `backend/config/cors.js`

**Check 2: Backend Logs**
- Look for "Broadcasted incident:new to all clients"
- If missing, the broadcast() call might not be working

**Check 3: React Query Cache**
- Open React DevTools
- Go to "Query" tab
- Look for queries with key `['incidents']`
- After creating incident, these should show "fetching" status

**Check 4: Frontend Socket Listeners**
- Check `frontend/src/hooks/useSocket.js`
- Verify `socketService.on('incident:new', ...)` is set up
- Verify `queryClient.invalidateQueries(['incidents'])` is called

### If socket events are not being received:

**Option A: Check if socket is initialized**
```javascript
// In browser console:
window.socketService?.isConnected()
// Should return: true
```

**Option B: Manual test**
```javascript
// In browser console:
window.socketService?.on('test', (data) => console.log('Test received:', data))
// Then in backend, emit a test event
```

## Success Criteria
✅ New incidents appear in all views within 1-2 seconds
✅ No page refresh needed
✅ Multiple browser windows update simultaneously
✅ Socket connection stable (no repeated disconnects)
✅ No console errors related to socket events

## Known Limitations
- Notifications page may not update if backend doesn't create notifications for incidents
- Reports page won't update (incidents and reports are different entities)
- Dashboard stats update when incidents list updates (they use the same hook)

## Next Steps After Testing
If real-time updates work:
1. ✅ Mark this issue as resolved
2. Test other real-time features (traffic updates, announcements)
3. Consider adding loading indicators during socket updates

If real-time updates DON'T work:
1. Check all troubleshooting steps above
2. Verify socket connection in browser console
3. Check backend logs for broadcast messages
4. Verify React Query cache invalidation
