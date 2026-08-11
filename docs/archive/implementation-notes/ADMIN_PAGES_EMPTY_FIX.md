# Admin Pages Showing Empty Data - Quick Fix Guide

## Issues Identified

### 1. API Endpoint Mismatch
**Frontend calls:** `/admin/stats`
**Backend has:** `/admin/dashboard`

### 2. Emergency Broadcast
- Backend needs restart after model association fix
- Announcement model associations were added but server not restarted

### 3. Admin Edit Permissions
- Permission logic is correct
- Added console logging to debug

## Quick Fixes

### Fix 1: Update API Endpoint
**File:** `frontend/src/config/api.config.js`

Change:
```javascript
STATS: '/admin/stats',
```

To:
```javascript
STATS: '/admin/dashboard',
```

### Fix 2: Restart Backend Server
```bash
cd backend
# Press Ctrl+C to stop
npm start
```

### Fix 3: Check Browser Console
Open incident details page and check console for permission debug info.

## Testing Steps

1. **Restart backend server** (CRITICAL!)
2. **Refresh admin pages:**
   - User Management
   - Incident Management  
   - Report Management
   - Shelter Management
3. **Test emergency broadcast**
4. **Test admin editing other user's incident**

## Expected Results After Fix

- ✅ User Management shows all users
- ✅ Incident Management shows all incidents
- ✅ Report Management shows all reports
- ✅ Shelter Management shows all shelters
- ✅ Emergency broadcast works
- ✅ Admin can edit any incident
- ✅ Regular users can only edit their own incidents
