# Testing Admin Incidents Endpoint

## Quick Test

Open your browser console and run this to test the endpoint:

```javascript
// Test the admin incidents endpoint
fetch('http://localhost:5000/api/v1/admin/incidents', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    console.log('Response:', data);
    console.log('Data array:', data.data);
    console.log('Pagination:', data.pagination);
    console.log('Number of incidents:', data.data?.length || 0);
})
.catch(err => console.error('Error:', err));
```

## Expected Response

```json
{
    "success": true,
    "message": "Incidents retrieved successfully",
    "data": [
        {
            "id": 1,
            "incident_type": "flood",
            "title": "Flooding in Barangay 1",
            "description": "...",
            "severity": "high",
            "status": "reported",
            "barangay_id": 1,
            "reported_by": 1,
            "is_verified": false,
            "created_at": "2026-05-15T...",
            "reporter": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": "john@example.com"
            },
            "barangay": {
                "id": 1,
                "name": "Barangay 1"
            }
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5,
        "totalPages": 1
    }
}
```

## Troubleshooting

### If you get 401 Unauthorized
- You're not logged in
- Token expired
- Run: `localStorage.getItem('token')` to check if token exists

### If you get 403 Forbidden
- Your user is not admin or staff
- Check role: `JSON.parse(localStorage.getItem('user')).role`

### If you get empty array
- No incidents in database
- Run seed script: `cd backend && node seedData.js`

### If you get 404
- Backend not running
- Wrong URL
- Check: `http://localhost:5000/api/v1/admin/incidents`

## Check Frontend State

In browser console while on Incident Management page:

```javascript
// Check what data the component received
// Look for console.log output: "Admin Incidents Data:"
```

## Manual Verification Steps

1. **Check if backend is running**: 
   - Open http://localhost:5000 in browser
   - Should see API response

2. **Check if you're logged in as admin**:
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('User role:', user?.role);
   // Should be 'admin' or 'staff'
   ```

3. **Check if token exists**:
   ```javascript
   const token = localStorage.getItem('token');
   console.log('Token exists:', !!token);
   ```

4. **Check network tab**:
   - Open DevTools → Network tab
   - Refresh the Incident Management page
   - Look for request to `/admin/incidents`
   - Check response status and data

5. **Check console for errors**:
   - Open DevTools → Console tab
   - Look for any red error messages
   - Look for "Admin Incidents Data:" log

## Common Issues

### Issue: "No data found" but incidents exist
- **Cause**: Data structure mismatch
- **Fix**: Applied in this update - now correctly extracts `responseData?.data`

### Issue: Verify button not showing
- **Cause**: Wrong status check
- **Fix**: Now checks for `status === 'reported' && !is_verified`

### Issue: Verify button doesn't work
- **Cause**: Wrong endpoint
- **Fix**: Now uses `/admin/incidents/:id/verify`

### Issue: Reporter name shows "Anonymous"
- **Cause**: Not checking reporter object
- **Fix**: Now checks `reporter.first_name` and `reporter.last_name`
