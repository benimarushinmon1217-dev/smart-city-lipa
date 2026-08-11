# Emergency Broadcast 422 Error - FIXED ✅

## Issue
Emergency broadcast was failing with `422 Unprocessable Entity` error.

## Root Cause
**Priority value mismatch:**
- Frontend was sending: `priority: 'critical'`
- Backend validator expects: `['low', 'medium', 'high', 'urgent']`
- `'critical'` is NOT a valid value!

## Changes Applied

### 1. Fixed Priority Values in Frontend
**File:** `frontend/src/pages/admin/Broadcast.jsx`

**Changed:**
```javascript
// BEFORE (WRONG)
const ALERT_PRIORITIES = [
    { value: 'critical', label: 'Critical', color: 'danger' },  // ❌ Invalid
    ...
];

// AFTER (CORRECT)
const ALERT_PRIORITIES = [
    { value: 'urgent', label: 'Critical', color: 'danger' },  // ✅ Valid
    ...
];
```

**Also updated default state:**
```javascript
// BEFORE
priority: 'critical'  // ❌ Invalid

// AFTER
priority: 'urgent'  // ✅ Valid
```

### 2. Updated Socket Handler
**File:** `backend/sockets/eventHandlers.js`

**Changed condition to check for 'urgent' instead of 'critical':**
```javascript
// BEFORE
if (announcement.priority === 'critical' || ...)

// AFTER
if (announcement.priority === 'urgent' || announcement.priority === 'high' || ...)
```

## Valid Priority Values

According to backend validator (`adminValidator.js`):
- ✅ `'low'` - Low priority
- ✅ `'medium'` - Medium priority
- ✅ `'high'` - High priority
- ✅ `'urgent'` - Urgent/Critical priority
- ❌ `'critical'` - NOT VALID

## Testing Steps

### 1. Refresh Browser
Clear cache and refresh to load updated JavaScript.

### 2. Send Test Broadcast
1. Go to Admin Dashboard → Broadcast
2. Fill in form:
   - **Title:** "Test Emergency Alert"
   - **Message:** "This is a test message"
   - **Type:** Emergency Alert
   - **Priority:** Critical (now sends as 'urgent')
   - **Target:** All Users
3. Click "Send Emergency Broadcast"
4. **Expected:** Success toast, no 422 error

### 3. Verify User Receives
1. Open user account in different browser
2. Should see toast notification
3. Check browser console for events

### 4. Check Backend Console
Should see:
```
🚨 [EMERGENCY ANNOUNCEMENT] Processing: Test Emergency Alert
🚨 [EMERGENCY ANNOUNCEMENT] Broadcasting to ALL users
📡 [SOCKET] Broadcasting "announcement:new" to X connected clients
🚨 [EMERGENCY ANNOUNCEMENT] Also sending as EMERGENCY_ALERT
✅ [EMERGENCY ANNOUNCEMENT] Processing complete
```

## Backend Validator Rules

**File:** `backend/validators/adminValidator.js`

Required fields:
- ✅ `title` - 5-255 characters
- ✅ `content` - min 10 characters (NOT `message`)
- ✅ `target_audience` - one of: `['all', 'admin', 'staff', 'user', 'specific_barangay']`

Optional fields:
- `type` - one of: `['general', 'emergency', 'weather', 'event', 'maintenance', 'advisory']`
- `priority` - one of: `['low', 'medium', 'high', 'urgent']`
- `target_barangays` - JSON string or array

## Priority Behavior

| Priority | Label | Color | Emergency Alert? |
|----------|-------|-------|------------------|
| `urgent` | Critical | Red | ✅ Yes |
| `high` | High | Orange | ✅ Yes |
| `medium` | Medium | Default | ❌ No |
| `low` | Low | Green | ❌ No |

**Emergency Alert = Red toast, 10 seconds, urgent sound**

## Files Modified

1. ✅ `frontend/src/pages/admin/Broadcast.jsx` - Changed 'critical' → 'urgent'
2. ✅ `backend/sockets/eventHandlers.js` - Updated condition to check 'urgent'

## Common Validation Errors

### 422 Error: "Title is required"
- Title field is empty
- Title is less than 5 characters

### 422 Error: "Content is required"
- Message field is empty
- Message is less than 10 characters

### 422 Error: "Invalid priority"
- Using 'critical' instead of 'urgent'
- Using value not in: ['low', 'medium', 'high', 'urgent']

### 422 Error: "Invalid target audience"
- Using 'barangay' instead of 'specific_barangay'
- Using value not in: ['all', 'admin', 'staff', 'user', 'specific_barangay']

### 422 Error: "target_barangays must be valid JSON"
- Sending array instead of JSON string
- Sending malformed JSON

## Next Steps

1. ✅ Refresh browser
2. ✅ Test emergency broadcast
3. ✅ Verify users receive alerts
4. ✅ Test different priority levels
5. ✅ Test barangay-specific broadcasts

**REFRESH BROWSER AND TEST NOW!**
