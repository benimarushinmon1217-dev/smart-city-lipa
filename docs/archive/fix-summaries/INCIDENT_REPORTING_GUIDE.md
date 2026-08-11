# 📋 Incident Reporting System Guide

## Overview

The **Incident Reporting System** is a comprehensive disaster management module that enables citizens to report emergencies, hazards, and incidents in real-time. The system includes verification workflows, image uploads, geo-tagging, and live incident feeds.

---

## 🎯 Features

### Core Features
- ✅ **Real-time Incident Reporting** - Citizens can report disasters instantly
- ✅ **Image Upload Support** - Up to 5 images per incident
- ✅ **Geo-tagging** - Latitude/longitude coordinates for precise location
- ✅ **Verification Workflow** - Admin/Staff verify incidents before public display
- ✅ **Severity Levels** - Low, Medium, High, Critical
- ✅ **Status Tracking** - Reported → Verified → Responding → Resolved → Closed
- ✅ **Live Incident Feed** - Real-time feed of active incidents
- ✅ **Impact Assessment** - Track affected families, individuals, casualties, damage
- ✅ **Real-time Notifications** - Socket.io broadcasts to relevant users

### User Report System
- ✅ **Community Reports** - Non-emergency issues (road damage, street lights, etc.)
- ✅ **Anonymous Reporting** - Optional anonymous submissions
- ✅ **Report Assignment** - Assign reports to staff members
- ✅ **Resolution Workflow** - Pending → Reviewing → In Progress → Resolved/Rejected
- ✅ **Priority Levels** - Low, Medium, High, Urgent

---

## 📁 Architecture

### Files Created

```
backend/
├── services/
│   ├── incidentService.js      # Incident business logic
│   └── reportService.js         # Report business logic
├── controllers/
│   ├── incidentController.js   # Incident HTTP handlers
│   └── reportController.js      # Report HTTP handlers
├── validators/
│   ├── incidentValidator.js    # Incident input validation
│   └── reportValidator.js       # Report input validation
└── routes/
    ├── incidentRoutes.js       # Incident API routes (updated)
    └── reportRoutes.js          # Report API routes (updated)
```

---

## 🔌 API Endpoints

### Incident Endpoints

#### 1. Get All Incidents
```http
GET /api/incidents
```

