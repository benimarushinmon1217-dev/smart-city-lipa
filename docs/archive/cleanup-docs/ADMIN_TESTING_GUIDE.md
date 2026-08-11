# 🧪 Admin System Testing Guide

## Quick Start - 5 Minute Validation

### 1. Login & Access
```
1. Go to http://localhost:5173/login
2. Login with: ramoelnylbriones0909@gmail.com
3. Navigate to /admin
4. ✅ Dashboard should load without errors
```

### 2. Test Quick Actions (Critical Fix)
```
From Admin Dashboard, click each Quick Action button:

✅ "Send Alert" → Should navigate to /admin/broadcast
✅ "Manage Users" → Should navigate to /admin/users  
✅ "Update Shelters" → Should navigate to /admin/shelters
✅ "View Analytics" → Should navigate to /admin/analytics

All buttons should route correctly (no dead links)
```

### 3. Test Incident Routing
```
From Admin Dashboard Live Incident Feed:

✅ Click any incident → Should navigate to /incidents/{id}
✅ Incident details page should load
✅ No errors in console

This was already working - just verifying it still works
```

### 4. Test Sidebar Navigation
```
Click each admin menu item in sidebar:

✅ Admin Dashboard → /admin
✅ User Management → /admin/users
✅ Incident Management → /admin/incidents
✅ Shelter Management → /admin/shelters (NEW)
✅ Emergency Broadcast → /admin/broadcast (NEW)
✅ Analytics → /admin/analytics (NEW)

All should load their respective pages
```

### 5. Verify Console
```
✅ Open browser DevTools (F12)
✅ Check Console tab
✅ Should see no errors
✅ Warnings are okay (React Query, etc.)
```

---

## Full Feature Testing - 30 Minutes

### Analytics Page (`/admin/analytics`)

**Access:** Click "View Analytics" from Quick Actions or sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ 4 metric cards display at top
3. ✅ Time range dropdown works (24h, 7d, 30d, 90d, all)
4. ✅ Export button shows alert (functionality coming soon)
5. ✅ Chart placeholders display
6. ✅ System performance section shows

**Expected:** Page displays with placeholder charts and metrics

---

### Shelter Management (`/admin/shelters`)

**Access:** Click "Update Shelters" from Quick Actions or sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ Shelter list displays
3. ✅ 4 statistics cards show at top
4. ✅ Search input works
5. ✅ Status filter dropdown works
6. ✅ Click "Update Capacity" on a shelter → Prompt appears
7. ✅ Click "Update Occupancy" → Prompt appears
8. ✅ Click "Update Status" → Prompt appears
9. ✅ Occupancy bars display correctly
10. ✅ "Add Shelter" button shows alert (form coming soon)

**Expected:** Full shelter management interface with working updates

---

### Emergency Broadcast (`/admin/broadcast`)

**Access:** Click "Send Alert" from Quick Actions or sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ Broadcast form displays
3. ✅ Alert type dropdown works
4. ✅ Priority dropdown works
5. ✅ Title input accepts text
6. ✅ Message textarea accepts text
7. ✅ Target radio buttons work
8. ✅ Barangay ID input shows when "Specific Barangay" selected
9. ✅ Preview panel updates in real-time
10. ✅ Recent broadcasts section displays
11. ✅ Guidelines section shows
12. ✅ Click "Send" → Confirmation dialog appears
13. ✅ Confirm → Alert sends (or shows error if API not ready)

**Expected:** Full broadcast system with live preview and validation

---

### User Management (`/admin/users`)

**Access:** Click "Manage Users" from Quick Actions or sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ User list displays
3. ✅ 4 statistics cards show
4. ✅ Search input works
5. ✅ Role filter works
6. ✅ Status filter works
7. ✅ Click role badge → Prompt to change role
8. ✅ Click activate/deactivate → Confirmation dialog
9. ✅ Click delete → Confirmation dialog
10. ✅ Pagination works (if multiple pages)

**Expected:** Full user management with working actions

---

### Incident Management (`/admin/incidents`)

**Access:** Click "Incident Management" from sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ Incident list displays
3. ✅ 4 statistics cards show
4. ✅ Search input works
5. ✅ Status filter works
6. ✅ Severity filter works
7. ✅ Click eye icon → Routes to incident details
8. ✅ Click verify (if pending) → Confirmation dialog
9. ✅ Click delete → Confirmation dialog
10. ✅ Pagination works (if multiple pages)

