# Emergency Alert - Simple Fix & Test

## The Problem
The emergency alert modal is not appearing for users or admins when broadcasts are sent.

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. **Refresh browser** (Ctrl+Shift+R)
2. **Open console** (F12)
3. **Look for these logs:**
   ```
   🌐 [GLOBAL ALERT] Component mounted
   🧪 [TEST] Added window.testEmergencyAlert() function
   ```

**If you see these:** ✅ Component is loaded
**If you don't see these:** ❌ Component failed to load - check for errors

### Step 2: Test Component Directly
**In browser console, type:**
```javascript
window.testEmergencyAlert()
```

**Expected:** Red flashing modal with siren sound

**If modal appears:** ✅ Component works! Issue is with socket events
**If modal doesn't appear:** ❌ Component has an error

### Step 3: Check for Errors
**In browser console, look for:**
- Red error messages
- "Failed to compile" messages
- Import errors
- Syntax errors

**Common errors:**
- `Cannot find module './EmergencyAlertModal'`
- `Unexpected token`
- `X is not defined`

## Most Likely Issues

### Issue 1: Component Not Rendering
**Symptoms:** No console logs at all

**Fix:**
1. Check `App.jsx` has: `{isAuthenticated && <GlobalEmergencyAlert />}`
2. Make sure you're logged in
3. Hard refresh: Ctrl+Shift+R
4. Check browser console for errors

### Issue 2: Import Error
**Symptoms:** Error in console about imports

**Fix:**
1. Check `EmergencyAlertModal.jsx` exists in `components/` folder
2. Check import path is correct
3. Restart dev server

### Issue 3: Socket Not Connected
**Symptoms:** Component loads but events not received

**Fix:**
1. Check backend is running
2. Restart backend: `cd backend && node app.js`
3. Check console for: `✅ [SOCKET] Connected`

### Issue 4: Wrong Priority Value
**Symptoms:** Event received but modal doesn't show

**Fix:**
1. Check broadcast form uses `priority: 'urgent'` (NOT 'critical')
2. Check console shows: `Priority: urgent Type: emergency`

## Simple Test Page

Go to: `http://localhost:5173/test-alert`

This page has a button to manually trigger the modal without socket events.

**If button works:** Socket issue
**If button doesn't work:** Component issue

## Backend Check

**When you send a broadcast, backend console should show:**
```
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to X connected clients
```

**If X = 0:** No users connected
**If X > 0:** Users connected but not receiving

## Frontend Check

**When broadcast is sent, user console should show:**
```
📢 [GLOBAL ALERT] Announcement received: {...}
📢 [GLOBAL ALERT] Priority: urgent Type: emergency
🚨 [GLOBAL ALERT] Showing emergency modal
🚨 [GLOBAL ALERT] Rendering emergency modal with alert: {...}
```

## Quick Fix Checklist

- [ ] Backend is running (`http://localhost:5000`)
- [ ] Frontend is running (`http://localhost:5173`)
- [ ] User is logged in
- [ ] Browser console open (F12)
- [ ] No red errors in console
- [ ] Component mounted (see logs)
- [ ] `window.testEmergencyAlert()` works
- [ ] Socket connected (see `✅ [SOCKET] Connected`)
- [ ] Priority is `'urgent'` not `'critical'`
- [ ] Backend shows "Broadcasting to X clients" where X > 0

## What To Report

Please check and report:

1. **Console logs on page load:**
   - Do you see: `🌐 [GLOBAL ALERT] Component mounted`?
   - Do you see: `✅ [SOCKET] Connected`?
   - Any red errors?

2. **Test function:**
   - Run: `window.testEmergencyAlert()`
   - Does modal appear?

3. **Real broadcast:**
   - Send broadcast from admin
   - Backend shows: "Broadcasting to X clients" - what is X?
   - User console shows: "Announcement received"?

4. **Browser info:**
   - Which browser? (Chrome, Firefox, Edge?)
   - Any browser extensions blocking?
   - Try incognito mode?

## Nuclear Option: Fresh Start

If nothing works:

1. **Stop everything:**
   - Close all browser tabs
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)

2. **Clear cache:**
   - Browser: Ctrl+Shift+Delete → Clear cache
   - Or use incognito mode

3. **Restart:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   node app.js

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Test again:**
   - Login
   - Open console
   - Run: `window.testEmergencyAlert()`

**OPEN CONSOLE (F12) AND TELL ME WHAT LOGS YOU SEE!**