**Query Parameters:**
- `incident_type` - Filter by type (flood, fire, earthquake, etc.)
- `severity` - Filter by severity (low, medium, high, critical)
- `status` - Filter by status (reported, verified, responding, resolved, closed)
- `barangay_id` - Filter by barangay
- `is_verified` - Filter by verification status (true/false)
- `search` - Search in title, description, address
- `start_date` - Filter by start date (ISO 8601)
- `end_date` - Filter by end date (ISO 8601)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort_by` - Sort field (created_at, severity, status, incident_type)
- `sort_order` - Sort order (ASC, DESC)

**Access:** Public/Optional Auth

**Response:**
```json
{
  "success": true,
  "data": {
    "incidents": [
      {
        "id": 1,
        "incident_type": "flood",
        "title": "Severe flooding in Barangay 12",
        "description": "Water level reached 3 feet...",
        "severity": "high",
        "status": "verified",
        "barangay_id": 12,
        "latitude": 13.9411,
        "longitude": 121.1628,
        "address": "Main Street, Barangay 12",
        "images": ["/uploads/incidents/image1.jpg"],
        "is_verified": true,
        "affected_families": 50,
        "affected_individuals": 200,
        "casualties": 0,
        "estimated_damage": 500000.00,
        "reporter": {
          "id": 5,
          "username": "juan_cruz",
          "first_name": "Juan",
          "last_name": "Cruz"
        },
        "barangay": {
          "id": 12,
          "name": "Barangay 12 Poblacion",
          "risk_level": "high"
        },
        "created_at": "2026-05-14T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  },
  "message": "Incidents retrieved successfully"
}
```

---

#### 2. Get Incident by ID
```http
GET /api/incidents/:id
```

**Access:** Public/Optional Auth

**Response:**
```json
{
  "success": true,
  "data": {
    "incident": {
      "id": 1,
      "incident_type": "flood",
      "title": "Severe flooding in Barangay 12",
      "description": "Water level reached 3 feet...",
      "severity": "high",
      "status": "verified",
      "images": ["/uploads/incidents/image1.jpg"],
      "reporter": { ... },
      "barangay": { ... },
      "verifier": {
        "id": 2,
        "username": "admin_user",
        "first_name": "Admin",
        "last_name": "User"
      },
      "verified_at": "2026-05-14T11:00:00Z"
    }
  },
  "message": "Incident retrieved successfully"
}
```

---

#### 3. Create Incident
```http
POST /api/incidents
Content-Type: multipart/form-data
```

**Access:** Protected (Authenticated Users)

**Body (Form Data):**
```
incident_type: "flood"
title: "Severe flooding in Barangay 12"
description: "Water level reached 3 feet and rising..."
severity: "high"
barangay_id: 12
latitude: 13.9411
longitude: 121.1628
address: "Main Street, Barangay 12"
reporter_name: "Juan Cruz"
reporter_contact: "09171234567"
affected_families: 50
affected_individuals: 200
casualties: 0
estimated_damage: 500000
notes: "Immediate evacuation needed"
incident_image: [file1.jpg, file2.jpg] (up to 5 images)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "incident": { ... }
  },
  "message": "Incident reported successfully"
}
```

**Real-time Events Triggered:**
- `incident:new` → Barangay room
- `incident:new` → Admin/Staff roles

---

#### 4. Update Incident
```http
PUT /api/incidents/:id
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "status": "responding",
  "severity": "critical",
  "affected_families": 75,
  "resolution_notes": "Emergency response team deployed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "incident": { ... }
  },
  "message": "Incident updated successfully"
}
```

**Real-time Events Triggered:**
- `incident:updated` → Barangay room

---

#### 5. Verify Incident
```http
POST /api/incidents/:id/verify
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "severity": "high",
  "affected_families": 50,
  "affected_individuals": 200,
  "casualties": 0,
  "estimated_damage": 500000,
  "notes": "Verified by field inspection"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "incident": { ... }
  },
  "message": "Incident verified successfully"
}
```

**Real-time Events Triggered:**
- `incident:verified` → Barangay room
- `incident:verified` → Reporter (user room)

---

#### 6. Reject Incident
```http
POST /api/incidents/:id/reject
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "reason": "Unable to verify incident. No evidence found at reported location."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Incident rejected",
    "reason": "Unable to verify incident..."
  },
  "message": "Incident rejected successfully"
}
```

**Real-time Events Triggered:**
- `incident:rejected` → Reporter (user room)

---

#### 7. Delete Incident
```http
DELETE /api/incidents/:id
```

**Access:** Protected (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Incident deleted successfully"
  },
  "message": "Incident deleted successfully"
}
```

---

#### 8. Get Incident Statistics
```http
GET /api/incidents/stats/summary
```

**Access:** Protected (Admin/Staff)

**Query Parameters:**
- `barangay_id` - Filter by barangay
- `start_date` - Start date (ISO 8601)
- `end_date` - End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 150,
      "verified": 120,
      "unverified": 30,
      "by_type": [
        { "incident_type": "flood", "count": 45 },
        { "incident_type": "fire", "count": 20 }
      ],
      "by_severity": [
        { "severity": "critical", "count": 10 },
        { "severity": "high", "count": 35 }
      ],
      "by_status": [
        { "status": "reported", "count": 30 },
        { "status": "verified", "count": 50 }
      ]
    }
  },
  "message": "Incident statistics retrieved successfully"
}
```

---

#### 9. Get Live Incident Feed
```http
GET /api/incidents/feed/live
```

**Access:** Public/Optional Auth

**Query Parameters:**
- `limit` - Number of incidents (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "feed": [
      {
        "id": 1,
        "incident_type": "flood",
        "title": "Severe flooding...",
        "severity": "high",
        "status": "responding",
        "barangay": { ... },
        "created_at": "2026-05-14T10:30:00Z"
      }
    ]
  },
  "message": "Live incident feed retrieved successfully"
}
```

---

### Report Endpoints

#### 1. Get All Reports
```http
GET /api/reports
```

**Access:** Protected (Users see their own, Admin/Staff see all)

