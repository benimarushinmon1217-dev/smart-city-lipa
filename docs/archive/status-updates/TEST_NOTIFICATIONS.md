# Test Notifications - Step by Step

## Test 1: Check if Backend is Running

1. Open browser and go to: `http://localhost:5000/api/health` or `http://localhost:5000`
2. **Expected:** Should see a response (not "Cannot connect")
3. **Result:** _______________

## Test 2: Check if Frontend is Running

1. Open browser and go to: `http://localhost:5173` (or your frontend port)
2. **Expected:** Should see the login page
3. **Result:** _______________

## Test 3: Login as Admin

1. Login with admin credentials
2. Open browser console (F12)
3. Look for these logs:
   ```
   🔌 [SOCKET EVENTS] Setting up centralized socket event listeners
   ✅ [SOCKET EVENTS] Socket connected
   ```
4. **Expected:** Should see socket connection logs
5. **Result:** _______________

## Test 4: Check Socket Connection in Console

1. While logged in as admin, open browser console
2. Type: `localStorage.getItem('user')`
3. **Expected:** Should show user object with `"role":"admin"`
4. **Result:** _______________

## Test 5: Check Notification Bell

1. Look at the top right of the screen
2. Find the bell icon (🔔)
3. Click on it
4. **Expected:** Should show dropdown (may be empty if no notifications)
5. **Result:** _______________

## Test 6: Submit a Report (as User)

1. Open a NEW browser window (or incognito mode)
2. Go to `http://localhost:5173`
3. Login as a REGULAR USER (not admin)
4. Navigate to "Reports" → "Create Report"
5. Fill out the form and submit
6. **Expected:** Should see success message
7. **Result:** _______________

## Test 7: Check Admin Receives Notification

1. Go back to the ADMIN browser window
2. Check browser console for:
   ```
   🔔 [SOCKET EVENTS] report:new received
   🔔 [SOCKET EVENTS] Showing toast for report
   ```
3. Check if toast notification appears on screen
4. Check if notification bell badge shows "1"
5. Click bell and check if notification appears in dropdown
6. **Expected:** Should see toast + bell notification
7. **Result:** _______________

## Test 8: Check Backend Logs

1. Go to your terminal where backend is running
2. Look for logs when report was submitted:
   ```
   Creating notifications for new report [id]
   Created [X] notifications for admins
   Emitted report:new to role admin
   ```
3. **Expected:** Should see notification creation logs
4. **Result:** _______________

## Test 9: Check Database

1. Open your database tool (MySQL Workbench, phpMyAdmin, etc.)
2. Run this query:
   ```sql
   SELECT * FROM notifications 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
3. **Expected:** Should see notifications in database
4. **Result:** _______________

## Test 10: Manual Socket Test

1. In admin browser console, type:
   ```javascript
   // Check if socket service exists
   console.log(window.socketService);
   ```
2. **Expected:** Should show socket service object
3. **Result:** _______________

## Troubleshooting Based on Results

### If Test 3 FAILS (No socket connection logs):
- `useSocketEvents` hook is not running
- Check if `App.jsx` has `useSocketEvents()` call
- Check for JavaScript errors in console

### If Test 6 SUCCEEDS but Test 7 FAILS (No notification received):
- Socket event not being emitted from backend
- Check backend logs (Test 8)
- User may not be in `role:admin` room

### If Test 7 Console Shows Events but No Toast:
- Toast library not working
- Try manual toast test:
  ```javascript
  import toast from 'react-hot-toast';
  toast.success('Test notification');
  ```

### If Toast Works but Bell is Empty (Test 5):
- Database notifications not created (check Test 9)
- API endpoint failing (check Network tab)
- Query not refetching

## Quick Fixes

### Fix 1: Restart Backend
```bash
cd backend
# Stop current process (Ctrl+C)
npm run dev
```

### Fix 2: Restart Frontend
```bash
cd frontend
# Stop current process (Ctrl+C)
npm run dev
```

### Fix 3: Clear Browser Cache
1. Open browser console
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 4: Check Environment Variables
```bash
# In backend folder
cat .env

# Should have:
# JWT_SECRET=...
# DB_HOST=...
# DB_USER=...
# DB_PASSWORD=...
# DB_NAME=...
```

## Report Your Results

Please fill in the "Result" for each test above and share:
1. Which tests PASSED ✅
2. Which tests FAILED ❌
3. Any error messages you see
4. Screenshots of console logs

This will help identify exactly where the issue is!
