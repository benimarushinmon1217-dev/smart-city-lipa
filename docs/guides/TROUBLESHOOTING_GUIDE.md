# Troubleshooting Guide - Smart City Lipa

## 🔍 Quick Diagnostics

### Check System Status
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check if frontend is accessible
# Open http://localhost:5174 in browser
```

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check for "Socket connected" message

### Check LocalStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage → http://localhost:5174
4. Verify these keys exist:
   - `access_token`
   - `refresh_token`
   - `user`

---

## 🐛 Common Issues & Solutions

### Issue 1: Socket CORS Error (Still Appearing)

**Symptoms**:
```
Access-Control-Allow-Origin header has a value 'http://localhost:5173' 
that is not equal to the supplied origin
```

**Solutions**:
1. ✅ **Hard refresh browser**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. ✅ **Clear browser cache**: DevTools → Network → Disable cache
3. ✅ **Verify backend restarted**: Check backend terminal for startup messages
4. ✅ **Check socket.js file**: Ensure changes were saved

**Verification**:
```bash
# Check backend/config/socket.js contains:
origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174'
]
```

---

### Issue 2: removeAllListeners Error (Still Appearing)

**Symptoms**:
```
Uncaught TypeError: socketService.removeAllListeners is not a function
```

**Solutions**:
1. ✅ **Hard refresh browser**: Ctrl+F5 or Cmd+Shift+R
2. ✅ **Check file saved**: Verify `frontend/src/services/socketService.js` has the method
3. ✅ **Restart frontend**: Stop and restart `npm run dev`
4. ✅ **Clear Vite cache**: Delete `frontend/node_modules/.vite` folder

**Verification**:
```bash
# Check frontend/src/services/socketService.js contains removeAllListeners method
# Should be around line 120-135
```

---

### Issue 3: 401 Unauthorized Errors

**Symptoms**:
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

**Root Cause**: Token expired or not properly stored

**Solutions**:
1. ✅ **Log out and log back in**:
   - Click profile icon → Logout
   - Login again with your credentials
   
2. ✅ **Clear localStorage and login**:
   ```javascript
   // In browser console:
   localStorage.clear();
   // Then refresh and login again
   ```

3. ✅ **Check token in localStorage**:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('access_token'));
   // Should show a JWT token string
   ```

4. ✅ **Verify API interceptor**:
   - Check Network tab in DevTools
   - Click any API request
   - Check Headers → Request Headers
   - Should see: `Authorization: Bearer [token]`

---

### Issue 4: Components Crashing (Error Boundary)

**Symptoms**:
```
Error caught by boundary: TypeError: ...
```

**Solutions**:
1. ✅ **Check specific error message** in console
2. ✅ **Hard refresh browser**: Ctrl+F5
3. ✅ **Clear all caches**:
   ```bash
   # In frontend directory:
   rm -rf node_modules/.vite
   rm -rf dist
   ```
4. ✅ **Restart frontend server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

### Issue 5: Socket Not Connecting

**Symptoms**:
- No "Socket connected" message in console
- Socket connection error messages

**Solutions**:
1. ✅ **Check backend is running**:
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. ✅ **Check backend logs**:
   - Look at terminal running backend
   - Should see: "✅ Socket.io server initialized"

3. ✅ **Verify token exists**:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('access_token'));
   ```

4. ✅ **Check socket configuration**:
   - Open `frontend/src/config/socket.config.js`
   - Verify URL is `http://localhost:5000`

5. ✅ **Test socket endpoint**:
   ```bash
   curl http://localhost:5000/socket.io/
   # Should return socket.io response
   ```

---

### Issue 6: Frontend Not Loading

**Symptoms**:
- Blank page
- "Cannot GET /" error
- Build errors

**Solutions**:
1. ✅ **Check frontend server is running**:
   - Look for terminal with `npm run dev`
   - Should show: "Local: http://localhost:5174"

2. ✅ **Restart frontend**:
   ```bash
   # In frontend directory:
   npm run dev
   ```

3. ✅ **Check for build errors**:
   - Look at terminal output
   - Fix any import/syntax errors

