# 🔐 Admin Access Guide - Smart City Lipa

**Last Updated:** May 15, 2026

---

## 🎯 Quick Answer

To access the admin side, you need to **change your user role to 'admin'** in the database.

---

## 📋 Table of Contents

1. [Understanding User Roles](#understanding-user-roles)
2. [How to Make Yourself Admin](#how-to-make-yourself-admin)
3. [Accessing Admin Features](#accessing-admin-features)
4. [Admin Routes and Features](#admin-routes-and-features)
5. [Creating Additional Admin Users](#creating-additional-admin-users)

---

## 🔑 Understanding User Roles

Your system has **3 user roles**:

| Role | Access Level | Description |
|------|-------------|-------------|
| **user** | Basic | Can report incidents, view map, use AI advisor |
| **staff** | Moderate | Can moderate incidents, view analytics |
| **admin** | Full | Complete access to all features including user management |

**Your current role:** Probably `user` (default when you registered)

---

## 🛠️ How to Make Yourself Admin

### Method 1: Using MySQL Command Line (Recommended)

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```

2. **Enter your MySQL password**

3. **Select the database:**
   ```sql
   USE smart_city_lipa;
   ```

4. **Check your current role:**
   ```sql
   SELECT id, first_name, last_name, email, role 
   FROM users 
   WHERE email = 'ramoelnylbriones0909@gmail.com';
   ```

5. **Update your role to admin:**
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'ramoelnylbriones0909@gmail.com';
   ```

6. **Verify the change:**
   ```sql
   SELECT id, first_name, last_name, email, role 
   FROM users 
   WHERE email = 'ramoelnylbriones0909@gmail.com';
   ```
   
   You should see `role: admin`

7. **Exit MySQL:**
   ```sql
   EXIT;
   ```

### Method 2: Using MySQL Workbench (GUI)

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Click on "smart_city_lipa" database**
4. **Click on "users" table**
5. **Find your user row**
6. **Double-click the "role" column**
7. **Change value from "user" to "admin"**
8. **Click "Apply"**
9. **Click "Apply" again to confirm**

### Method 3: Using phpMyAdmin (if installed)

1. **Open phpMyAdmin** (usually http://localhost/phpmyadmin)
2. **Select "smart_city_lipa" database**
3. **Click on "users" table**
4. **Click "Edit" (pencil icon) on your user row**
5. **Change "role" dropdown to "admin"**
6. **Click "Go" to save**

---

## 🚪 Accessing Admin Features

### Step 1: Update Your Role (see above)

### Step 2: Logout and Login Again

**Important:** You must logout and login again for the role change to take effect!

1. **In the app, click your profile icon**
2. **Click "Logout"**
3. **Login again with your credentials:**
   - Email: `ramoelnylbriones0909@gmail.com`
   - Password: (your password)

### Step 3: Access Admin Dashboard

After logging in as admin, you'll see new menu items in the sidebar:

**Admin Menu Items:**
- 🎛️ **Admin Dashboard** - System overview and statistics
- 👥 **User Management** - Manage all users
- 🚨 **Incident Moderation** - Verify/reject incident reports
- 📢 **Emergency Broadcast** - Send city-wide alerts
- 🏠 **Shelter Management** - Monitor evacuation centers
- 📊 **Analytics** - System analytics and reports

### Step 4: Navigate to Admin Pages

**Direct URLs:**
- Admin Dashboard: `http://localhost:5173/admin`
- User Management: `http://localhost:5173/admin/users`
- Incident Moderation: `http://localhost:5173/admin/incidents`
- Emergency Broadcast: `http://localhost:5173/admin/broadcast`

---

## 🎛️ Admin Routes and Features

### 1. Admin Dashboard (`/admin`)
**What you can do:**
- View system-wide statistics
- Monitor active incidents
- See user activity
- Track shelter capacity
- View recent reports

**Key Metrics:**
- Total users
- Active incidents
- Pending moderation
- Shelter occupancy
- System health

### 2. User Management (`/admin/users`)
**What you can do:**
- View all registered users
- Search and filter users
- Change user roles (user → staff → admin)
- Activate/deactivate accounts
- View user details
- Delete users

**Actions:**
- Click "Change Role" to promote/demote users
- Click "Deactivate" to suspend accounts
- Click "Delete" to remove users

### 3. Incident Moderation (`/admin/incidents`)
**What you can do:**
- Review pending incident reports
- Verify legitimate incidents
- Reject fake/spam reports
- Add verification notes
- View incident photos
- Track incident status

**Workflow:**
1. User reports incident → Status: "Pending"
2. Admin reviews → Verify or Reject
3. If verified → Appears on public map
4. If rejected → Hidden from public

### 4. Emergency Broadcast (`/admin/broadcast`)
**What you can do:**
- Send city-wide emergency alerts
- Target specific barangays
- Set alert severity (Info, Warning, Critical)
- View broadcast history
- Track delivery status

**Use Cases:**
- Typhoon warnings
- Evacuation orders
- Emergency announcements
- System maintenance notices

### 5. Shelter Management (`/admin/shelters`)
**What you can do:**
- Monitor all evacuation centers
- Update shelter capacity
- Mark shelters as full/available
- View current occupancy
- Manage shelter resources

### 6. Analytics Dashboard (`/admin/analytics`)
**What you can do:**
- View incident trends
- Analyze user engagement
- Track response times
- Generate reports
- Export data

---

## 👥 Creating Additional Admin Users

### Option 1: Through User Management (After you're admin)

1. **Login as admin**
2. **Go to User Management** (`/admin/users`)
3. **Find the user you want to promote**
4. **Click "Change Role"**
5. **Select "admin"**
6. **Confirm**

### Option 2: Through Database (Before you're admin)

```sql
-- Make any user an admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Make multiple users admin
UPDATE users 
SET role = 'admin' 
WHERE email IN ('user1@example.com', 'user2@example.com');
```

### Option 3: Create New Admin User

```sql
-- First, register the user through the app
-- Then update their role in database

UPDATE users 
SET role = 'admin' 
WHERE email = 'newadmin@example.com';
```

---

## 🔒 Security Notes

### Admin Privileges

Admins have **full access** to:
- ✅ All user data
- ✅ All incidents and reports
- ✅ System configuration
- ✅ Emergency broadcasting
- ✅ User management
- ✅ Data deletion

### Best Practices

1. **Limit Admin Accounts**
   - Only give admin access to trusted personnel
   - Use "staff" role for moderators

2. **Use Strong Passwords**
   - Admin accounts should have strong passwords
   - Change passwords regularly

3. **Monitor Admin Actions**
   - All admin actions are logged
   - Review logs regularly

4. **Separate Accounts**
   - Don't use admin account for daily tasks
   - Have a separate "user" account for testing

---

## 🐛 Troubleshooting

### Problem: "Access Denied" after changing role

**Solution:**
1. Make sure you logged out completely
2. Clear browser cache (Ctrl + Shift + Delete)
3. Login again
4. Check if role was actually updated in database

### Problem: Admin menu items not showing

**Solution:**
1. Verify role in database:
   ```sql
   SELECT email, role FROM users WHERE email = 'your@email.com';
   ```
2. Logout and login again
3. Check browser console for errors (F12)

### Problem: Can't access admin routes

**Solution:**
1. Check if you're logged in
2. Verify role is 'admin' (not 'Admin' or 'ADMIN')
3. Check backend logs for authentication errors
4. Restart backend server

### Problem: Role change not persisting

**Solution:**
1. Check database connection
2. Verify SQL command executed successfully
3. Check for database errors in backend logs

---

## 📝 Quick Reference Commands

### Check Your Current Role
```sql
SELECT email, role FROM users WHERE email = 'ramoelnylbriones0909@gmail.com';
```

### Make Yourself Admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'ramoelnylbriones0909@gmail.com';
```

### List All Admins
```sql
SELECT id, first_name, last_name, email, role FROM users WHERE role = 'admin';
```

### List All Users by Role
```sql
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

### Demote Admin to User
```sql
UPDATE users SET role = 'user' WHERE email = 'user@example.com';
```

---

## 🎯 Step-by-Step: First Time Admin Access

**Follow these exact steps:**

1. ✅ **Open MySQL Command Line**
   ```bash
   mysql -u root -p
   ```

2. ✅ **Enter your MySQL password**

3. ✅ **Select database**
   ```sql
   USE smart_city_lipa;
   ```

4. ✅ **Update your role**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'ramoelnylbriones0909@gmail.com';
   ```

5. ✅ **Verify change**
   ```sql
   SELECT email, role FROM users WHERE email = 'ramoelnylbriones0909@gmail.com';
   ```
   Should show: `role: admin`

6. ✅ **Exit MySQL**
   ```sql
   EXIT;
   ```

7. ✅ **Go to your app** (http://localhost:5173)

8. ✅ **Logout** (click profile → Logout)

9. ✅ **Login again**
   - Email: ramoelnylbriones0909@gmail.com
   - Password: (your password)

10. ✅ **Check sidebar** - You should now see admin menu items!

11. ✅ **Click "Admin Dashboard"** or go to http://localhost:5173/admin

12. ✅ **You're now an admin!** 🎉

---

## 📸 What Admin Interface Looks Like

### Sidebar (Admin View)
```
📊 Dashboard
🗺️ Map
🚨 Incidents
📝 Reports
🔔 Notifications
👤 Profile

--- ADMIN SECTION ---
🎛️ Admin Dashboard    ← NEW
👥 User Management     ← NEW
🚨 Moderation Queue    ← NEW
📢 Emergency Broadcast ← NEW
🏠 Shelter Management  ← NEW
📊 Analytics           ← NEW
```

### Admin Dashboard
```
┌─────────────────────────────────────┐
│  📊 System Statistics               │
├─────────────────────────────────────┤
│  Total Users: 150                   │
│  Active Incidents: 12               │
│  Pending Moderation: 5              │
│  Shelter Capacity: 75%              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🚨 Recent Incidents                │
│  [List of recent incidents]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  👥 User Activity                   │
│  [User activity chart]              │
└─────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After making yourself admin, verify you can:

- [ ] See "Admin Dashboard" in sidebar
- [ ] Access `/admin` route
- [ ] Access `/admin/users` route
- [ ] View all users in User Management
- [ ] Change other users' roles
- [ ] Access Incident Moderation
- [ ] Send test emergency broadcast
- [ ] View system analytics

If you can do all of the above, **you're successfully an admin!** 🎉

---

## 🆘 Need Help?

If you're still having trouble:

1. **Check backend logs:**
   ```bash
   cd backend
   npm run dev
   # Look for authentication errors
   ```

2. **Check browser console:**
   - Press F12
   - Look for errors in Console tab

3. **Verify database connection:**
   ```bash
   cd backend
   node -e "require('./models').sequelize.authenticate().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e))"
   ```

---

**Status:** Ready to make yourself admin!  
**Next Action:** Follow the step-by-step guide above to gain admin access

**Good luck!** 🚀
