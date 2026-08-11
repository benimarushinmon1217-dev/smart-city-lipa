# 🚀 Quick Start - Admin Dashboard

## TL;DR - Start Here!

Your admin dashboard is ready. Here's what to do:

### 1. Access Dashboard
```
URL: http://localhost:5173/admin
Email: ramoelnylbriones0909@gmail.com
Password: [your password]
```

### 2. What You'll See
- ✅ Emergency Operations Center dashboard
- ✅ 5 metric cards at the top
- ✅ Live incident feed
- ✅ Moderation queue for reports
- ✅ Emergency broadcast panel
- ✅ System status indicators

### 3. What's Expected
- Some components show "No active alerts" or "Loading..." - **This is normal!**
- These are placeholder components waiting for backend endpoints
- They won't cause errors or crashes

---

## Quick Tests

### Test 1: View Dashboard (30 seconds)
```
1. Go to /admin
2. Verify page loads
3. Check no console errors
✅ Done!
```

### Test 2: Create Incident (1 minute)
```
1. Click "Report Incident" in sidebar
2. Fill form with any valid type
3. Submit
4. View incident details
✅ Should work perfectly!
```

### Test 3: Moderate Report (2 minutes)
```
1. Have another user create a report
2. Go to Admin Dashboard
3. See report in Moderation Queue
4. Click to select it
5. Click "Verify" or "Reject"
✅ Report processed!
```

---

## Valid Incident Types

Use these when creating incidents:
- `flood`, `fire`, `earthquake`, `landslide`, `typhoon`
- `volcanic_activity` ✅ (NOT 'volcanic')
- `traffic_accident` ✅ (NOT 'accident')
- `medical_emergency`, `other`

---

## If Something Goes Wrong

### Error: "Failed to load incident details"
→ You're viewing an old incident with invalid type. Create a new one.

### Error: Components not loading
→ Restart backend: `cd backend && npm start`
→ Restart frontend: `npm run dev`
→ Clear browser cache

### Error: "Unauthorized"
→ Verify you're logged in as admin
→ Check email: ramoelnylbriones0909@gmail.com

---

## Clean Database (Optional)

To remove test data:
```bash
cd backend
npm run wipe
```

Keeps: barangays, establishments, emergency contacts, your admin account  
Removes: incidents, reports, notifications, traffic data

---

## What's Working vs Placeholder

### ✅ Working (Backend Implemented)
- Critical metrics
- Live incident feed
- Moderation queue
- Emergency broadcast
- Shelter monitoring
- System status

### ⏳ Placeholder (Backend Not Yet Implemented)
- Active Alerts Panel → Shows "No active alerts"
- Hazard Statistics → Shows "Loading statistics..."

**Note:** Placeholders won't crash - they handle missing endpoints gracefully.

---

## Need More Details?

Read these files:
- `ADMIN_DASHBOARD_READY.md` - Complete guide
- `ADMIN_DASHBOARD_STATUS.md` - Detailed status
- `DATABASE_WIPE_GUIDE.md` - Database management

---

## Summary

✅ **Status:** Ready to use  
✅ **Action:** Go to /admin and test  
✅ **Expected:** Dashboard loads, no errors  
✅ **Support:** Share error messages if issues occur

**You're all set! 🎉**
