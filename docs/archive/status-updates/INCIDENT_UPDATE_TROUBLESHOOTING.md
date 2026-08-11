# Incident Update Troubleshooting

## Issue
When trying to update an incident from the Edit page, it shows "Failed to update incident" error.

## Debugging Steps Added

### 1. Added Console Logging
**File:** `frontend/src/pages/incidents/EditIncident.jsx`

Added logging to the submit handler:
- Logs the form data being sent
- Logs success message
- Logs detailed error information including response

### 2. How to Debug

**Open Browser Console (F12) and try to update an incident:**

1. Navigate to `/incidents/{id}/edit`
2. Make some changes
3. Click "Save Changes"
4. Check console for:
   - `Submitting incident update:` - Shows what data is being sent
   - `Update successful` - If it works
   - `Update failed:` - If it fails, with error details

## Common Issues & Solutions

### Issue 1: Field Name Mismatch
**Symptom:** Backend rejects the update

**Check:**
- Frontend sends: `incident_type`
- Backend expects: `incident_type`
- These should match

**Solution:** Verify field names in form data match backend expectations

### Issue 2: Missing Required Fields
**Symptom:** Validation error

**Check:**
- Title (required)
- Description (required)
- Incident Type (required)
- Severity (required)

**Solution:** Ensure all required fields have values

### Issue 3: Authentication Issue
**Symptom:** 401 Unauthorized error

**Check:**
- User is logged in
- Token is valid
- User has permission to update incidents

**Solution:** Re-login if token expired

### Issue 4: Incident Not Found
**Symptom:** 404 Not Found error

**Check:**
- Incident ID exists in database
- URL is correct

**Solution:** Verify incident exists

### Issue 5: Backend Validation Error
**Symptom:** 400 Bad Request with validation errors

**Check Console for:**
- Which field failed validation
- What the validation rule is

**Solution:** Fix the invalid field value

## Testing Checklist

After checking console logs, test these scenarios:

1. **Update Basic Info:**
   - Change title
   - Change description
   - Expected: Success

2. **Update Type/Severity:**
   - Change incident type
   - Change severity
   - Expected: Success

3. **Update Status:**
   - Change from "reported" to "verified"
   - Expected: Success

4. **Update Location:**
   - Change barangay
   - Change address
   - Expected: Success

5. **Update Impact Data:**
   - Change affected families
   - Change casualties
   - Expected: Success

## Next Steps

1. **Try to update an incident**
2. **Open browser console (F12)**
3. **Look for the console logs:**
   - What data is being sent?
   - What error is returned?
4. **Share the console output** for further debugging

## Backend Endpoint

**Endpoint:** `PUT /api/v1/incidents/:id`

**Expected Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "incident_type": "string",
  "severity": "string",
  "status": "string",
  "barangay_id": number,
  "address": "string",
  "latitude": number,
  "longitude": number,
  "affected_families": number,
  "affected_individuals": number,
  "casualties": number,
  "estimated_damage": number,
  "notes": "string"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Incident updated successfully",
  "data": {
    "incident": { ...updated incident... }
  }
}
```

## Files Modified
- `frontend/src/pages/incidents/EditIncident.jsx` - Added console logging for debugging
