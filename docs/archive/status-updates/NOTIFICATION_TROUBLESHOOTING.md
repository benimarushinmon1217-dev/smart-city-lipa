# Notification Troubleshooting Guide

## Current Status
- ✅ Backend creates database notifications when reports/incidents are submitted
- ✅ Backend emits socket events (`report:new`, `incident:new`)
- ✅ Frontend has centralized socket event handling in `useSocketEvents` hook
- ✅ Toast notifications configured in `useSocketEvents`
- ❓ User reports "notifications are gone on both sides"

## What to Check

### 1. Browser Console Logs
Open browser console (F12) and look for these logs:

#### When Page Loads:
```
🔌 [SOCKET EVENTS] Setting up centralized socket event listeners
🔌 [SOCKET EVENTS] This should only appear ONCE per app instance
🔌 [SOCKET EVENTS] Registering event listeners...
✅ [SOCKET EVENTS] All event listeners registered
✅ [SOCKET EVENTS] Socket connected
```

**If you DON'T see these logs:**
- `useSocketEvents` hook is not running
- Check if `App.jsx` is calling `useSocketEvents()`
- Check for JavaScript errors preventing hook execution

#### When Report/Incident is Submitted:
```
🔔 [SOCKET EVENTS] report:new received: {report data}
🔔 [SOCKET EVENTS] Showing toast for report: [id] [title]
```
OR
```
🔔 [SOCKET EVENTS] incident:new received: {incident data}
🔔 [SOCKET EVENTS] Showing toast for incident: [id] [title]
```

**If you DON'T see these logs:**
- Socket event is not being received
- Check backend logs to see if event was emitted
- Check if user is in correct socket room (`role:admin`, `role:staff`)

### 2. Backend Logs
Check backend console for these logs when report/incident is created:

```
Creating notifications for new report [id]
Created [X] notifications for admins
Created [X] notifications for staff
Emitting report:new socket event to admin and staff
```

**If you DON'T see these logs:**
- Notification service is not being called
- Check `reportService.js` and `incidentService.js`

### 3. Network Tab
Open browser Network tab and filter by "WS" (WebSocket):

- Should see WebSocket connection to `ws://localhost:5000`
- Connection status should be "101 Switching Protocols" (green)
- Should see socket messages being sent/received

**If WebSocket is not connected:**
- Backend socket server may not be running
- CORS configuration may be blocking connection
- Check `backend/config/socket.js`

### 4. Notification Bell
Click the notification bell icon in the header:

**Expected:**
- Shows list of notifications
- Shows unread count badge
- Notifications appear in the dropdown

**If "No notifications" appears:**
- Database notifications may not be created
- API endpoint `/api/notifications` may be failing
- Check browser Network tab for 401/403/500 errors

## Testing Steps

### Test 1: Check Socket Connection
1. Open browser console
2. Login as admin
3. Look for `✅ [SOCKET EVENTS] Socket connected`
4. **Result:** _______________

### Test 2: Submit Report (User Side)
1. Login as regular user
2. Open browser console
3. Submit a new report
4. Look for backend logs showing notification creation
5. **Result:** _______________

### Test 3: Receive Notification (Admin Side)
1. Login as admin in another browser/tab
2. Open browser console
3. Have user submit report (from Test 2)
4. Look for `🔔 [SOCKET EVENTS] report:new received`
5. Look for toast notification appearing on screen
6. **Result:** _______________

### Test 4: Check Notification Bell
1. As admin, click notification bell icon
2. Check if notification appears in dropdown
3. Check if unread count badge shows
4. **Result:** _______________

### Test 5: Check Database
1. Open database tool (MySQL Workbench, phpMyAdmin, etc.)
2. Run query: `SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;`
3. Check if notifications are being created
4. **Result:** _______________

## Common Issues and Solutions

### Issue 1: "No notifications" in bell dropdown
**Cause:** Database notifications not being created OR API failing
**Solution:**
- Check backend logs for notification creation
- Check Network tab for `/api/notifications` request
- Verify user is authenticated (check token in localStorage)

### Issue 2: Toast notifications not appearing
**Cause:** Socket events not being received OR `useSocketEvents` not running
**Solution:**
- Check browser console for socket connection logs
- Verify `useSocketEvents()` is called in `App.jsx`
- Check if socket event is being emitted from backend

### Issue 3: Duplicate notifications
**Cause:** Multiple components listening to same socket event
**Solution:**
- Only `useSocketEvents` should show toasts for socket events
- Individual components should only `refetch()` data

### Issue 4: Socket not connecting
**Cause:** Backend not running OR CORS blocking connection
**Solution:**
- Verify backend is running on port 5000
- Check `backend/config/socket.js` CORS configuration
- Check browser console for CORS errors

## Files to Check

### Frontend:
- `frontend/src/hooks/useSocketEvents.js` - Centralized socket event handling
- `frontend/src/App.jsx` - Should call `useSocketEvents()`
- `frontend/src/hooks/useNotifications.js` - Notification fetching
- `frontend/src/components/notifications/NotificationBell.jsx` - Notification bell UI
- `frontend/src/services/socketService.js` - Socket connection service

### Backend:
- `backend/services/reportService.js` - Report notification creation
- `backend/services/incidentService.js` - Incident notification creation
- `backend/services/notificationService.js` - Notification database operations
- `backend/config/socket.js` - Socket server configuration
- `backend/sockets/eventHandlers.js` - Socket event handlers

## Debug Commands

### Check if backend is running:
```bash
netstat -ano | findstr :5000
```

### Check backend logs:
```bash
cd backend
npm run dev
# Look for notification creation logs
```

### Check frontend console:
```javascript
// In browser console
localStorage.getItem('token')  // Should show JWT token
localStorage.getItem('user')   // Should show user data
```

### Test socket connection manually:
```javascript
// In browser console
import { socketService } from './services/socketService';
socketService.connect();
socketService.on('connect', () => console.log('Connected!'));
```

## Expected Behavior

### When User Submits Report:
1. ✅ Backend creates report in database
2. ✅ Backend creates notifications for admins/staff in database
3. ✅ Backend emits `report:new` socket event to `role:admin` and `role:staff` rooms
4. ✅ Admin's browser receives socket event
5. ✅ `useSocketEvents` hook shows toast notification
6. ✅ Notification bell count increases
7. ✅ Notification appears in bell dropdown

### When User Submits Incident:
1. ✅ Backend creates incident in database
2. ✅ Backend creates notifications for admins/staff in database
3. ✅ Backend emits `incident:new` socket event to `role:admin` and `role:staff` rooms
4. ✅ Admin's browser receives socket event
5. ✅ `useSocketEvents` hook shows toast notification
6. ✅ Notification bell count increases
7. ✅ Notification appears in bell dropdown

## Next Steps

1. **Check browser console** - Look for socket connection logs
2. **Check backend logs** - Look for notification creation logs
3. **Check Network tab** - Look for WebSocket connection and API requests
4. **Check database** - Verify notifications are being created
5. **Report findings** - Share console logs, network errors, or database results

## Contact
If issue persists, provide:
- Browser console logs (full output)
- Backend console logs (when report/incident is created)
- Network tab screenshot (showing WebSocket and API requests)
- Database query results (`SELECT * FROM notifications`)
