# 🧪 Testing Incident Reporting System

## Quick Test Guide

### Prerequisites
1. Backend server running (`npm run dev`)
2. MySQL database created and synced
3. At least one user registered
4. JWT token obtained from login

---

## Test Sequence

### 1. Register Test Users

```bash
# Register regular user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "user@test.com",
    "password": "Password123",
    "first_name": "Test",
    "last_name": "User",
    "phone": "09171234567"
  }'

# Register admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "email": "admin@test.com",
    "password": "Password123",
    "first_name": "Admin",
    "last_name": "User",
    "phone": "09187654321"
  }'
```

### 2. Set Admin Role (MySQL)

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
```

### 3. Login and Get Tokens

```bash
# Login as user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "Password123"
  }'

# Save the token from response
USER_TOKEN="<paste_token_here>"

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Password123"
  }'

# Save the token from response
ADMIN_TOKEN="<paste_token_here>"
```

---

## Incident Tests

### Test 1: Create Incident (User)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_type": "flood",
    "title": "Severe flooding in Barangay 12",
    "description": "Water level reached 3 feet and rising rapidly. Multiple families affected.",
    "severity": "high",
    "barangay_id": 1,
    "latitude": 13.9411,
    "longitude": 121.1628,
    "address": "Main Street, Barangay 12",
    "reporter_name": "Test User",
    "reporter_contact": "09171234567",
    "affected_families": 50,
    "affected_individuals": 200,
    "casualties": 0,
    "estimated_damage": 500000
  }'
```

**Expected Response:**
- Status: 201 Created
- Real-time event: `incident:new` to barangay room and admin/staff
- Incident status: "reported"
- is_verified: false

### Test 2: Get All Incidents (Public)

```bash
curl http://localhost:5000/api/incidents
```

**Expected Response:**
- Status: 200 OK
- List of incidents with pagination
- Includes reporter and barangay info

### Test 3: Get Incident by ID

```bash
curl http://localhost:5000/api/incidents/1
```

**Expected Response:**
- Status: 200 OK
- Complete incident details
- Reporter, barangay, and verifier info

### Test 4: Get Live Feed

```bash
curl http://localhost:5000/api/incidents/feed/live?limit=5
```

**Expected Response:**
- Status: 200 OK
- Recent active incidents (reported, verified, responding)

### Test 5: Verify Incident (Admin)

```bash
curl -X POST http://localhost:5000/api/incidents/1/verify \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "critical",
    "affected_families": 75,
    "affected_individuals": 300,
    "casualties": 0,
    "estimated_damage": 750000,
    "notes": "Verified by field inspection. Situation is critical."
  }'
```

**Expected Response:**
- Status: 200 OK
- Incident status: "verified"
- is_verified: true
- Real-time event: `incident:verified` to barangay and reporter

### Test 6: Update Incident Status (Admin)

```bash
curl -X PUT http://localhost:5000/api/incidents/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "responding",
    "resolution_notes": "Emergency response team deployed to the area."
  }'
```

**Expected Response:**
- Status: 200 OK
- Incident status: "responding"
- Real-time event: `incident:updated` to barangay

### Test 7: Reject Incident (Admin)

```bash
curl -X POST http://localhost:5000/api/incidents/2/reject \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Unable to verify incident. No evidence found at reported location."
  }'
```

**Expected Response:**
- Status: 200 OK
- Incident status: "closed"
- is_verified: false
- Real-time event: `incident:rejected` to reporter

### Test 8: Get Incident Statistics (Admin)

```bash
curl http://localhost:5000/api/incidents/stats/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- Total, verified, unverified counts
- Breakdown by type, severity, status

### Test 9: Filter Incidents

```bash
# Filter by type
curl "http://localhost:5000/api/incidents?incident_type=flood"

# Filter by severity
curl "http://localhost:5000/api/incidents?severity=high"

# Filter by status
curl "http://localhost:5000/api/incidents?status=verified"

# Filter by barangay
curl "http://localhost:5000/api/incidents?barangay_id=1"

# Search
curl "http://localhost:5000/api/incidents?search=flooding"

# Date range
curl "http://localhost:5000/api/incidents?start_date=2026-05-01&end_date=2026-05-31"

# Pagination
curl "http://localhost:5000/api/incidents?page=1&limit=10"

# Sort
curl "http://localhost:5000/api/incidents?sort_by=severity&sort_order=DESC"
```

---

## Report Tests

### Test 1: Create Report (User)

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "road_damage",
    "title": "Large pothole on Main Street",
    "description": "Dangerous pothole causing traffic issues and potential accidents.",
    "barangay_id": 1,
    "location": "Main Street near City Hall",
    "latitude": 13.9411,
    "longitude": 121.1628,
    "priority": "high",
    "is_anonymous": false,
    "contact_number": "09171234567"
  }'
```

**Expected Response:**
- Status: 201 Created
- Real-time event: `report:new` to admin/staff and barangay
- Report status: "pending"

### Test 2: Create Anonymous Report

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "illegal_activity",
    "title": "Suspicious activity reported",
    "description": "Suspicious activity observed in the area.",
    "location": "Near the park",
    "priority": "urgent",
    "is_anonymous": true
  }'
```

**Expected Response:**
- Status: 201 Created
- User info hidden for anonymous report

### Test 3: Get All Reports (User sees own)

```bash
curl http://localhost:5000/api/reports \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- Only reports created by the user

### Test 4: Get All Reports (Admin sees all)

```bash
curl http://localhost:5000/api/reports \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- All reports from all users

### Test 5: Assign Report (Admin)

```bash
curl -X POST http://localhost:5000/api/reports/1/assign \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assigned_to": 2
  }'