**Expected:** Full incident management with working actions

---

### Admin Dashboard (`/admin`)

**Access:** Navigate to /admin or click "Admin Dashboard" in sidebar

**Test:**
1. ✅ Page loads without errors
2. ✅ 5 metric cards display
3. ✅ Active Alerts Panel shows (may be empty)
4. ✅ Live Incident Feed shows incidents
5. ✅ Click incident → Routes to details
6. ✅ Hazard Statistics shows (may show loading)
7. ✅ Emergency Broadcast form displays
8. ✅ Moderation Queue shows pending reports
9. ✅ Shelter Monitoring shows shelters
10. ✅ System Status shows connection indicators
11. ✅ Quick Actions all route correctly
12. ✅ Real-time updates work (create incident in another tab)

**Expected:** Full dashboard with all components functional

---

## Component-Level Testing

### Quick Actions Component
```javascript
Location: AdminDashboard.jsx (right sidebar)

Test each button:
✅ Send Alert → /admin/broadcast
✅ Manage Users → /admin/users
✅ Update Shelters → /admin/shelters
✅ View Analytics → /admin/analytics

All should be clickable links (not dead buttons)
```

### Live Incident Feed
```javascript
Location: AdminDashboard.jsx (main content)

Test:
✅ Incidents display
✅ Click incident title → Routes to /incidents/{id}
✅ "View All Incidents" → Routes to /incidents
✅ Real-time indicator shows
✅ Severity badges display correctly
```

### Moderation Queue
```javascript
Location: AdminDashboard.jsx (right sidebar)

Test:
✅ Pending reports display
✅ Click report → Expands
✅ Verify button works
✅ Reject button works
✅ "View All" link works
```

### Shelter Monitoring
```javascript
Location: AdminDashboard.jsx (right sidebar)

Test:
✅ Shelters display
✅ Occupancy bars show
✅ Status badges correct
✅ "Manage" button → Routes to /admin/shelters
✅ "View All Shelters" → Routes to /admin/shelters
```

---

## Navigation Testing

### Sidebar Navigation
```
Main Navigation (All Users):
✅ Dashboard → /dashboard
✅ Map View → /map
✅ Incidents → /incidents
✅ Reports → /reports
✅ Emergency Hotlines → /emergency/hotlines
✅ Notifications → /notifications

Admin Navigation (Admin Only):
✅ Admin Dashboard → /admin
✅ User Management → /admin/users
✅ Incident Management → /admin/incidents
✅ Shelter Management → /admin/shelters
✅ Emergency Broadcast → /admin/broadcast
✅ Analytics → /admin/analytics

Footer:
✅ Settings → /settings
```

### Breadcrumb Navigation
```
Test back navigation:
✅ From any admin page → Click browser back
✅ Should return to previous page
✅ No broken states
```

---

## Error Handling Testing

### Protected Routes
```
Test without admin role:
1. Logout
2. Login as regular user
3. Try to access /admin
4. ✅ Should redirect to /dashboard
5. ✅ Admin navigation should not show in sidebar
```

### 404 Handling
```
Test invalid routes:
1. Navigate to /admin/invalid-page
2. ✅ Should show 404 page or redirect
3. ✅ No console errors
```

### API Failures
```
Test with backend down:
1. Stop backend server
2. Navigate to /admin
3. ✅ Components should show loading/empty states
4. ✅ No crashes
5. ✅ Graceful error messages
```

---

## Real-Time Testing

### Socket.io Integration
```
Test real-time updates:
1. Open /admin in one tab
2. Open /incidents/new in another tab
3. Create a new incident
4. ✅ Admin dashboard should update automatically
5. ✅ Live Incident Feed should show new incident
6. ✅ Metric cards should update
```

---

## Performance Testing

### Page Load Times
```
Test each admin page:
✅ /admin - Should load < 2 seconds
✅ /admin/users - Should load < 2 seconds
✅ /admin/incidents - Should load < 2 seconds
✅ /admin/shelters - Should load < 2 seconds
✅ /admin/broadcast - Should load < 2 seconds
✅ /admin/analytics - Should load < 2 seconds
```

