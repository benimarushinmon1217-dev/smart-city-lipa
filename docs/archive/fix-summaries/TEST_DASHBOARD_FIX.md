# Test Dashboard Fix - Quick Guide

## 🎯 What Was Fixed

**Problem**: Dashboard showing "Active Incidents: 0" despite 10 incidents in database  
**Cause**: React Query hooks extracting data from wrong property  
**Solution**: Fixed data extraction in `useIncidents` and `useReports` hooks

## ✅ Quick Test Steps

### Step 1: Open Dashboard
```
Navigate to: http://localhost:5173/dashboard
```

### Step 2: Check Statistics Cards
You should now see:
- ✅ **Active Incidents**: 8 (not 0)
- ✅ **Pending Reports**: (actual count)
- ✅ **High Risk Areas**: (actual count)
- ✅ **Unread Notifications**: (actual count)

### Step 3: Check Recent Incidents Section
You should see:
- ✅ List of 5 recent incidents
- ✅ Each incident shows:
  - Title
  - Time ago (e.g., "2 hours ago")
  - Severity badge (high/medium/low)
  - Status badge (reported/verified/responding/resolved)
  - View button

### Step 4: Check Browser Console
Open DevTools (F12) and look for these logs:
```
🔍 [DASHBOARD] Incidents data: Array(10)
🔍 [DASHBOARD] Is loading: false
🔍 [DASHBOARD] Incidents length: 10
🔍 [DASHBOARD] Active incidents count: 8
```

## 🧪 Test Real-Time Updates

### Test A: Create New Incident
1. Keep dashboard open in one tab
2. Open new tab: `http://localhost:5173/incidents/new`
3. Fill out form:
   - Type: Flood
   - Title: "Test Flood Incident"
   - Description: "Testing real-time updates"
   - Severity: High
   - Barangay: (select any)
   - Location: (click map or enter coordinates)
4. Click "Report Incident"
5. **Expected Result**:
   - ✅ Success toast appears
   - ✅ Switch to dashboard tab
   - ✅ Active Incidents count increases (8 → 9)
   - ✅ New incident appears in Recent Incidents list
   - ✅ **NO PAGE REFRESH NEEDED**

### Test B: Create New Report
1. Keep dashboard open in one tab
2. Open new tab: `http://localhost:5173/reports/new`
3. Fill out form:
   - Type: (select any)
   - Title: "Test Report"
   - Description: "Testing real-time updates"
   - Barangay: (select any - dropdown should be visible!)
   - Location: (enter location)
4. Click "Submit Report"
5. **Expected Result**:
   - ✅ Success toast appears
   - ✅ Switch to dashboard tab
   - ✅ Pending Reports count increases
   - ✅ **NO PAGE REFRESH NEEDED**

## 🔍 Verify Other Pages

### Incidents Page
```
Navigate to: http://localhost:5173/incidents
```
**Expected**:
- ✅ Table shows all 10 incidents
- ✅ Each row has complete data
- ✅ Filters work (status, severity, type)
- ✅ Pagination visible if needed

### Reports Page
```
Navigate to: http://localhost:5173/reports
```
**Expected**:
- ✅ List shows all reports
- ✅ Status filter works
- ✅ Create Report button works
- ✅ Form has barangay selector

### Map View
```
Navigate to: http://localhost:5173/map
```
**Expected**:
- ✅ Map loads with markers
- ✅ Markers are color-coded by severity:
  - 🔴 Red = High severity
  - 🟡 Yellow = Medium severity
  - 🟢 Green = Low severity
- ✅ Clicking marker shows incident details
- ✅ Incident list on left shows all incidents

## ❌ What to Look For (Problems)

### If Dashboard Still Shows 0:
1. Check browser console for errors
2. Check if backend is running: `http://localhost:5000/api/health`
3. Check debug logs in console
4. Verify you're logged in

### If Real-Time Updates Don't Work:
1. Check browser console for socket connection logs:
   ```
   🔌 [SOCKET] Connecting to: http://localhost:5000
   ✅ [SOCKET] Connected successfully
   ```
2. Check backend console for emission logs:
   ```
   🔥 [INCIDENT SERVICE] About to emit incident:new
   📡 [SOCKET] Broadcasting incident:new to X clients
   ```
3. Verify Socket.io is connected (check Network tab in DevTools)

### If Data Looks Wrong:
1. Verify database has data:
   ```bash
   # In backend directory
   npm run seed
   ```
2. Check API directly:
   ```
   http://localhost:5000/api/incidents
   ```
3. Check if filters are applied unintentionally

## 🎉 Success Criteria

✅ Dashboard shows correct counts (not zeros)  
✅ Recent incidents list is populated  
✅ Incidents page shows all incidents  
✅ Reports page shows all reports  
✅ Map shows incident markers  
✅ Creating incident updates dashboard instantly  
✅ Creating report updates dashboard instantly  
✅ No page refresh needed for updates  
✅ No errors in browser console  
✅ No errors in backend console  

## 📊 Expected Data

Based on your database:
- **Total Incidents**: 10 (IDs 1-10)
- **Active Incidents**: 8 (status: reported, verified, responding)
- **Resolved Incidents**: 2 (status: resolved)
- **Barangays**: 76 (all Lipa City barangays)

## 🔧 If Issues Persist

1. **Clear browser cache**:
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload page

2. **Restart frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Restart backend**:
   ```bash
   cd backend
   npm run dev
   ```

4. **Check logs**:
   - Browser console (F12)
   - Backend terminal
   - Look for error messages

5. **Verify authentication**:
   - Make sure you're logged in
   - Token should be in localStorage
   - Check Network tab for 401 errors

## 📝 Debug Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged in as: ramoelnylbriones0909@gmail.com
- [ ] Dashboard loads without errors
- [ ] Statistics show non-zero values
- [ ] Recent incidents list populated
- [ ] Browser console shows debug logs
- [ ] No red errors in console
- [ ] Socket.io connected
- [ ] Real-time updates work

## 🚀 After Testing

Once everything works:
1. Remove debug logs from `Dashboard.jsx` (lines 20-30)
2. Commit changes
3. Deploy to production (if ready)

---

**Fix Applied**: 2026-05-15  
**Files Modified**: 
- `frontend/src/hooks/useIncidents.js`
- `frontend/src/hooks/useReports.js`

**Status**: ✅ READY TO TEST