**Query Parameters:**
- `report_type` - Filter by type (flood, road_damage, street_light, etc.)
- `status` - Filter by status (pending, reviewing, in_progress, resolved, rejected)
- `priority` - Filter by priority (low, medium, high, urgent)
- `barangay_id` - Filter by barangay
- `search` - Search in title, description, location
- `start_date` - Start date (ISO 8601)
- `end_date` - End date (ISO 8601)
- `page` - Page number
- `limit` - Items per page
- `sort_by` - Sort field
- `sort_order` - Sort order

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [ ... ],
    "pagination": { ... }
  },
  "message": "Reports retrieved successfully"
}
```

---

#### 2. Create Report
```http
POST /api/reports
Content-Type: multipart/form-data
```

**Access:** Protected

**Body (Form Data):**
```
report_type: "road_damage"
title: "Large pothole on Main Street"
description: "Dangerous pothole causing traffic issues..."
barangay_id: 12
location: "Main Street near City Hall"
latitude: 13.9411
longitude: 121.1628
priority: "high"
is_anonymous: false
contact_number: "09171234567"
report_image: [file1.jpg, file2.jpg] (up to 5 images)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": { ... }
  },
  "message": "Report submitted successfully"
}
```

**Real-time Events Triggered:**
- `report:new` → Admin/Staff roles
- `report:new` → Barangay room (if barangay_id provided)

---

#### 3. Assign Report
```http
POST /api/reports/:id/assign
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "assigned_to": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": { ... }
  },
  "message": "Report assigned successfully"
}
```

**Real-time Events Triggered:**
- `report:assigned` → Assigned user
- `report:updated` → Reporter

---

#### 4. Resolve Report
```http
POST /api/reports/:id/resolve
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "resolution_notes": "Pothole has been repaired. Road is now safe for travel."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": { ... }
  },
  "message": "Report resolved successfully"
}
```

**Real-time Events Triggered:**
- `report:resolved` → Reporter

---

#### 5. Reject Report
```http
POST /api/reports/:id/reject
```

**Access:** Protected (Admin/Staff)

**Body:**
```json
{
  "reason": "Report is duplicate of existing issue #123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Report rejected",
    "reason": "Report is duplicate..."
  },
  "message": "Report rejected successfully"
}
```

**Real-time Events Triggered:**
- `report:rejected` → Reporter

---

## 🔄 Workflows

### Incident Verification Workflow

```
1. User Reports Incident
   ↓
2. Status: "reported", is_verified: false
   ↓
3. Real-time notification to Admin/Staff
   ↓
4. Admin/Staff Reviews Incident
   ↓
5a. VERIFY                    5b. REJECT
    ↓                             ↓
    Status: "verified"            Status: "closed"
    is_verified: true             is_verified: false
    ↓                             ↓
    Notify reporter               Notify reporter with reason
    Notify barangay
    ↓
6. Status: "responding"
   ↓
7. Status: "resolved"
   ↓
8. Status: "closed"
```

### Report Resolution Workflow

```
1. User Submits Report
   ↓
2. Status: "pending"
   ↓
3. Admin/Staff Reviews
   ↓
4. Status: "reviewing"
   ↓
5. Assign to Staff Member
   ↓
6. Status: "in_progress"
   ↓
7a. RESOLVE                   7b. REJECT
    ↓                             ↓
    Status: "resolved"            Status: "rejected"
    Add resolution notes          Add rejection reason
    ↓                             ↓
    Notify reporter               Notify reporter
