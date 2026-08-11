# Incident Edit Validation Error - Fixed

## Issue
When editing an incident and clicking "Save Changes", got error:
```
422 Unprocessable Entity
Validation failed
```

## Root Cause
The EditIncident form was sending empty strings (`""`) for optional fields like:
- `barangay_id: ""`
- `latitude: ""`
- `longitude: ""`
- `affected_families: ""`
- etc.

Backend validators were rejecting empty strings for numeric fields that expect either:
- A valid number
- `null`/`undefined` (to skip validation)
- NOT empty strings

## Fix Applied

### Updated Form Submission Logic
**File:** `frontend/src/pages/incidents/EditIncident.jsx`

**Changes:**
1. **Clean Data Before Sending:**
   - Remove empty strings
   - Remove null/undefined values
   - Only send fields with actual values

2. **Convert Numeric Fields:**
   - Parse numeric strings to numbers
   - Fields: `barangay_id`, `latitude`, `longitude`, `affected_families`, `affected_individuals`, `casualties`, `estimated_damage`
   - Only include if valid number (not NaN)

3. **Enhanced Error Logging:**
   - Log validation errors from backend
   - Show which fields failed validation

**Before:**
```javascript
updateIncident({ id, data: formData })
```

**After:**
```javascript
// Clean up data
const cleanData = {};
Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (value !== '' && value !== null && value !== undefined) {
        if (isNumericField(key)) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                cleanData[key] = numValue;
            }
        } else {
            cleanData[key] = value;
        }
    }
});

updateIncident({ id, data: cleanData })
```

## How It Works Now

### Form Submission Flow:
1. **User fills form** → Some fields left empty
2. **Click Save Changes** → Triggers handleSubmit
3. **Validate required fields** → title, description, incident_type
4. **Clean data:**
   - Remove empty strings
   - Convert numeric strings to numbers
   - Skip invalid numbers
5. **Send to backend** → Only valid, non-empty fields
6. **Backend validates** → Passes validation
7. **Update succeeds** → Redirect to details page

### Example Data Transformation:

**Before (sent to backend):**
```javascript
{
    title: "Landslide",
    description: "Soft soil",
    incident_type: "landslide",
    severity: "medium",
    barangay_id: "",           // ❌ Empty string
    latitude: "",              // ❌ Empty string
    longitude: "",             // ❌ Empty string
    affected_families: "",     // ❌ Empty string
    casualties: "",            // ❌ Empty string
}
```

**After (sent to backend):**
```javascript
{
    title: "Landslide",
    description: "Soft soil",
    incident_type: "landslide",
    severity: "medium"
    // ✅ Empty fields removed
}
```

## Testing

### Test Case 1: Update Basic Info Only
1. Edit incident
2. Change title and description
3. Leave location fields empty
4. Click Save Changes
5. **Expected:** Success, only title/description updated

### Test Case 2: Update With Location
1. Edit incident
2. Fill in barangay, latitude, longitude
3. Click Save Changes
4. **Expected:** Success, location fields updated

### Test Case 3: Update Impact Data
1. Edit incident
2. Fill in affected families: "10"
3. Fill in casualties: "2"
4. Click Save Changes
5. **Expected:** Success, numbers converted and saved

### Test Case 4: Partial Update
1. Edit incident
2. Change severity to "high"
3. Leave other fields unchanged
4. Click Save Changes
5. **Expected:** Success, only severity updated

## Validation Rules

### Required Fields (Cannot be empty):
- ✅ `title` - Must be 5-255 characters
- ✅ `description` - Must be at least 10 characters
- ✅ `incident_type` - Must be valid type

### Optional Fields (Can be empty):
- `severity` - If provided, must be: low, medium, high, critical
- `status` - If provided, must be: reported, verified, responding, resolved
- `barangay_id` - If provided, must be valid integer
- `latitude` - If provided, must be valid number
- `longitude` - If provided, must be valid number
- `address` - Any string
- `affected_families` - If provided, must be valid number
- `affected_individuals` - If provided, must be valid number
- `casualties` - If provided, must be valid number
- `estimated_damage` - If provided, must be valid number
- `notes` - Any string

## Error Handling

### If Validation Still Fails:

1. **Check Browser Console:**
   ```
   Update failed: [error object]
   Error response: [response data]
   Validation errors: [array of errors]
   ```

2. **Common Validation Errors:**
   - "Title must be between 5 and 255 characters"
   - "Description must be at least 10 characters"
   - "Invalid incident type"
   - "Invalid severity level"
   - "Barangay ID must be a valid integer"

3. **Fix Based on Error:**
   - Check which field is failing
   - Ensure value meets validation rules
   - Check data type (string vs number)

## Files Modified
- `frontend/src/pages/incidents/EditIncident.jsx` - Fixed form submission

## Status
✅ **COMPLETE** - Incident edit validation errors fixed