### Interaction Responsiveness
```
Test button clicks:
✅ Buttons respond immediately
✅ No lag on navigation
✅ Forms submit quickly
✅ Dropdowns open instantly
```

---

## Browser Compatibility

### Test in Multiple Browsers
```
✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari (if on Mac)

All features should work consistently
```

### Responsive Design
```
Test at different screen sizes:
✅ Desktop (1920x1080)
✅ Laptop (1366x768)
✅ Tablet (768x1024)
✅ Mobile (375x667)

Admin pages should be responsive
```

---

## Security Testing

### Authentication
```
Test auth flow:
1. ✅ Cannot access /admin without login
2. ✅ Cannot access /admin without admin role
3. ✅ Proper redirects on unauthorized access
4. ✅ Session persists on refresh
```

### Authorization
```
Test role-based access:
1. ✅ Regular users cannot see admin navigation
2. ✅ Regular users redirected from /admin routes
3. ✅ Admin users can access all admin features
```

---

## Regression Testing

### Previously Working Features
```
Verify these still work after changes:
✅ User dashboard
✅ Incident list
✅ Incident details
✅ Report creation
✅ Map view
✅ Emergency hotlines
✅ Notifications
✅ Profile settings
```

---

## Known Issues & Limitations

### Placeholder Features
```
These show placeholders (expected):
⏳ Active Alerts Panel - Shows "No active alerts"
⏳ Hazard Statistics - Shows "Loading statistics..."
⏳ Analytics Charts - Shows placeholder graphics

These are NOT bugs - they're waiting for backend implementation
```

### Future Enhancements
```
Features marked "coming soon":
⏳ Add Shelter form
⏳ Export analytics data
⏳ Chart visualizations
⏳ Advanced filters

These will be implemented in future updates
```

---

## Troubleshooting

### If Quick Actions Don't Work
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check console for errors
4. Verify you're on latest code
```

### If Pages Don't Load
```
1. Check backend is running (port 5000)
2. Check frontend is running (port 5173)
3. Verify admin role in database
4. Check browser console for errors
```

### If Real-Time Updates Don't Work
```
1. Check Socket.io connection in System Status
2. Verify backend Socket.io is running
3. Check browser console for Socket errors
4. Try refreshing the page
```

---

## Success Criteria

### All Tests Pass ✅
- [ ] All Quick Actions route correctly
- [ ] All sidebar links work
- [ ] All new pages load
- [ ] All forms submit
- [ ] All buttons respond
- [ ] No console errors
- [ ] Real-time updates work
- [ ] Protected routes enforce auth
- [ ] Responsive design works
- [ ] Performance is acceptable

### System is Production Ready ✅
- [ ] No dead links
- [ ] No broken routes
- [ ] No undefined handlers
- [ ] No placeholder buttons
- [ ] No disconnected components
- [ ] Graceful error handling
- [ ] Proper loading states
- [ ] Confirmation dialogs present
- [ ] Security measures active
- [ ] Documentation complete

---

## Reporting Issues

### If You Find a Bug

**Include:**
1. What you were doing
2. What you expected
3. What actually happened
4. Browser and version
5. Console errors (screenshot)
6. Steps to reproduce

**Example:**
```
Issue: Quick Action button doesn't work
Steps:
1. Navigate to /admin
2. Click "Send Alert" button
3. Expected: Navigate to /admin/broadcast
4. Actual: Nothing happens
Browser: Chrome 120
Console: [error message here]
```

---

## Quick Reference

### Admin Routes
```
/admin                → Dashboard
/admin/users          → User Management
/admin/incidents      → Incident Management
/admin/shelters       → Shelter Management
/admin/broadcast      → Emergency Broadcast
/admin/analytics      → Analytics
```

### Test Account
```
Email: ramoelnylbriones0909@gmail.com
Role: admin
```

### Expected Behavior
```
✅ All routes load
✅ All buttons work
✅ All forms submit
✅ No console errors
✅ Real-time updates
✅ Graceful fallbacks
```

---

**Last Updated:** Context Transfer Session  
**Status:** Ready for Testing  
**Estimated Test Time:** 5-30 minutes depending on depth