```

**Expected Response:**
- Status: 200 OK
- Report status: "in_progress"
- Real-time event: `report:assigned` to assigned user
- Real-time event: `report:updated` to reporter

### Test 6: Resolve Report (Admin)

```bash
curl -X POST http://localhost:5000/api/reports/1/resolve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution_notes": "Pothole has been repaired. Road is now safe for travel."
  }'
```

**Expected Response:**
- Status: 200 OK
- Report status: "resolved"
- Real-time event: `report:resolved` to reporter

### Test 7: Reject Report (Admin)

```bash
curl -X POST http://localhost:5000/api/reports/2/reject \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Report is duplicate of existing issue #123"
  }'
```

**Expected Response:**
- Status: 200 OK
- Report status: "rejected"
- Real-time event: `report:rejected` to reporter

### Test 8: Get Report Statistics (Admin)

```bash
curl http://localhost:5000/api/reports/stats/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- Total, pending, resolved counts
- Breakdown by type, status, priority

---

## Image Upload Tests

### Test 1: Create Incident with Images

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $USER_TOKEN" \
  -F "incident_type=flood" \
  -F "title=Flooding with photo evidence" \
  -F "description=Severe flooding documented with photos" \
  -F "severity=high" \
  -F "barangay_id=1" \
  -F "incident_image=@/path/to/photo1.jpg" \
  -F "incident_image=@/path/to/photo2.jpg"
```

**Expected Response:**
- Status: 201 Created
- Images array with file paths

### Test 2: Create Report with Images

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer $USER_TOKEN" \
  -F "report_type=road_damage" \
  -F "title=Pothole with photo" \
  -F "description=Large pothole documented" \
  -F "priority=high" \
  -F "report_image=@/path/to/photo.jpg"
```

**Expected Response:**
- Status: 201 Created
- Images array with file paths

---

## Error Tests

### Test 1: Create Incident Without Auth

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "incident_type": "flood",
    "title": "Test",
    "description": "Test description"
  }'
```

**Expected Response:**
- Status: 401 Unauthorized

### Test 2: Verify Incident as User (Should Fail)

```bash
curl -X POST http://localhost:5000/api/incidents/1/verify \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "high"
  }'
```

**Expected Response:**
- Status: 403 Forbidden

### Test 3: Invalid Incident Type

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_type": "invalid_type",
    "title": "Test",
    "description": "Test description",
    "barangay_id": 1
  }'
```

**Expected Response:**
- Status: 400 Bad Request
- Validation error

### Test 4: Missing Required Fields

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_type": "flood"
  }'
```

**Expected Response:**
- Status: 400 Bad Request
- Validation errors for missing fields

---

## Real-time Event Testing

### Setup WebSocket Client (Browser Console)

```javascript
// Connect to Socket.io
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Listen for incident events
socket.on('incident:new', (data) => {
  console.log('New incident:', data);
});

socket.on('incident:verified', (data) => {
  console.log('Incident verified:', data);
});

socket.on('incident:updated', (data) => {
  console.log('Incident updated:', data);
});

socket.on('incident:rejected', (data) => {
  console.log('Incident rejected:', data);
});

// Listen for report events
socket.on('report:new', (data) => {
  console.log('New report:', data);
});

socket.on('report:assigned', (data) => {
  console.log('Report assigned:', data);
});

socket.on('report:resolved', (data) => {
  console.log('Report resolved:', data);
});

socket.on('report:rejected', (data) => {
  console.log('Report rejected:', data);
});

// Connection status
socket.on('connect', () => {
  console.log('Connected to Socket.io');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io');
});
```

---

## Success Criteria

### ✅ Incident System
- [ ] User can create incident
- [ ] Incident appears in list
- [ ] Admin can verify incident
- [ ] Admin can reject incident
- [ ] Admin can update incident status
- [ ] Live feed shows active incidents
- [ ] Statistics are accurate
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Real-time events are emitted
- [ ] Images upload successfully

### ✅ Report System
- [ ] User can create report
- [ ] User can create anonymous report
- [ ] User sees only own reports
- [ ] Admin sees all reports
- [ ] Admin can assign report
- [ ] Admin can resolve report
- [ ] Admin can reject report
- [ ] Statistics are accurate
- [ ] Filters work correctly
- [ ] Real-time events are emitted
- [ ] Images upload successfully

### ✅ Security
- [ ] Unauthenticated requests are rejected
- [ ] Users cannot verify incidents
- [ ] Users cannot see other users' reports
- [ ] Input validation works
- [ ] File upload validation works
- [ ] RBAC is enforced

---

## Troubleshooting

### Issue: 401 Unauthorized
- Check if JWT token is valid
- Check if token is included in Authorization header
- Check if token format is: `Bearer <token>`

### Issue: 403 Forbidden
- Check user role (admin/staff required for some endpoints)
- Check if user has permission for the action

### Issue: 400 Bad Request
- Check request body format
- Check required fields
- Check field validation rules

### Issue: 500 Internal Server Error
- Check server logs
- Check database connection
- Check if barangay_id exists

### Issue: Real-time events not received
- Check Socket.io connection
- Check if JWT token is valid
- Check if user is in correct room
- Check server logs for event emission

---

## Next Steps

After successful testing:
1. ✅ Phase 3 is complete
2. 🚀 Ready for Phase 4: AI Service Architecture
3. 📝 Document any issues found
4. 🎨 Prepare for frontend integration

---

**Happy Testing! 🧪**
