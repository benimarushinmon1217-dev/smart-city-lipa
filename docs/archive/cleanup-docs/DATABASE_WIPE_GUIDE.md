# 🗑️ Database Wipe Guide - Linisin ang Test Data

**Last Updated:** May 15, 2026  
**Purpose:** I-clear lahat ng test data at mag-start fresh

---

## 🎯 Quick Guide (Tagalog)

### Ano ang Mangyayari?
Ide-delete lahat ng:
- ❌ Test incidents
- ❌ Test reports
- ❌ Test notifications
- ❌ Test users (pwede mo i-keep ang account mo)
- ❌ Test traffic data
- ❌ Test announcements
- ❌ Lahat ng kalokohan na test data 😄

### Ano ang Hindi Mawawala?
- ✅ Database structure (tables, columns)
- ✅ Your admin account (kung gusto mo i-keep)
- ✅ **Barangays** (with GeoJSON data - VERY IMPORTANT!)
- ✅ **Establishments** (evacuation centers, hospitals, police stations, fire stations)
- ✅ **Emergency Contacts** (hotlines, emergency numbers)
- ✅ Backend code
- ✅ Frontend code

---

## 🚀 Paano Gamitin (3 Easy Steps)

### Step 1: Stop ang Backend (kung running)
```bash
# Press Ctrl + C sa terminal kung running ang backend
```

### Step 2: Run ang Wipe Script
```bash
cd backend
npm run db:wipe
```

### Step 3: Sundin ang Prompts

**Prompt 1:** "Are you ABSOLUTELY SURE you want to continue?"
- Type: `YES` (all caps)
- Press Enter

**Prompt 2:** "Do you want to keep your admin account?"
- Type: `Y` (kung gusto mo i-keep ang account mo)
- Type: `N` (kung gusto mo i-delete lahat including your account)

**Prompt 3:** (kung nag-type ka ng Y sa Prompt 2)
- "Enter the email of the account to keep:"
- Type: `ramoelnylbriones0909@gmail.com`
- Press Enter

**Done!** ✅ Malinis na ang database!

---

## 📋 Complete Step-by-Step (Detailed)

### Before You Start

1. **Backup Important Data (Optional)**
   ```bash
   # Kung may important data ka na gusto i-save
   mysqldump -u root -p smart_city_lipa > backup_$(date +%Y%m%d).sql
   ```

2. **Make Sure Backend is Stopped**
   - Press `Ctrl + C` sa backend terminal
   - Or close the terminal

### Running the Wipe

1. **Open Terminal**
   ```bash
   cd backend
   ```

2. **Run Wipe Command**
   ```bash
   npm run db:wipe
   ```

3. **You'll See This:**
   ```
   🚨 ============================================
   🚨  DATABASE WIPE SCRIPT
   🚨 ============================================

   ⚠️  WARNING: This will DELETE ALL DATA from the database!
   ⚠️  This action CANNOT be undone!

   📋 What will be deleted:
      - All users (except you can keep one admin)
      - All incidents
      - All reports
      - All notifications
      - All traffic data
      - All announcements

   ✅ What will be KEPT:
      - Barangays (with GeoJSON data)
      - Establishments (evacuation centers, hospitals, etc.)
      - Emergency Contacts (hotlines, emergency numbers)
      - Database structure

   ❓ Are you ABSOLUTELY SURE you want to continue? (type "YES" to confirm):
   ```

4. **Type `YES` and Press Enter**

5. **Next Prompt:**
   ```
   ❓ Do you want to keep your admin account? (Y/N):
   ```

6. **Type `Y` and Press Enter**

7. **Next Prompt:**
   ```
   📧 Enter the email of the account to keep:
   ```

8. **Type your email:**
   ```
   ramoelnylbriones0909@gmail.com
   ```

9. **Press Enter**

