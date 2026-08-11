# Incident Reporting - Authentication Required ✅

## Issue: 401 Unauthorized When Reporting Incident

### Error:
```
POST http://localhost:5000/api/v1/incidents 401 (Unauthorized)
```

### Root Cause:
The incident reporting endpoint requires authentication. You must be logged in to report an incident.

---

## Solution: Log In First

### Step 1: Go to Login Page
1. Click on your account icon in the top-right
2. Click "Logout" if you're partially logged in
3. Go to the login page

### Step 2: Log In or Register

**If you have an account:**
- Enter your email and password
- Click "Login"

**If you don't have an account:**
- Click "Register" or "Sign Up"
- Fill in your details:
  - First Name
  - Last Name
  - Email
  - Password
  - Phone Number (optional)
- Click "Register"

### Step 3: Report Incident
Once logged in:
1. Click "Report Incident" button
2. Fill in the incident details
3. Submit successfully ✅

---

## Why Authentication is Required

### Security Reasons:
1. **Accountability** - Know who reported each incident
2. **Spam Prevention** - Prevent anonymous spam reports
3. **Follow-up** - Contact reporter for updates
4. **Verification** - Verify reporter identity
5. **Audit Trail** - Track all incident reports

### User Benefits:
1. **Track Your Reports** - See status of your reports
2. **Get Updates** - Receive notifications about your incidents
3. **Edit Reports** - Update your incident reports
4. **View History** - See all your past reports

---

## Backend Configuration

### Incident Routes (backend/routes/incidentRoutes.js):

```javascript
// Protected routes - Create incident with image upload
router.post(
    '/',
    protect,  // ← Authentication required!
    upload.array('images', 5),
    createIncidentValidator,
    validate,
    incidentController.createIncident
);
```

The `protect` middleware checks for a valid JWT token in the request headers.

---

## How Authentication Works

### 1. Login Process:
```
User enters credentials
    ↓
Backend validates credentials
    ↓
Backend generates JWT token
    ↓
Token stored in localStorage
    ↓
Token sent with every API request
```

### 2. API Request with Auth:
```javascript
// API interceptor adds token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### 3. Backend Verification:
```javascript
// protect middleware verifies token
const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify token and attach user to request
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
};
```

---

## Alternative: Allow Anonymous Reporting (Optional)

If you want to allow anonymous incident reporting, you can modify the backend:

### Option 1: Make Auth Optional

```javascript
// backend/routes/incidentRoutes.js
router.post(
    '/',
    optionalAuth,  // ← Changed from 'protect' to 'optionalAuth'
    upload.array('images', 5),
    createIncidentValidator,
    validate,
    incidentController.createIncident
);
```

### Option 2: Create Separate Anonymous Endpoint

```javascript
// Public endpoint for anonymous reports
router.post(
    '/anonymous',
    upload.array('images', 5),
    createIncidentValidator,
    validate,
    incidentController.createAnonymousIncident
);

// Authenticated endpoint
router.post(
    '/',
    protect,
    upload.array('images', 5),
    createIncidentValidator,
    validate,
    incidentController.createIncident
);
```

---

## Testing Authentication

### Test 1: Check if Logged In

Open browser console and run:
```javascript
// Check if token exists
const token = localStorage.getItem('access_token');
console.log('Token:', token ? 'Present ✓' : 'Missing ✗');

// Check if user exists
const user = localStorage.getItem('user');
console.log('User:', user ? JSON.parse(user) : 'Not logged in ✗');
```

### Test 2: Check API Headers

1. Open DevTools (F12)
2. Go to Network tab
3. Try to report an incident
4. Click on the failed request
5. Check Headers tab
6. Look for `Authorization: Bearer <token>`

**If missing:** You're not logged in  
**If present:** Token might be expired

---

## Common Issues & Solutions

### Issue 1: "Token expired"
**Solution:**
- Log out and log in again
- Token will be refreshed automatically

### Issue 2: "Invalid token"
**Solution:**
- Clear localStorage
- Log in again
```javascript
localStorage.clear();
window.location.href = '/login';
```

### Issue 3: "User not found"
**Solution:**
- Your account might have been deleted
- Register a new account

### Issue 4: "Session expired"
**Solution:**
- Refresh token expired
- Log in again

---

## Quick Fix Steps

### For Users:
1. ✅ **Log in** to your account
2. ✅ **Try reporting** the incident again
3. ✅ **Should work** now!

### For Developers (if you want anonymous reporting):
1. Change `protect` to `optionalAuth` in incident routes
2. Modify controller to handle anonymous users
3. Store `user_id` as NULL for anonymous reports
4. Test thoroughly

---

## Summary

### Current Behavior:
❌ Anonymous users cannot report incidents  
✅ Logged-in users can report incidents  
✅ All reports are tracked to a user  
✅ Secure and accountable  

### To Report an Incident:
1. **Log in** to your account
2. Click **"Report Incident"**
3. Fill in the details
4. Submit successfully

### Benefits of Authentication:
- Track your reports
- Get updates and notifications
- Edit your reports
- View report history
- Secure and verified

---

**Status**: ✅ Working as designed  
**Action Required**: Log in before reporting incidents  
**Alternative**: Enable anonymous reporting (optional)  

🔐 Authentication ensures accountability and security!
