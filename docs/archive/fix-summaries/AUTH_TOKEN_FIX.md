# Fix 401 Unauthorized Errors

## ✅ Map Error Fixed!

The MapContainer error has been fixed. The issue was incorrect property names in MAP_CONFIG references.

**Fixed**:
- `MAP_CONFIG.center` → `MAP_CONFIG.CENTER`
- `MAP_CONFIG.defaultZoom` → `MAP_CONFIG.DEFAULT_ZOOM`
- `MAP_CONFIG.tileLayer` → `MAP_CONFIG.TILE_LAYER.url`
- `MAP_CONFIG.attribution` → `MAP_CONFIG.TILE_LAYER.attribution`
- `MAP_CONFIG.maxZoom` → `MAP_CONFIG.MAX_ZOOM`
- `MAP_CONFIG.minZoom` → `MAP_CONFIG.MIN_ZOOM`

---

## 🔐 Fix 401 Unauthorized Errors

You're seeing these errors because your authentication token needs to be refreshed:

```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

### Quick Fix (Option 1): Clear Storage and Re-login

1. **Open Browser Console** (F12)
2. **Run this command**:
   ```javascript
   localStorage.clear();
   ```
3. **Refresh the page** (F5)
4. **Log in again** with your credentials:
   - Email: ramoelnylbriones0909@gmail.com
   - Password: [your password]

### Alternative Fix (Option 2): Use Logout Button

1. **Click your profile icon** in the navbar
2. **Click "Logout"**
3. **Log back in** with your credentials

---

## ✅ What Should Work Now

After refreshing your browser, you should see:

### Socket Connection ✅
```
Socket connected: [socket-id]
```
- No CORS errors
- No "removeAllListeners" errors

### Map Display ✅
- Map should load without errors
- Lipa City center displayed
- Barangay boundaries visible
- Incident markers shown

### Components ✅
- NotificationBell in navbar
- AIAdvisorWidget working
- No error boundaries triggered

---

## 🔍 Verify Everything Works

### 1. Check Console (F12)
Should see:
- ✅ "Socket connected: [socket-id]"
- ✅ No red errors
- ✅ API calls returning 200 status

### 2. Check LocalStorage
DevTools → Application → Local Storage → http://localhost:5174

Should have:
- ✅ `access_token` (JWT string)
- ✅ `refresh_token` (JWT string)
- ✅ `user` (JSON object)

### 3. Check Network Tab
DevTools → Network → Filter by "api"

Should see:
- ✅ Status 200 for API calls
- ✅ Authorization header present: `Bearer [token]`

---

## 🎯 Current Status

### Fixed Issues ✅
1. ✅ Socket.io CORS error
2. ✅ Missing removeAllListeners method
3. ✅ MapContainer property name errors

### Remaining Action Required
- 🔄 **Clear localStorage and re-login** to fix 401 errors

---

## 📝 Step-by-Step Instructions

### Complete Fix Process:

1. **Open Browser Console** (Press F12)

2. **Clear localStorage**:
   ```javascript
   localStorage.clear();
   ```

3. **Refresh page** (Press F5)

4. **You'll be redirected to login page**

5. **Log in with**:
   - Email: ramoelnylbriones0909@gmail.com
   - Password: [your password]

6. **After login, check**:
   - Map loads correctly
   - No errors in console
   - Notifications work
   - All components display

---

## 🎉 Expected Result

After completing these steps:

- ✅ No 401 errors
- ✅ Map displays correctly
- ✅ Socket connected
- ✅ Real-time updates working
- ✅ All API calls successful
- ✅ Full application functionality

---

## 🆘 If Issues Persist

### Check Backend Logs
Look at the terminal running backend for any errors

### Check Token in Console
```javascript
console.log(localStorage.getItem('access_token'));
// Should show a long JWT string
```

### Verify API Calls
Network tab should show:
- Request Headers include: `Authorization: Bearer [token]`
- Response status: 200 (not 401)

### Still Having Issues?
Refer to `TROUBLESHOOTING_GUIDE.md` for comprehensive solutions

---

**Quick Summary**: 
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Log in again
4. Everything should work! 🚀
