# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] All static asset paths converted to root-relative format
- [x] 15 path fixes applied across 4 files
- [x] Flask app.py configured correctly
- [x] No syntax errors in any files
- [x] All functionality preserved

---

## 📦 Files Ready for Deployment

### Modified Files (Ready to Deploy)
1. ✅ `index.html` - 3 paths fixed
2. ✅ `js/map.js` - 1 path fixed
3. ✅ `js/layers.js` - 7 paths fixed
4. ✅ `js/utils.js` - 4 paths fixed
5. ✅ `app.py` - Already correct

### Static Assets (No Changes Needed)
- ✅ `css/style.css` - No changes
- ✅ `images/` folder - 71 files
- ✅ `data/` folder - 2 GeoJSON files

---

## 🔧 Deployment Steps

### 1. Commit Changes
```bash
git add index.html js/map.js js/layers.js js/utils.js
git commit -m "Fix: Convert all asset paths to root-relative for Flask deployment"
git push origin main
```

### 2. Render Will Auto-Deploy
- Render detects the push
- Builds and deploys automatically
- Check Render dashboard for deployment status

### 3. Environment Variables (Verify on Render)
Ensure these are set in Render dashboard:
```
GROQ_API_KEY=your_api_key_here
PORT=10000 (or Render's default)
```

---

## 🧪 Post-Deployment Testing

### Critical Tests (Must Pass)

#### 1. Page Loads
- [ ] Open your Render URL
- [ ] Page should be fully styled (not plain HTML)
- [ ] No console errors (F12 → Console)

#### 2. Assets Load
- [ ] CSS applies (page has colors, layout)
- [ ] JavaScript executes (map appears)
- [ ] Default image shows in sidebar
- [ ] Legend icons visible

#### 3. Map Functionality
- [ ] Leaflet map initializes
- [ ] Barangay dropdown populates
- [ ] Can select barangay from dropdown
- [ ] Map zooms to selected area
- [ ] Barangay image loads (or shows default)

#### 4. Layer Toggles
- [ ] Barangays layer checkbox works
- [ ] Flood Risk layer checkbox works
- [ ] Ashfall Risk layer checkbox works
- [ ] Poblacion layer checkbox works
- [ ] Facility layer checkbox works
- [ ] Healthcare layer checkbox works

#### 5. Markers & Icons
- [ ] User location marker appears (📍)
- [ ] Evacuation center markers show
- [ ] Healthcare facility markers show
- [ ] School markers show
- [ ] Church markers show

#### 6. AI Chat
- [ ] Can type in chat input
- [ ] Send button works
- [ ] AI responds (requires GROQ_API_KEY)
- [ ] Chat history displays

#### 7. Action Buttons
- [ ] Emergency Hotlines modal opens
- [ ] Find Nearest Shelter works
- [ ] Evacuation Routes calculates
- [ ] Recompute Route works
- [ ] Report Flood modal opens

---

## 🐛 Troubleshooting

### Issue: Page is unstyled
**Check**: 
```
Browser Console → Network tab
Look for: /css/style.css
Status should be: 200 OK
```
**Fix**: Verify CSS path is `/css/style.css` in index.html

---

### Issue: Map doesn't load
**Check**:
```
Browser Console → Look for errors
Common: "Uncaught ReferenceError: L is not defined"
```
**Fix**: Verify Leaflet CDN loads before your scripts

---

### Issue: Barangay dropdown is empty
**Check**:
```
Browser Console → Network tab
Look for: /data/lipa_barangays_risk_fixed.geojson
Status should be: 200 OK
```
**Fix**: Verify GeoJSON path is `/data/lipa_barangays_risk_fixed.geojson`

---

### Issue: Images don't load
**Check**:
```
Browser Console → Network tab
Look for: /images/default.jpg
Status should be: 200 OK
```
**Fix**: Verify all image paths start with `/images/`

---

### Issue: AI chat doesn't work
**Check**:
```
Render Dashboard → Environment Variables
Verify: GROQ_API_KEY is set
```
**Fix**: Add GROQ_API_KEY in Render settings

---

### Issue: 404 errors in console
**Check**:
```
Browser Console → Network tab
Look for red (failed) requests
```
**Fix**: Each 404 means a path is still relative, not root-relative

---

## 📊 Expected Network Requests

When page loads, you should see these successful (200) requests:

```
✅ GET / (index.html)
✅ GET /css/style.css
✅ GET /js/map.js
✅ GET /js/layers.js
✅ GET /js/utils.js
✅ GET /data/lipa_barangays_risk_fixed.geojson
✅ GET /data/poblacion_barangays.geojson
✅ GET /images/default.jpg
✅ GET /images/location.png
✅ GET /images/evacuation.png
✅ GET /images/hospital.png
✅ GET /images/clinic.png
✅ GET /images/school.png
✅ GET /images/church.png
✅ GET /images/government.png
```

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Page loads with full styling
2. ✅ Map displays with barangay boundaries
3. ✅ All layer toggles work
4. ✅ Markers and icons appear
5. ✅ Barangay selection works
6. ✅ Images load dynamically
7. ✅ AI chat responds
8. ✅ No 404 errors in console
9. ✅ All action buttons function
10. ✅ Mobile responsive (test on phone)

---

## 📱 Mobile Testing

After desktop verification, test on mobile:

- [ ] Page loads on mobile browser
- [ ] Map is responsive
- [ ] Buttons are tappable
- [ ] Sidebar scrolls properly
- [ ] Chat input works
- [ ] Geolocation works (if permitted)

---

## 🔄 Rollback Plan

If deployment fails:

1. **Check Render logs** for errors
2. **Revert commit** if needed:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Contact support** with error logs

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Flask Docs**: https://flask.palletsprojects.com/
- **Leaflet Docs**: https://leafletjs.com/reference.html
- **Project Docs**: See DEPLOYMENT_FIXES.md

---

## ✨ Final Notes

- All paths are now root-relative (`/path/to/file`)
- Flask serves static files from project root
- No code logic was changed
- All functionality preserved
- Ready for production deployment

**Status**: 🟢 READY TO DEPLOY

---

*Checklist created: May 10, 2026*
*All 15 asset paths fixed and verified*
