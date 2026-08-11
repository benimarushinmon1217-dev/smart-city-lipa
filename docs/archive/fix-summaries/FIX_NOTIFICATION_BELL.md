# Fix Notification Bell - Debugging Steps

## Issue
Notification bell does NOT show count or notifications when clicked.

## What I Added
Added detailed logging to backend to track notification queries:
- `backend/services/notificationService.js` - Logs when fetching notifications
- `backend/controllers/notificationController.js` - Logs API requests

## Testing Steps

### Step 1: Restart Backend
```bash
cd backend
# Stop current process (Ctrl+C)
npm run dev
```

**IMPORTANT:** Backend MUST be restarted for logging changes to take effect!

### Step 2: Login as Admin
1. Open browser and go to `http://localhost:5173`
2. Login with admin credentials
3. Open browser console (F12)
4. Open Network tab

### Step 3: Click Notification Bell
1. Click the bell icon in the header
2. Watch the backend console for logs
3. Watch the browser Network tab for API requests

### Expected Backend Logs:
```
📋 [NOTIFICATION CONTROLLER] GET /notifications - User: [id] [email]
📋 [NOTIFICATION CONTROLLER] Query params: { page: '1', limit: '20', unreadOnly: undefined }
📋 [NOTIFICATION SERVICE] Getting notifications for user: [id]
📋 [NOTIFICATION SERVICE] Query options: { page: 1, limit: 20, unreadOnly: false, where: { user_id: [id] } }
📋 [NOTIFICATION SERVICE] Found [X] notifications for user [id]
📋 [NOTIFICATION SERVICE] Returning [X] notifications
📋 [NOTIFICATION CONTROLLER] Returning [X] notifications
```

AND

```
📋 [NOTIFICATION CONTROLLER] GET /notifications/unread-count - User: [id] [email]
📋 [NOTIFICATION SERVICE] Getting unread count for user: [id]
📋 [NOTIFICATION SERVICE] Unread count for user [id]: [X]
📋 [NOTIFICATION CONTROLLER] Returning unread count: [X]
```

### Step 4: Check Network Tab
Look for these requests:
1. `GET http://localhost:5000/api/v1/notifications`
2. `GET http://localhost:5000/api/v1/notifications/unread-count`

**Check the response:**
- Status should be `200 OK`
- Response should have `success: true`
- Response should have `data` array with notifications

### Step 5: Submit a Report (as User)
1. Open NEW browser window (incognito mode)
2. Login as regular user
3. Submit a new report
4. Go back to admin window
5. Click notification bell again
6. Check backend logs

## What to Look For

### Scenario A: No API Requests in Network Tab
**Problem:** Frontend not calling API
**Solution:** Check `useNotifications` hook is being used

### Scenario B: API Request Returns 401 Unauthorized
**Problem:** User not authenticated
**Solution:** Check token in localStorage

### Scenario C: API Request Returns Empty Array
**Problem:** No notifications in database
**Solution:** Check if notifications are being created when reports are submitted

### Scenario D: API Request Returns Data but Bell is Empty
**Problem:** Frontend not displaying data
**Solution:** Check `NotificationBell` component

## Quick Database Check

Run this SQL query to check if notifications exist:

```sql
SELECT 
    n.id,
    n.user_id,
    n.title,
    n.message,
    n.is_read,
    n.created_at,
    u.email,
    u.role
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE u.role IN ('admin', 'staff')
ORDER BY n.created_at DESC
LIMIT 10;
```

**Expected:** Should see notifications for admin/staff users

## What to Report

Please provide:

1. **Backend console output** when you click the bell:
   ```
   [Paste backend logs here]
   ```

2. **Network tab screenshot** showing:
   - Request URL
   - Status code
   - Response data

3. **Database query result:**
   ```
   [Paste SQL query results here]
   ```

4. **Browser console errors** (if any):
   ```
   [Paste any errors here]
   ```

## Common Issues

### Issue 1: "Found 0 notifications"
**Cause:** Notifications not being created in database
**Next Step:** Check if `notificationService.notifyByRole()` is being called when reports are submitted

### Issue 2: "401 Unauthorized"
**Cause:** Token expired or invalid
**Next Step:** Logout and login again

### Issue 3: No backend logs appear
**Cause:** Backend not restarted after code changes
**Next Step:** Restart backend server

### Issue 4: API returns data but bell shows "No notifications"
**Cause:** Frontend not parsing response correctly
**Next Step:** Check `useNotifications` hook and `NotificationBell` component

## Next Steps

After restarting backend and clicking the bell, share:
1. Backend console logs
2. Network tab response
3. Any errors you see

This will tell us exactly where the problem is!
