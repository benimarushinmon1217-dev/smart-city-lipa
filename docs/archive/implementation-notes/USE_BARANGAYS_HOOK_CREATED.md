# useBarangays Hook Created

## Issue
The EditIncident page was trying to import `useBarangays` hook which didn't exist, causing a Vite import error.

## Solution

### 1. Created useBarangays Hook
**File:** `frontend/src/hooks/useBarangays.js`

A custom React Query hook for fetching barangay data:

**Exports:**
- `useBarangays()` - Fetches all barangays
  - Returns: `{ barangays, isLoading, error, refetch }`
  - Caches data for 5 minutes
  - Handles multiple response structures

- `useBarangay(id)` - Fetches single barangay by ID
  - Returns: React Query result
  - Only fetches when ID is provided

**Features:**
- Uses React Query for caching and state management
- Handles different API response structures
- 5-minute stale time for efficient caching
- Automatic refetching capabilities

### 2. Updated API Config
**File:** `frontend/src/config/api.config.js`

Added missing endpoint:
```javascript
GET_BY_ID: (id) => `/barangays/${id}`
```

## Usage

### Fetch All Barangays:
```javascript
import { useBarangays } from '../hooks/useBarangays';

const MyComponent = () => {
    const { barangays, isLoading, error } = useBarangays();
    
    if (isLoading) return <Spinner />;
    if (error) return <Error />;
    
    return (
        <select>
            {barangays.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
            ))}
        </select>
    );
};
```

### Fetch Single Barangay:
```javascript
import { useBarangay } from '../hooks/useBarangays';

const MyComponent = ({ barangayId }) => {
    const { data, isLoading } = useBarangay(barangayId);
    
    return <div>{data?.name}</div>;
};
```

## API Integration

**Backend Endpoint:** `GET /api/v1/barangays`

**Expected Response:**
```json
{
    "success": true,
    "data": {
        "barangays": [
            {
                "id": 1,
                "name": "Barangay Name",
                "risk_level": "medium",
                ...
            }
        ]
    }
}
```

## Files Created/Modified

### Created:
- `frontend/src/hooks/useBarangays.js` - New hook

### Modified:
- `frontend/src/config/api.config.js` - Added GET_BY_ID endpoint

## Status
✅ **COMPLETE** - EditIncident page should now load without import errors
