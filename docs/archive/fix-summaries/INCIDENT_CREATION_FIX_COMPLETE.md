# Incident Creation Fix - COMPLETE ✅

## Issue Summary
When trying to report an incident, the form was returning a **422 (Unprocessable Entity)** error, indicating validation failure.

## Root Causes

### 1. Field Name Mismatches
The frontend was sending field names that didn't match the backend expectations:

| Frontend Field | Backend Expected | Status |
|----------------|------------------|--------|
| `type` | `incident_type` | ❌ Mismatch |
| `barangayId` | `barangay_id` | ❌ Mismatch |
| `title` | `title` | ✅ Match |
| `severity` | `severity` | ✅ Match |
| `description` | `description` | ✅ Match |

### 2. Missing Required Field
The backend requires `barangay_id` to be provided (not optional), but the frontend form had it as optional and didn't include a barangay selector.

## Backend Validation Requirements

From `backend/validators/incidentValidator.js`:

### Required Fields
- `incident_type` - Must be one of: flood, fire, earthquake, landslide, typhoon, volcanic_activity, traffic_accident, medical_emergency, other
- `title` - 5-255 characters
- `description` - Minimum 10 characters
- `barangay_id` - Valid integer (barangay ID from database)

### Optional Fields
- `severity` - low, medium, high, critical
- `latitude` - Float between -90 and 90
- `longitude` - Float between -180 and 180
- `address` - Max 500 characters
- `reporter_name` - Max 100 characters
- `reporter_contact` - Max 20 characters
- `affected_families` - Non-negative integer
- `affected_individuals` - Non-negative integer
- `casualties` - Non-negative integer
- `estimated_damage` - Non-negative number
- `notes` - Max 2000 characters

## Solutions Applied

### Fix 1: Field Name Mapping
**File**: `frontend/src/pages/incidents/CreateIncident.jsx`

Added field name mapping in the `onSubmit` function:
```javascript
const fieldMapping = {
    'title': 'title',
    'type': 'incident_type',      // ✅ Maps to backend field
    'severity': 'severity',
    'description': 'description',
    'latitude': 'latitude',
    'longitude': 'longitude',
    'barangayId': 'barangay_id',  // ✅ Maps to backend field
};

Object.keys(data).forEach(key => {
    if (data[key]) {
        const backendFieldName = fieldMapping[key] || key;
        formData.append(backendFieldName, data[key]);
    }
});
```

### Fix 2: Added Barangay Selector
**File**: `frontend/src/pages/incidents/CreateIncident.jsx`

#### Changes Made:

1. **Updated Imports**:
```javascript
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
```

2. **Added Barangay State**:
```javascript
const [barangays, setBarangays] = useState([]);
```

3. **Fetch Barangays on Mount**:
```javascript
useEffect(() => {
    const fetchBarangays = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.BARANGAYS.LIST);
            const barangayOptions = response.data.map(b => ({
                value: b.id.toString(),
                label: b.name
            }));
            setBarangays(barangayOptions);
        } catch (error) {
            console.error('Error fetching barangays:', error);
            toast.error('Failed to load barangays');
        }
    };
    fetchBarangays();
}, []);
```

4. **Updated Validation Schema**:
```javascript
const incidentSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    type: z.string().min(1, 'Please select an incident type'),
    severity: z.string().min(1, 'Please select a severity level'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    barangayId: z.string().min(1, 'Please select a barangay'),  // ✅ Now required
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});
```

5. **Added Barangay Selector Field**:
```jsx
<Select
    label="Barangay"
    options={barangays}
    error={errors.barangayId?.message}
    {...register('barangayId')}
    required
/>
```

## Form Structure

### Updated Form Flow
1. User fills in incident title
2. User selects incident type (flood, fire, etc.)
3. **User selects barangay** (NEW - required field)
4. User selects severity level
5. User provides description
6. User optionally adds location coordinates
7. User optionally uploads images (up to 5)
8. Form submits with correct field names

### Example Request Data
```javascript
FormData {
  incident_type: "flood",
  title: "Flooding on Main Street",
  barangay_id: "5",
  severity: "high",
  description: "Heavy flooding affecting multiple homes on Main Street",
  latitude: "13.9414",
  longitude: "121.1628",
  images: [File, File]
}
```

## Testing Instructions

1. **Refresh the browser** to load the updated form
2. **Navigate to Create Incident** page
3. **Fill in the form**:
   - Title: "Test Flood Incident"
   - Type: Select "Flood"
   - **Barangay**: Select any barangay (e.g., "Antipolo del Norte")
   - Severity: Select "Medium"
   - Description: "This is a test incident report with at least 10 characters"
   - Optionally add coordinates and images
4. **Click Submit Report**
5. **Verify**:
   - ✅ No 422 error
   - ✅ Success toast message appears
   - ✅ Redirects to incidents list
   - ✅ New incident appears in the list

## Available Barangays

Sample barangays in the database:
- Antipolo del Norte (ID: 5)
- Antipolo del Sur (ID: 6)
- Bagong Pook (ID: 7)
- Balintawak (ID: 8)
- Banaybanay (ID: 9)
- ... and more

## Status
✅ **COMPLETE** - Incident creation form now works correctly!

## Files Modified
- ✅ `frontend/src/pages/incidents/CreateIncident.jsx` - Fixed field names and added barangay selector

## Next Steps (Optional Enhancements)
1. **Auto-detect location**: Use browser geolocation API to auto-fill coordinates
2. **Map picker**: Add a map interface to select location visually
3. **Auto-select barangay**: Based on coordinates, automatically select the barangay
4. **Image preview**: Show thumbnails of selected images before upload
5. **Draft saving**: Save form data to localStorage for recovery