4. ✅ **Reinstall dependencies**:
   ```bash
   # In frontend directory:
   rm -rf node_modules
   npm install --legacy-peer-deps
   npm run dev
   ```

---

### Issue 7: Backend Not Responding

**Symptoms**:
- API calls timeout
- "ERR_CONNECTION_REFUSED"
- No response from backend

**Solutions**:
1. ✅ **Check backend is running**:
   ```bash
   # In backend directory:
   npm start
   ```

2. ✅ **Check port 5000 is free**:
   ```bash
   # Windows:
   netstat -ano | findstr :5000
   
   # Mac/Linux:
   lsof -i :5000
   ```

3. ✅ **Check database connection**:
   - Look at backend terminal
   - Should see: "✅ Database connected"
   - If not, check `.env` file has correct DB credentials

4. ✅ **Check environment variables**:
   ```bash
   # Verify backend/.env exists and has:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=smart_city_lipa
   JWT_SECRET=your_secret
   ```

---

## 🔧 Advanced Troubleshooting

### Clear Everything and Start Fresh

If all else fails:

```bash
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Clear frontend cache
cd frontend
rm -rf node_modules/.vite
rm -rf dist

# 3. Restart frontend
npm run dev

# 4. In another terminal, restart backend
cd backend
npm start

# 5. Hard refresh browser (Ctrl+F5)

# 6. Clear localStorage and login again
```

### Check File Changes Were Saved

```bash
# Verify socket.js changes:
cat backend/config/socket.js | grep -A 5 "origin:"

# Verify socketService.js changes:
cat frontend/src/services/socketService.js | grep -A 10 "removeAllListeners"
```

### Verify Process IDs

```bash
# Check what's running on ports:
# Windows:
netstat -ano | findstr :5000
netstat -ano | findstr :5174

# Mac/Linux:
lsof -i :5000
lsof -i :5174
```

---

## 📊 Diagnostic Checklist

Use this checklist to systematically diagnose issues:

- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5174)
- [ ] Database is connected
- [ ] Browser cache cleared
- [ ] Hard refresh performed (Ctrl+F5)
- [ ] No errors in backend terminal
- [ ] No errors in frontend terminal
- [ ] No red errors in browser console
- [ ] localStorage has access_token
- [ ] Socket.io CORS includes port 5174
- [ ] socketService has removeAllListeners method
- [ ] User is logged in
- [ ] Network tab shows successful API calls

---

## 🆘 Still Having Issues?

### Gather Information

1. **Backend logs**: Copy last 50 lines from backend terminal
2. **Frontend logs**: Copy errors from browser console
3. **Network logs**: Check Network tab in DevTools for failed requests
4. **File verification**: Confirm changes in socket.js and socketService.js

### Check Documentation

- `SOCKET_FIX_SUMMARY.md` - Technical details of fixes
- `CURRENT_STATUS.md` - System status overview
- `QUICK_FIX_REFERENCE.md` - Quick solutions
- `FIXES_APPLIED.md` - What was changed

### Debug Mode

Enable verbose logging:

```javascript
// In browser console:
localStorage.setItem('debug', '*');
// Refresh page to see detailed socket.io logs
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend terminal shows:
   ```
   ✅ Database connected
   ✅ Socket.io server initialized
   🚀 Server running in development mode on port 5000
   ```

2. ✅ Frontend terminal shows:
   ```
   VITE ready in XXX ms
   ➜  Local:   http://localhost:5174/
   ```

3. ✅ Browser console shows:
   ```
   Socket connected: [socket-id]
   ```

4. ✅ No red errors anywhere
5. ✅ All components load
6. ✅ Can navigate all pages
7. ✅ Notifications work

---

## 📞 Quick Commands Reference

```bash
# Check backend health
curl http://localhost:5000/health

# Check backend API
curl http://localhost:5000/api/v1

# Restart backend
cd backend && npm start

# Restart frontend
cd frontend && npm run dev

# Clear frontend cache
rm -rf frontend/node_modules/.vite

# Check running processes
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

---

**Remember**: Most issues are resolved by:
1. Hard refresh (Ctrl+F5)
2. Log out and log back in
3. Restart servers
4. Clear caches

Good luck! 🚀
