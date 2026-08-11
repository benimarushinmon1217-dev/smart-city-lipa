# Notification Flow Analysis

## Current Implementation

### Backend Flow (When Report/Incident is Created)

1. **User submits report** → `reportService.createReport()`
2. **Create database notifications:**
   ```javascript
   notificationService.notifyByRole('admin', {...})  // Creates notifications for each admin
   notificationService.notifyByRole('staff', {...})  // Creates notifications for each staff
   ```
3. **Each notification creation triggers:**
   ```javascript
   handleNewNotification({ userId, notification })
   emitToUser(userId, 'notification:new', { notification })
   ```
4. **Also emit socket events to roles:**
   ```javascript
   emitToRole('admin', 'report:new', { report })
   emitToRole('staff', 'report:new', { report })
   ```

### Frontend Flow

1. **`useSocketEvents` hook** (in App.jsx) listens for:
   - `notification:new` → Updates notification store + refetches queries
   - `report:new` → Shows toast + refetches reports
   - `incident:new` → Shows toast + refetches incidents

2. **`NotificationBell` component** displays:
   - Unread count badge
   - Notification dropdown list
   - Fetches from `/api/notifications` endpoint

## The Problem

When you say "notifications are gone", it could mean:

### Scenario A: Toast Notifications Not Showing
**Symptoms:**
- No toast popup appears when report/incident is submitted
- Console shows socket events being received

**Possible Causes:**
1. `useSocketEvents` hook not running (check console for setup logs)
2. Socket not connected (check console for connection logs)
3. Toast library not working (check for errors)

### Scenario B: Notification Bell Shows "No Notifications"
**Symptoms:**
- Toast notifications work
- But notification bell dropdown is empty
- Unread count shows 0

**Possible Causes:**
1. Database notifications not being created
2. API endpoint `/api/notifications` failing
3. User not authenticated properly
4. Notification query not refetching

### Scenario C: Both Toast AND Bell Notifications Missing
**Symptoms:**
- No toast popups
- No notifications in bell dropdown
- Console shows no socket events

**Possible Causes:**
1. Socket not connecting at all
2. User not in correct socket room
3. Backend not emitting events
4. Frontend not listening to events

## Diagnostic Steps

### Step 1: Check Browser Console
Open browser console and look for:

```
🔌 [SOCKET EVENTS] Setting up centralized socket event listeners
🔌 [SOCKET EVENTS] This should only appear ONCE per app instance
🔌 [SOCKET EVENTS] Registering event listeners...
✅ [SOCKET EVENTS] All event listeners registered
✅ [SOCKET EVENTS] Socket connected
```

**If you see these logs:** Socket is connected ✅
**If you DON'T see these logs:** Socket connection failed ❌

### Step 2: Submit a Report (as User)
1. Login as regular user
2. Submit a new report
3. Check backend console for:
```
Creating notifications for new report [id]
Created [X] notifications for admins
Created [X] notifications for staff
Emitting report:new socket event to admin and staff
```

**If you see these logs:** Backend is working ✅
**If you DON'T see these logs:** Backend notification creation failed ❌

### Step 3: Check Admin Console (When Report Submitted)
Admin browser console should show:
```
🔔 [SOCKET EVENTS] report:new received: {data}
🔔 [SOCKET EVENTS] Showing toast for report: [id] [title]
```

**If you see these logs:** Socket event received ✅
**If you DON'T see these logs:** Socket event not received ❌

### Step 4: Check Notification Bell
Click notification bell icon and check:
- Does dropdown show notifications?
- Does unread count badge appear?
- Check Network tab for `/api/notifications` request

**If notifications appear:** API working ✅
**If "No notifications" appears:** API failing or no data ❌

## Quick Fix Checklist

### Fix 1: Ensure Socket Connection
```javascript
// In browser console, check:
localStorage.getItem('token')  // Should show JWT token
localStorage.getItem('user')   // Should show user data with role
```

### Fix 2: Verify Backend is Running
```bash
# Check if backend is running on port 5000
netstat -ano | findstr :5000
```

### Fix 3: Check Database
```sql
-- Check if notifications are being created
SELECT * FROM notifications 
WHERE created_at > NOW() - INTERVAL 1 HOUR 
ORDER BY created_at DESC 
LIMIT 10;
```

### Fix 4: Restart Both Servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Expected Console Output

### When Page Loads (Admin):
```
🔌 [SOCKET EVENTS] Setting up centralized socket event listeners
🔌 [SOCKET EVENTS] This should only appear ONCE per app instance
🔌 [SOCKET EVENTS] Registering event listeners...
✅ [SOCKET EVENTS] All event listeners registered
✅ [SOCKET EVENTS] Socket connected
```

### When User Submits Report:

**Backend Console:**
```
Creating notifications for new report 123
Created 2 notifications for admins
Created 1 notifications for staff
Emitted report:new to role admin
Emitted report:new to role staff
```

**Admin Frontend Console:**
```
🔔 [SOCKET EVENTS] notification:new received: {notification object}
🔔 [SOCKET EVENTS] report:new received: {report object}
🔔 [SOCKET EVENTS] Showing toast for report: 123 Test Report
```

**Admin Screen:**
- Toast notification appears: "New report submitted: Test Report"
- Notification bell badge shows "1"
- Clicking bell shows notification in dropdown

## Common Issues

### Issue: "Socket connected" but no events received
**Solution:** User may not be in correct room. Check:
```javascript
// Backend logs should show:
User 5 joined role room: admin
```

### Issue: Events received but no toast
**Solution:** Check if toast library is working:
```javascript
// In browser console:
import toast from 'react-hot-toast';
toast.success('Test');
```

### Issue: Toast works but bell is empty
**Solution:** Check API endpoint:
```javascript
// In browser console:
fetch('http://localhost:5000/api/notifications', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log);
```

## Next Steps

Please provide:
1. **Browser console output** (full logs from page load to report submission)
2. **Backend console output** (logs when report is created)
3. **Network tab screenshot** (showing WebSocket and API requests)
4. **What you see on screen** (toast? bell count? dropdown content?)

This will help identify exactly where the notification flow is breaking.