10. **You'll See:**
    ```
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

## 🔄 After Wiping - What to Do Next

### Option 1: Start Fresh (No Sample Data)

1. **Restart Backend**
   ```bash
   npm run dev
   ```

2. **Refresh Browser**
   - Go to http://localhost:5173
   - Login with your account
   - Start adding real data!

### Option 2: Add Sample Data (For Testing)

1. **Run Seed Script**
   ```bash
   npm run seed
   ```

2. **Restart Backend**
   ```bash
   npm run dev
   ```

3. **Refresh Browser**
   - You'll see sample incidents, reports, etc.
   - Good for testing features

---

## 🛡️ Safety Features

### Confirmation Required
- Hindi pwedeng aksidente - kailangan mo i-type "YES" (all caps)
- May option to cancel anytime

### Keep Your Account
- Pwede mo i-keep ang admin account mo
- Automatic na magiging admin ka
- Lahat ng iba ide-delete

### Database Structure Safe
- Hindi mawawala ang tables
- Hindi mawawala ang columns
- Structure lang, data lang ang mawawala

---

## 🐛 Troubleshooting

### Problem: "Error connecting to database"

**Solution:**
1. Check if MySQL is running
2. Check `.env` file credentials
3. Try:
   ```bash
   mysql -u root -p
   # If this works, MySQL is running
   ```

### Problem: "Cannot find module"

**Solution:**
```bash
cd backend
npm install
npm run db:wipe
```

### Problem: Script hangs or freezes

**Solution:**
1. Press `Ctrl + C` to cancel
2. Check if backend is running (stop it first)
3. Try again

### Problem: "Foreign key constraint fails"

**Solution:**
- The script handles this automatically
- If it still fails, try:
  ```bash
  mysql -u root -p
  USE smart_city_lipa;
  SET FOREIGN_KEY_CHECKS = 0;
  # Then run wipe script again
  ```

---

## 📊 What Gets Deleted (Detailed)

### Users Table
- All test users
- All staff accounts
- All admin accounts (except the one you keep)
- **Kept:** Your admin account (if you choose to keep it)

### Incidents Table
- All reported incidents
- All verified incidents
- All resolved incidents
- All incident photos/attachments

### Reports Table
- All hazard reports
- All infrastructure reports
- All environmental reports
- All public safety reports

### Notifications Table
- All user notifications
- All system notifications
- All broadcast notifications

### Barangays Table
- ✅ **KEPT** - Barangays are NOT deleted!
- Contains GeoJSON data critical for map
- Contains risk assessment data
- Contains population data

### Establishments Table
- ✅ **KEPT** - Establishments are NOT deleted!
- Evacuation centers remain
- Hospitals remain
- Police stations remain
- Fire stations remain

### Emergency Contacts Table
- ✅ **KEPT** - Emergency contacts are NOT deleted!
- Police hotlines remain (e.g., 911, local police)
- Fire department numbers remain
- Hospital emergency numbers remain
- Disaster response hotlines remain
- Government emergency contacts remain

### Traffic Data Table
- All traffic records
- All road condition data

### Announcements Table
- All emergency broadcasts
- All system announcements

---

## 🔐 Security Notes

### Who Can Run This?
- Anyone with access to the backend terminal
- Anyone with database credentials
- **Recommendation:** Only run this in development!

### Production Warning
⚠️ **NEVER run this in production!**
- This is for development/testing only
- Production data should be backed up first
- Use proper migration scripts for production

### Backup Recommendation
Before wiping, backup your database:
```bash
mysqldump -u root -p smart_city_lipa > backup.sql
```

To restore if needed:
```bash
mysql -u root -p smart_city_lipa < backup.sql
```

---

## 🎯 Common Use Cases

### Use Case 1: Too Much Test Data
**Scenario:** Maraming test incidents, reports, users na kalokohan lang

**Solution:**
```bash
cd backend
npm run db:wipe
# Keep your admin account
# Start fresh!
```

### Use Case 2: Want to Demo to Someone
**Scenario:** May ipapakita ka sa iba, gusto mo clean data

**Solution:**
```bash
cd backend
npm run db:wipe
npm run seed  # Add sample data
npm run dev
```

### Use Case 3: Database is Messy
**Scenario:** May errors, duplicates, or corrupted data

**Solution:**
```bash
cd backend
npm run db:wipe
npm run db:sync  # Recreate structure if needed
npm run seed     # Add fresh sample data
npm run dev
```

### Use Case 4: Starting Development Again
**Scenario:** Bumalik ka after a while, gusto mo fresh start

**Solution:**
```bash
cd backend
npm run db:wipe
# Keep your admin account
npm run dev
```

---

## 📝 Quick Reference Commands

### Wipe Database
```bash
cd backend
npm run db:wipe
```

### Wipe + Seed Sample Data
```bash
cd backend
npm run db:wipe
npm run seed
npm run dev
```

### Backup Before Wipe
```bash
mysqldump -u root -p smart_city_lipa > backup.sql
cd backend
npm run db:wipe
```

### Restore from Backup
```bash
mysql -u root -p smart_city_lipa < backup.sql
```

### Check What's in Database
```bash
mysql -u root -p
USE smart_city_lipa;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM incidents;
SELECT COUNT(*) FROM reports;
EXIT;
```

---

## ✅ Verification After Wipe

### Check if Wipe was Successful

1. **Login to MySQL**
   ```bash
   mysql -u root -p
   USE smart_city_lipa;
   ```

2. **Check Tables**
   ```sql
   SELECT COUNT(*) as user_count FROM users;
   SELECT COUNT(*) as incident_count FROM incidents;
   SELECT COUNT(*) as report_count FROM reports;
   ```

3. **Expected Results:**
   - `user_count`: 1 (your admin account)
   - `incident_count`: 0
   - `report_count`: 0

4. **Check Your Account**
   ```sql
   SELECT email, role FROM users;
   ```
   Should show your email with role = 'admin'

---

## 🎉 Success Checklist

After wiping, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads properly
- [ ] Can login with your admin account
- [ ] No old test data visible
- [ ] Map is clean (no old incidents)
- [ ] Notifications are empty
- [ ] Reports page is empty
- [ ] Admin dashboard shows 0 or 1 user

If all checked, **wipe was successful!** ✅

---

## 💡 Pro Tips

### Tip 1: Wipe Regularly During Development
- Keeps database clean
- Easier to test features
- Faster to find bugs

### Tip 2: Use Seed Data for Testing
- After wipe, run `npm run seed`
- Gets you sample data quickly
- Good for testing features

### Tip 3: Keep a Backup
- Before major wipes, backup first
- `mysqldump -u root -p smart_city_lipa > backup.sql`
- Peace of mind!

### Tip 4: Document Your Test Data
- If you add important test data
- Document it before wiping
- Or export specific records

---

## 🆘 Emergency: Accidentally Wiped?

### If You Have a Backup
```bash
mysql -u root -p smart_city_lipa < backup.sql
```

### If No Backup
1. Don't panic! 😅
2. Database structure is still there
3. Just add data again:
   ```bash
   npm run seed  # Add sample data
   ```
4. Or start fresh with real data

### If You Deleted Your Account Too
1. Register a new account through the app
2. Update role in database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

---

## 📞 Need Help?

If something goes wrong:

1. **Check backend logs**
   ```bash
   cd backend
   npm run dev
   # Look for errors
   ```

2. **Check database connection**
   ```bash
   mysql -u root -p
   USE smart_city_lipa;
   SHOW TABLES;
   ```

3. **Restart everything**
   ```bash
   # Stop backend (Ctrl + C)
   # Stop frontend (Ctrl + C)
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

---

**Status:** Ready to wipe! 🗑️  
**Command:** `cd backend && npm run db:wipe`  
**Safety:** Confirmation required, can keep your account  
**Result:** Clean database, fresh start! ✨

**Linisin na natin yan!** 😄🚀
