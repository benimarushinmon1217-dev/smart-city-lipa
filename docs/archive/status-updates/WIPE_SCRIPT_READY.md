# ✅ Database Wipe Script - Ready to Use!

**Date:** May 15, 2026  
**Status:** ✅ All Critical Infrastructure Preserved

---

## 🎯 Final Configuration

### ❌ What Gets DELETED (Test Data Only)
1. **Incidents** - All test incident reports
2. **Reports** - All test hazard/infrastructure reports  
3. **Notifications** - All test notifications
4. **Traffic Data** - All test traffic readings
5. **Announcements** - All test broadcasts
6. **Users** - All test users (except one admin you choose to keep)

### ✅ What Gets PRESERVED (Critical Infrastructure)
1. **Barangays** ⭐
   - GeoJSON polygon data for map boundaries
   - Risk assessment data (flood, ashfall)
   - Population and demographic data
   - **Why:** Deleting would break the entire map system!

2. **Establishments** ⭐
   - Evacuation centers
   - Hospitals
   - Police stations
   - Fire stations
   - **Why:** Deleting would break evacuation routing!

3. **Emergency Contacts** ⭐
   - Emergency hotlines (911, police, fire, etc.)
   - Disaster response contact numbers
   - Government emergency contacts
   - **Why:** Deleting would remove critical emergency info!

4. **Database Structure** ⭐
   - All tables remain
   - All columns remain
   - All relationships remain

---

## 🚀 How to Use

### Quick Command
```bash
cd backend
npm run db:wipe
```

### Interactive Prompts

**Prompt 1:** Confirmation
```
❓ Are you ABSOLUTELY SURE you want to continue? (type "YES" to confirm):
```
Type: `YES` (all caps)

**Prompt 2:** Keep Admin Account
```
❓ Do you want to keep your admin account? (Y/N):
```
Type: `Y`

**Prompt 3:** Admin Email
```
📧 Enter the email of the account to keep:
```
Type: `ramoelnylbriones0909@gmail.com`

### Expected Output
```
🗑️  Starting database wipe...

✅ Cleared table: notifications
✅ Cleared table: traffic_data
✅ Cleared table: reports
✅ Cleared table: incidents
✅ Cleared table: announcements
✅ Kept user: ramoelnylbriones0909@gmail.com (set as admin)
✅ Deleted all other users

🎉 ============================================
🎉  DATABASE WIPE COMPLETED!
🎉 ============================================

✅ All test data has been removed
✅ Database structure is intact
✅ Ready for fresh data

💡 Next steps:
   1. Restart your backend: npm run dev
   2. Optionally run seed: npm run seed
   3. Refresh your browser
```

---

## 🔍 Verification After Wipe

### Check What Remains
```bash
mysql -u root -p
USE smart_city_lipa;
```

```sql
-- Should show your barangays (e.g., 86)
SELECT COUNT(*) FROM barangays;

-- Should show your establishments (e.g., 6)
SELECT COUNT(*) FROM establishments;

-- Should show your emergency contacts (currently 0, but preserved)
SELECT COUNT(*) FROM emergency_contacts;

-- Should show 0 (test data cleared)
SELECT COUNT(*) FROM incidents;
SELECT COUNT(*) FROM reports;
SELECT COUNT(*) FROM notifications;
SELECT COUNT(*) FROM traffic_data;

-- Should show 1 (your admin account)
SELECT COUNT(*) FROM users;
SELECT email, role FROM users;
```

---

## 💡 After Wiping

### Option 1: Start Fresh (Production-Ready)
```bash
npm run dev
```
- Clean database
- Only your admin account
- All infrastructure intact
- Ready for real data

### Option 2: Add Sample Data (Testing)
```bash
npm run seed
npm run dev
```
- Adds sample incidents
- Adds sample reports
- Adds sample notifications
- Good for testing features

---

## 🎉 Benefits

### ✅ Map Still Works
- Barangay boundaries display correctly
- Risk zones show properly
- GeoJSON data intact

### ✅ Evacuation System Still Works
- Evacuation centers available
- Route recommendations function
- Emergency facilities accessible

### ✅ Emergency Info Preserved
- Hotlines remain available
- Contact numbers intact
- Critical emergency info safe

### ✅ Clean Test Data
- All "kalokohan" removed
- No duplicate test incidents
- No test notifications
- Fresh start!

### ✅ Keep Your Admin Account
- No need to re-register
- No need to update role manually
- Just keep using your account

---

## 📊 Summary Table

| Data Type | Status | Count After Wipe |
|-----------|--------|------------------|
| Barangays | ✅ KEPT | ~86 (unchanged) |
| Establishments | ✅ KEPT | ~6 (unchanged) |
| Emergency Contacts | ✅ KEPT | 0 (but table preserved) |
| Users | ⚠️ PARTIAL | 1 (your admin) |
| Incidents | ❌ DELETED | 0 |
| Reports | ❌ DELETED | 0 |
| Notifications | ❌ DELETED | 0 |
| Traffic Data | ❌ DELETED | 0 |
| Announcements | ❌ DELETED | 0 |

---

## 🛡️ Safety Features

### ✅ Confirmation Required
- Must type "YES" (all caps)
- Can cancel anytime
- No accidental wipes

### ✅ Keep Admin Account
- Choose to keep your account
- Automatically set to admin role
- All other users deleted

### ✅ Critical Data Protected
- Barangays preserved
- Establishments preserved
- Emergency contacts preserved
- Database structure preserved

### ✅ Foreign Key Handling
- Script handles constraints automatically
- No manual intervention needed
- Safe deletion order

---

## 📝 Files Modified

1. **`backend/wipeDatabase.js`**
   - Removed `'barangays'` from deletion
   - Removed `'establishments'` from deletion
   - Removed `'emergency_contacts'` from deletion
   - Updated console messages

2. **`DATABASE_WIPE_GUIDE.md`**
   - Updated all sections
   - Fixed example outputs
   - Updated table descriptions

3. **`DATABASE_WIPE_FIX_COMPLETE.md`**
   - Documented the fix process

4. **`WIPE_SCRIPT_READY.md`** (this file)
   - Final ready-to-use guide

---

## 🚀 Ready to Wipe!

Everything is configured correctly. The script will:
- ✅ Delete all test data (incidents, reports, notifications, traffic, announcements)
- ✅ Keep your admin account
- ✅ Preserve barangays (GeoJSON intact)
- ✅ Preserve establishments (evacuation centers intact)
- ✅ Preserve emergency contacts (hotlines intact)
- ✅ Keep database structure

**Command to run:**
```bash
cd backend
npm run db:wipe
```

**Linisin na natin yang mga kalokohan!** 😄🗑️✨

---

**Status:** ✅ Ready to Use  
**Safe:** Yes  
**Barangays:** ✅ Preserved  
**Establishments:** ✅ Preserved  
**Emergency Contacts:** ✅ Preserved  
**Your Admin Account:** ✅ Can be kept  

**GO!** 🚀

