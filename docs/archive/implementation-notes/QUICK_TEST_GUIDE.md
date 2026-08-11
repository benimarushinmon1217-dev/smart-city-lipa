# Quick Test Guide - 5 Minute Verification

## 🚀 Quick Start

### 1. Open Dashboard (30 seconds)
```
URL: http://localhost:5173/dashboard
```

**✅ Should See**:
- Active Incidents: **8** (not 0!)
- Pending Reports: (some number)
- Recent Incidents: List of 5 incidents

**❌ If Still 0**: Check browser console (F12) for errors

---

### 2. Test Incidents Page (30 seconds)
```
URL: http://localhost:5173/incidents
```

**✅ Should See**:
- Table with **10 incidents**
- Each row has: title, type, severity, status, barangay, date

**❌ If Empty**: Check if logged in, check console for errors

---

### 3. Test Real-Time Update (2 minutes)

**Step 1**: Keep dashboard open
**Step 2**: Open new tab → `http://localhost:5173/incidents/new`
**Step 3**: Fill form quickly:
- Type: Flood
- Title: "Test"
- Description: "Test"
- Severity: High
- Barangay: (any)
- Click map for location

**Step 4**: Submit

**✅ Expected**:
- Success toast ✅
- Switch to dashboard tab
- Active Incidents: **9** (increased!) ✅
- New incident in Recent list ✅
- **NO REFRESH NEEDED** ✅

---

### 4. Test Report Form (1 minute)
```
URL: http://localhost:5173/reports/new
```

**✅ Should See**:
- Barangay dropdown with 76 options
- All form fields present

**Try Submit**:
- Fill all fields
- Select barangay
- Submit

**✅ Expected**:
- Success toast
- No errors

---

### 5. Test Map View (30 seconds)
```
URL: http://localhost:5173/map
```

**✅ Should See**:
- Map with colored markers
- Red = High severity
- Yellow = Medium
- Green = Low
- Click marker → Shows details

---

## 🔍 Quick Debug

### Check Browser Console (F12)
**Should See**:
```
🔍 [DASHBOARD] Incidents data: Array(10)
🔍 [DASHBOARD] Incidents length: 10
🔍 [DASHBOARD] Active incidents count: 8
```

**Should NOT See**:
- ❌ Red error messages
- ❌ 401 Unauthorized
- ❌ 500 Server Error
- ❌ Network errors

### Check Backend Terminal
**Should See**:
```
Server running on port 5000
Database connected
Socket.io initialized
```

**When Creating Incident**:
```
🔥 [INCIDENT SERVICE] About to emit incident:new
📡 [SOCKET] Broadcasting incident:new to X clients
✅ [INCIDENT SERVICE] Event emitted successfully
```

---

## ✅ Success Checklist

- [ ] Dashboard shows 8 active incidents (not 0)
- [ ] Recent incidents list populated
- [ ] Incidents page shows 10 incidents
- [ ] Reports page has barangay selector
- [ ] Map shows incident markers
- [ ] Creating incident updates dashboard instantly
- [ ] No errors in console
- [ ] Real-time updates work (<1 second)

---

## ❌ If Something's Wrong

### Dashboard Still Shows 0
1. Hard refresh: Ctrl+Shift+R
2. Check if logged in
3. Check backend is running: `http://localhost:5000/api/health`
4. Check console for errors

### Real-Time Not Working
1. Check socket connection in console:
   ```
   ✅ [SOCKET] Connected successfully
   ```
2. Check backend logs for emissions
3. Restart both frontend and backend

### Report Form Missing Barangay
1. Hard refresh page
2. Check console for errors
3. Verify barangays in database

---

## 🎯 Expected Numbers

Based on your database:
- **Total Incidents**: 10
- **Active Incidents**: 8
- **Resolved Incidents**: 2
- **Barangays**: 76

---

## 📞 Quick Fixes

### Restart Everything
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Clear Cache
- Press: Ctrl+Shift+Delete
- Clear: Cached images and files
- Reload page

### Re-login
- Logout
- Login again with: ramoelnylbriones0909@gmail.com

---

## 🎉 All Good?

If all checks pass:
1. ✅ System is working!
2. Remove debug logs from Dashboard.jsx (optional)
3. Start using the system normally

---

**Time to Complete**: ~5 minutes  
**Status**: Ready to test  
**Last Updated**: 2026-05-15
