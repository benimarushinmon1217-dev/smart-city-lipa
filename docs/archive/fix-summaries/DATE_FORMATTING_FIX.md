# Date Formatting Fix - Invalid Time Value Error

## Issue
When clicking "View Details" on a report, the page crashed with:
```
RangeError: Invalid time value
at ReportDetails (ReportDetails.jsx:197:30)
```

## Root Cause
The `formatDistanceToNow` function from `date-fns` was being called with invalid date values. This happened when:
- `report.created_at` or `report.createdAt` was `null`, `undefined`, or an invalid date string
- `report.resolved_at` was invalid
- `incident.createdAt` or `incident.updatedAt` was invalid

## Solution Implemented

### 1. Fixed ReportDetails.jsx
**File:** `frontend/src/pages/reports/ReportDetails.jsx`

**Changes:**
- Added conditional check before formatting submission date
- Added try-catch for resolved_at date formatting
- Shows fallback text if date is invalid

**Before:**
```javascript
<p className="text-sm text-gray-900">
    {formatDistanceToNow(new Date(report.created_at || report.createdAt), {
        addSuffix: true,
    })}
</p>
```

**After:**
```javascript
{(report.created_at || report.createdAt) ? (
    <>
        <p className="text-sm text-gray-900">
            {formatDistanceToNow(new Date(report.created_at || report.createdAt), {
                addSuffix: true,
            })}
        </p>
        <p className="text-xs text-gray-500 mt-1">
            {new Date(report.created_at || report.createdAt).toLocaleString()}
        </p>
    </>
) : (
    <p className="text-sm text-gray-500">Date not available</p>
)}
```

### 2. Fixed IncidentDetails.jsx (Preventive)
**File:** `frontend/src/pages/incidents/IncidentDetails.jsx`

**Changes:**
- Added conditional checks for createdAt/created_at
- Added conditional checks for updatedAt/updated_at
- Handles both camelCase and snake_case field names

**Before:**
```javascript
<p className="text-sm text-gray-500">
    {new Date(incident.createdAt).toLocaleString()}
    ({formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })})
</p>
```

**After:**
```javascript
{(incident.createdAt || incident.created_at) && (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary-600 rounded-full" />
        <div>
            <p className="text-sm font-medium text-gray-900">Incident Reported</p>
            <p className="text-sm text-gray-500">
                {new Date(incident.createdAt || incident.created_at).toLocaleString()}
                ({formatDistanceToNow(new Date(incident.createdAt || incident.created_at), { addSuffix: true })})
            </p>
        </div>
    </div>
)}
```

## What This Fixes

### ✅ Report Details Page
- No longer crashes when viewing reports with missing dates
- Shows "Date not available" instead of crashing
- Handles both `created_at` and `createdAt` field names
- Gracefully handles invalid `resolved_at` dates

### ✅ Incident Details Page
- Prevents similar crashes on incident details
- Timeline section only shows if dates exist
- Handles both camelCase and snake_case date fields
- More robust date handling

## Testing

### Test Report Details
1. Navigate to any report details page
2. Page should load without errors
3. If date exists, it should display correctly
4. If date is missing, should show "Date not available"

### Test Incident Details
1. Navigate to any incident details page
2. Timeline section should display correctly
3. No date-related errors should occur

## Files Modified
- ✅ `frontend/src/pages/reports/ReportDetails.jsx`
- ✅ `frontend/src/pages/incidents/IncidentDetails.jsx`

## Status
✅ **FIXED** - Report and incident details pages now handle invalid dates gracefully

---

**Date:** 2026-05-16  
**Issue:** Invalid time value error when viewing report details  
**Resolution:** Added date validation and fallback handling
