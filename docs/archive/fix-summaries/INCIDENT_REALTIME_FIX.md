# Incident Real-Time Update Fix

## Issue
When a user reported an incident successfully, it would not immediately appear in:
- Notifications page
- Incidents list page
- Main dashboard
- Map view

The incident was created in the database, but the UI didn't update until a manual page refresh.

## Root Cause
The backend was emitting Socket.io events to **specific rooms** (barangay rooms and role rooms) when incidents were created:
- `emitToBarangay(barangayId, 'incident:new', data)` - Only users subscribed to that barangay room
- `emitToRole('admin', 'incident:new', data)` - Only admin users
- `emitToRole('staff', 'incident:new', data)` - Only staff users

However, regular users were **not subscribed to barangay rooms**, so they never received the socket events.

The frontend had proper socket listeners set up in `useSocket.js` that would invalidate React Query cache when `incident:new` events were received, but the events never reached the frontend.

## Solution
Added **broadcast events** to emit incident updates to **all connected clients**, not just specific rooms.

### Changes Made

**File: `backend/services/incidentService.js`**

1. **Import broadcast function**:
   ```javascript
   const { emitToBarangay, emitToRole, broadcast } = require('../config/socket');
   ```

2. **Added broadcast in createIncident()** (line ~240):
   ```javascript
   // Broadcast to all connected clients so everyone sees the new incident
   broadcast('incident:new', {
       incident: completeIncident,
       message: `New ${incidentData.incident_type} incident reported`
   });
   ```

3. **Added broadcast in updateIncident()** (line ~285):
   ```javascript
   // Broadcast to all connected clients
   broadcast('incident:updated', {
       incident: updatedIncident,
       message: `Incident updated: ${incident.title}`
   });
   ```

4. **Added broadcast in verifyIncident()** (line ~330):
   ```javascript
   // Broadcast to all connected clients
   broadcast('incident:verified', {
       incident: verifiedIncident,
       message: `Incident verified: ${incident.title}`
   });
   ```

## How It Works Now

### Backend Flow:
1. User creates incident via POST `/api/incidents`
2. Incident is saved to database
3. Backend emits THREE socket events:
   - `emitToBarangay()` - To users subscribed to that barangay
   - `emitToRole()` - To admin/staff users
   - **`broadcast()` - To ALL connected clients** ✅ NEW

### Frontend Flow:
1. Frontend socket listener in `useSocket.js` receives `incident:new` event
2. Listener calls `queryClient.invalidateQueries(['incidents'])`
3. React Query automatically refetches all queries with key `['incidents']`
4. Components using `useIncidents()` hook automatically re-render with new data:
   - Dashboard (shows in recent incidents)
   - Incident List page (shows in list)
   - Map view (shows marker)
   - Notifications (if notification was created)

## Testing
1. ✅ Backend restarted successfully
2. ✅ Socket.io server initialized
3. ✅ Frontend socket connection established
4. 🔄 **Next: Create a new incident and verify it appears immediately in all views**

## Files Modified
- `backend/services/incidentService.js` - Added broadcast() calls for real-time updates

## Related Components
These components already have socket listeners and will automatically update:
- `frontend/src/hooks/useSocket.js` - Main socket listener with cache invalidation
- `frontend/src/pages/dashboard/Dashboard.jsx` - Uses useIncidents() hook
- `frontend/src/pages/incidents/IncidentList.jsx` - Uses useIncidents() hook
- `frontend/src/components/map/MapContainer.jsx` - Has incident:new listener
- `frontend/src/components/map/IncidentMarkers.jsx` - Displays incident markers
- `frontend/src/components/incidents/LiveIncidentFeed.jsx` - Has incident:new listener
- `frontend/src/pages/admin/AdminDashboard.jsx` - Has incident:new listener

## Expected Behavior
After this fix:
1. User reports incident → Success toast appears
2. **Immediately** (within 1 second):
   - Dashboard shows new incident in "Recent Incidents"
   - Incident List page shows new incident at top
   - Map view shows new incident marker
   - Other users see the incident appear in real-time
3. No page refresh needed!
