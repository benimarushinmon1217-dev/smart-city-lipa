# Incident Update Fix - Complete

## Issue
When trying to update an incident, the operation failed with error:
```
TypeError: Cannot read properties of undefined (reading 'id')
at Object.onSuccess (useIncidents.js:97:66)
```

## Root Cause
The `updateIncident` mutation in `useIncidents.js` was trying to access `data.data.id` in the `onSuccess` callback, but the response structure didn't match this expectation. The mutation was returning `response.data` directly, which might not have a nested `data.id` property.

## Solution Applied

### Fixed useIncidents Hook
**File:** `frontend/src/hooks/useIncidents.js`

**Before:**
```javascript
mutationFn: async ({ id, data }) => {
    const response = await api.put(API_ENDPOINTS.INCIDENTS.UPDATE(id), data);
    return response.data;
},
onSuccess: (data) => {
    queryClient.invalidateQueries(['incidents']);
    queryClient.invalidateQueries(['incident', data.data.id]); // ❌ Error here
    toast.success('Incident updated successfully');
},
```

**After:**
```javascript
mutationFn: async ({ id, data }) => {
    const response = await api.put(API_ENDPOINTS.INCIDENTS.UPDATE(id), data);
    return { response: response.data, id }; // ✅ Return both response and id
},
onSuccess: ({ response, id }) => {
    queryClient.invalidateQueries(['incidents']);
    queryClient.invalidateQueries(['incident', id]); // ✅ Use id directly
    toast.success('Incident updated successfully');
},
```

## What Changed

1. **Mutation Function:** Now returns an object containing both the response and the incident ID
2. **onSuccess Callback:** Destructures the returned object to get the ID directly
3. **Query Invalidation:** Uses the ID from the mutation parameters instead of trying to extract it from the response

## Benefits

- **More Reliable:** Doesn't depend on response structure
- **Cleaner Code:** Uses the ID we already have from the mutation parameters
- **No Errors:** Eliminates the undefined property access error

## Testing

1. **Navigate to incident details:** `/incidents/{id}`
2. **Click "Edit" button**
3. **Make changes to any fields**
4. **Click "Save Changes"**
5. **Expected Results:**
   - ✅ Success toast appears: "Incident updated successfully"
   - ✅ Redirects to incident details page
   - ✅ Changes are visible
   - ✅ No console errors

## Test Scenarios

### Basic Update:
- Change title
- Change description
- Expected: Success

### Type/Severity Update:
- Change incident type
- Change severity level
- Expected: Success

### Status Update:
- Change from "reported" to "verified"
- Expected: Success

### Location Update:
- Change barangay
- Update address
- Update coordinates
- Expected: Success

### Impact Data Update:
- Update affected families
- Update casualties
- Update estimated damage
- Expected: Success

## Files Modified
- `frontend/src/hooks/useIncidents.js` - Fixed updateMutation onSuccess callback

## Status
✅ **COMPLETE** - Incident update functionality now works correctly