```

---

## 🔔 Real-time Events

### Incident Events

| Event | Emitted To | Trigger |
|-------|-----------|---------|
| `incident:new` | Barangay room, Admin/Staff | New incident created |
| `incident:updated` | Barangay room | Incident status/details updated |
| `incident:verified` | Barangay room, Reporter | Incident verified by admin |
| `incident:rejected` | Reporter | Incident rejected by admin |

### Report Events

| Event | Emitted To | Trigger |
|-------|-----------|---------|
| `report:new` | Admin/Staff, Barangay room | New report submitted |
| `report:updated` | Reporter, Assigned user | Report status updated |
| `report:assigned` | Assigned user | Report assigned to staff |
| `report:resolved` | Reporter | Report resolved |
| `report:rejected` | Reporter | Report rejected |

---

## 📊 Data Models

### Incident Types
- `flood` - Flooding incidents
- `fire` - Fire emergencies
- `earthquake` - Earthquake events
- `landslide` - Landslide hazards
- `typhoon` - Typhoon impacts
- `volcanic_activity` - Volcanic eruptions/ashfall
- `traffic_accident` - Traffic accidents
- `medical_emergency` - Medical emergencies
- `other` - Other incidents

### Report Types
- `flood` - Flood reports
- `road_damage` - Road damage/potholes
- `street_light` - Street light issues
- `garbage` - Garbage/waste issues
- `water_supply` - Water supply problems
- `noise_complaint` - Noise complaints
- `illegal_activity` - Illegal activities
- `other` - Other reports

### Severity Levels
- `low` - Minor impact
- `medium` - Moderate impact
- `high` - Significant impact
- `critical` - Life-threatening/severe impact

### Incident Status
- `reported` - Initial report
- `verified` - Verified by admin
- `responding` - Response team deployed
- `resolved` - Incident resolved
- `closed` - Incident closed

### Report Status
- `pending` - Awaiting review
- `reviewing` - Under review
- `in_progress` - Being addressed
- `resolved` - Issue resolved
- `rejected` - Report rejected

---

## 🧪 Testing Examples

### Test Incident Creation (cURL)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "incident_type=flood" \
  -F "title=Severe flooding in Barangay 12" \
  -F "description=Water level reached 3 feet and rising rapidly" \
  -F "severity=high" \
  -F "barangay_id=12" \
  -F "latitude=13.9411" \
  -F "longitude=121.1628" \
  -F "address=Main Street, Barangay 12" \
  -F "affected_families=50" \
  -F "incident_image=@photo1.jpg" \
  -F "incident_image=@photo2.jpg"
```

### Test Report Creation (JavaScript)

```javascript
const formData = new FormData();
formData.append('report_type', 'road_damage');
formData.append('title', 'Large pothole on Main Street');
formData.append('description', 'Dangerous pothole causing traffic issues');
formData.append('barangay_id', 12);
formData.append('priority', 'high');
formData.append('report_image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/reports', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data);
```

---

## 🔐 Permissions

### Incident Permissions

| Action | User | Staff | Admin |
|--------|------|-------|-------|
| View incidents | ✅ | ✅ | ✅ |
| Create incident | ✅ | ✅ | ✅ |
| Update incident | ❌ | ✅ | ✅ |
| Verify incident | ❌ | ✅ | ✅ |
| Reject incident | ❌ | ✅ | ✅ |
| Delete incident | ❌ | ❌ | ✅ |
| View statistics | ❌ | ✅ | ✅ |

### Report Permissions

| Action | User | Staff | Admin |
|--------|------|-------|-------|
| View own reports | ✅ | ✅ | ✅ |
| View all reports | ❌ | ✅ | ✅ |
| Create report | ✅ | ✅ | ✅ |
| Update own report | ✅ | ✅ | ✅ |
| Update any report | ❌ | ✅ | ✅ |
| Assign report | ❌ | ✅ | ✅ |
| Resolve report | ❌ | ✅ | ✅ |
| Reject report | ❌ | ✅ | ✅ |
| Delete own report | ✅ | ✅ | ✅ |
| Delete any report | ❌ | ❌ | ✅ |

---

## 📝 Next Steps

Phase 3 is now **COMPLETE**! ✅

**Ready for Phase 4: AI Service Architecture**

The incident reporting system is fully functional with:
- ✅ Complete CRUD operations
- ✅ Image upload support
- ✅ Verification workflows
- ✅ Real-time notifications
- ✅ Geo-tagging
- ✅ Statistics and analytics
- ✅ Live incident feed
- ✅ Report management system

---

## 📚 Related Documentation

- [Real-time Implementation Guide](REALTIME_IMPLEMENTATION_GUIDE.md)
- [Admin Dashboard Guide](ADMIN_DASHBOARD_GUIDE.md)
- [Project Status](PROJECT_STATUS.md)
- [Quick Reference](QUICK_REFERENCE.md)
