# Incident Edit Page - Complete

## Issue
Clicking the "Edit" button on an incident details page resulted in a 404 error because the `/incidents/:id/edit` route didn't exist.

## Solution Applied

### 1. Created EditIncident Page
**File:** `frontend/src/pages/incidents/EditIncident.jsx`

A complete incident editing page with:

**Features:**
- **Pre-populated Form:** Loads existing incident data automatically
- **Basic Information Section:**
  - Title (required)
  - Description (required)
  - Incident Type (required) - dropdown with all types
  - Severity (required) - low, medium, high, critical
  - Status - reported, verified, responding, resolved

- **Location Information Section:**
  - Barangay selector (populated from database)
  - Address field
  - Latitude and Longitude coordinates

- **Impact Information Section:**
  - Affected Families count
  - Affected Individuals count
  - Casualties count
  - Estimated Damage (in pesos)

- **Additional Notes Section:**
  - Free-form text area for extra information

- **Form Validation:**
  - Required field checking
  - Toast notifications for errors
  - Loading states during submission

- **Navigation:**
  - Back to Details button
  - Cancel button (returns to details)
  - Save Changes button (submits and redirects)

### 2. Added Route to App.jsx
**File:** `frontend/src/App.jsx`

Added:
- Import: `import EditIncident from './pages/incidents/EditIncident';`
- Route: `<Route path="/incidents/:id/edit" element={<EditIncident />} />`

## How It Works

### User Flow:
1. User views incident details at `/incidents/{id}`
2. User clicks "Edit" button
3. Navigates to `/incidents/{id}/edit`
4. Form loads with existing incident data
5. User modifies fields
6. User clicks "Save Changes"
7. API updates incident
8. Redirects back to `/incidents/{id}` (details page)

### Technical Flow:
1. **Load Incident:** Uses `useIncident(id)` hook to fetch current data
2. **Load Barangays:** Uses `useBarangays()` hook for dropdown
3. **Populate Form:** `useEffect` populates form when incident loads
4. **Handle Changes:** Updates local state as user types
5. **Submit:** Calls `updateIncident` mutation with form data
6. **Success:** Shows toast and navigates to details page
7. **Error:** Shows error toast

## API Integration

Uses the existing `useIncidents` hook:
- `useIncident(id)` - Fetches incident data
- `updateIncident({ id, data })` - Updates incident
- `isUpdating` - Loading state

Backend endpoint: `PUT /api/v1/incidents/:id`

## Form Fields Mapping

| Form Field | API Field | Type | Required |
|------------|-----------|------|----------|
| Title | title | string | Yes |
| Description | description | text | Yes |
| Incident Type | incident_type | enum | Yes |
| Severity | severity | enum | Yes |
| Status | status | enum | No |
| Barangay | barangay_id | integer | No |
| Address | address | string | No |
| Latitude | latitude | decimal | No |
| Longitude | longitude | decimal | No |
| Affected Families | affected_families | integer | No |
| Affected Individuals | affected_individuals | integer | No |
| Casualties | casualties | integer | No |
| Estimated Damage | estimated_damage | decimal | No |
| Notes | notes | text | No |

## Testing Instructions

1. **Navigate to any incident details page:** `/incidents/{id}`
2. **Click "Edit" button**
3. **Expected:** Edit form loads with current incident data
4. **Modify some fields**
5. **Click "Save Changes"**
6. **Expected:** 
   - Success toast appears
   - Redirects to incident details page
   - Changes are visible

### Test Cases:
- ✅ Edit basic information (title, description)
- ✅ Change incident type and severity
- ✅ Update status
- ✅ Change location (barangay, address, coordinates)
- ✅ Update impact numbers
- ✅ Add/edit notes
- ✅ Cancel button returns to details without saving
- ✅ Validation prevents empty required fields

## Files Modified

### Created:
- `frontend/src/pages/incidents/EditIncident.jsx` - New edit page

### Modified:
- `frontend/src/App.jsx` - Added route and import

## Status
✅ **COMPLETE** - Incident edit functionality now works correctly
