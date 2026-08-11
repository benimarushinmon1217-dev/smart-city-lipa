# 🗺️ Smart City Lipa - Navigation Map

Complete guide to all routes and navigation in the platform.

---

## 📍 Route Structure

### Public Routes (No Authentication Required)
```
/login              → Login Page
/register           → Registration Page
/404                → Not Found Page
```

### Protected Routes (Authentication Required)
```
/                   → Dashboard (redirects to /dashboard)
/dashboard          → Main Dashboard
/map                → Smart Map View
/incidents          → Incident List
/incidents/new      → Create Incident
/incidents/:id      → Incident Details
/reports            → Report List
/reports/new        → Create Report
/reports/:id        → Report Details
/profile            → User Profile
/settings           → User Settings
/notifications      → Notifications Page
```

### Admin Routes (Admin Role Required)
```
/admin              → Admin Dashboard
/admin/users        → User Management
/admin/incidents    → Incident Management
```

---

## 🧭 Sidebar Navigation

### Main Navigation (All Users)
```
📊 Dashboard        → /dashboard
🗺️  Map View         → /map
⚠️  Incidents        → /incidents
📄 Reports          → /reports
🔔 Notifications    → /notifications
```

### Admin Navigation (Admin Only)
```
--- Administration ---
📊 Admin Dashboard  → /admin
👥 User Management  → /admin/users
⚠️  Incident Mgmt    → /admin/incidents
```

### Footer Navigation
```
⚙️  Settings         → /settings
```

---

## 🎯 Navbar Actions

### Right Side Menu
```
🔔 Notification Bell → Dropdown with recent notifications
👤 User Menu         → Dropdown with:
   - Profile         → /profile
   - Settings        → /settings
   - Logout          → Logout action
```

---

## 🔗 Quick Access Links

### From Dashboard
- View all incidents → `/incidents`
- View map → `/map`
- Create incident → `/incidents/new`
- View reports → `/reports`

### From Incident List
- Create new → `/incidents/new`
- View details → `/incidents/:id`

### From Report List
- Create new → `/reports/new`
- View details → `/reports/:id`

### From Map View
- Click marker → Opens incident popup
- View incident → `/incidents/:id`

### From Admin Dashboard
- Manage users → `/admin/users`
- Manage incidents → `/admin/incidents`
- View incident → `/incidents/:id`

---

## 🎨 Page Components

### Dashboard (`/dashboard`)
**Components**:
- Statistics cards (4)
- Recent incidents list
- Quick actions
- Live incident feed
- Map preview

**Actions**:
- Create incident
- View all incidents
- View map
- View reports

---

### Map View (`/map`)
**Components**:
- Interactive Leaflet map
- Incident markers
- Barangay layers
- Hazard overlays
- Shelter markers
- Route display
- Road status overlay
- Layer controls
- AI Advisor widget

**Actions**:
- Click markers for details
- Toggle layers
- View incident details
- Get AI recommendations

---

### Incident List (`/incidents`)
**Components**:
- Search bar
- Filters (status, severity, type)
- Incident cards
- Pagination

**Actions**:
- Create new incident
- View incident details
- Filter incidents
- Search incidents

---

### Create Incident (`/incidents/new`)
**Components**:
- Multi-step form
- Image upload
- Location picker
- Severity selector
- Type selector

**Actions**:
- Upload photos
- Select location
- Submit incident
- Cancel

---

### Incident Details (`/incidents/:id`)
**Components**:
- Incident information
- Image gallery
- Location map
- Status badge
- Severity indicator
- Comments section
- Action buttons

**Actions**:
- Edit incident (if owner)
- Delete incident (if owner/admin)
- Verify incident (admin only)
- Add comment
- Share incident

---

### Report List (`/reports`)
**Components**:
- Search bar
- Filters (status, type)
- Report cards
- Pagination

**Actions**:
- Create new report
- View report details
- Filter reports
- Search reports

---

### Create Report (`/reports/new`)
**Components**:
- Report form
- Image upload
- Type selector
- Location input

**Actions**:
- Upload photos
- Submit report
- Cancel

---

### Report Details (`/reports/:id`)
**Components**:
- Report information
- Images
- Status badge
- Location

**Actions**:
- Edit report (if owner)
- Delete report (if owner/admin)

---

### Profile (`/profile`)
**Components**:
- User avatar
- Personal information
- Statistics
- Edit form

**Actions**:
- Edit profile
- Upload avatar
- Update information
- View statistics

---

### Settings (`/settings`)
**Components**:
- Tabs (Notifications, Location, Privacy, Account)
- Notification preferences
- Location settings
- Privacy controls
- Account information

**Actions**:
- Toggle notifications
- Update preferences
- Download data
- Delete account

---

### Notifications (`/notifications`)
**Components**:
- Filter tabs (All, Unread, Read)
- Notification list
- Action buttons

**Actions**:
- Mark as read
- Delete notification
- Mark all as read
- Clear all
- Filter notifications

---

### Admin Dashboard (`/admin`)
**Components**:
- System statistics (6 cards)
- Emergency broadcast panel
- Moderation queue
- Active alerts panel
- Shelter monitoring
- Hazard statistics

**Actions**:
- Send emergency broadcast
- Verify incidents
- Reject incidents
- Manage shelters
- View analytics

---

### User Management (`/admin/users`)
**Components**:
- User table
- Search bar
- Filters
- Pagination

**Actions**:
- Create user
- Edit user
- Delete user
- Change role
- Ban/unban user

---

### Incident Management (`/admin/incidents`)
**Components**:
- Incident table
- Search bar
- Filters (status, severity)
- Statistics cards
- Pagination

**Actions**:
- View incident
- Verify incident
- Delete incident
- Filter incidents
- Search incidents

---

## 🔄 Navigation Flow Examples

### User Reports Incident
```
Dashboard → Incidents → Create Incident → Fill Form → Submit
→ Incident Details → Back to Incidents
```

### Admin Verifies Incident
```
Admin Dashboard → Moderation Queue → Click Verify
→ Incident verified → Real-time update to all users
```

### User Checks Notifications
```
Click Notification Bell → View notifications → Click notification
→ Navigate to related incident/report
```

### User Views Map
```
Dashboard → Map View → Click incident marker → View popup
→ Click "View Details" → Incident Details
```

### Admin Manages Users
```
Admin Dashboard → User Management → Search user
→ Click Edit → Update role → Save
```

---

## 🎯 Breadcrumb Navigation

### Example Breadcrumbs
```
Dashboard > Incidents > Incident Details
Dashboard > Reports > Create Report
Admin > User Management
Admin > Incident Management > Incident Details
Profile > Settings
```

---

## 🔐 Access Control

### Public Access
- Login page
- Register page
- 404 page

### Authenticated Users
- All main routes
- Profile & settings
- Create incidents/reports
- View notifications

### Admin Only
- Admin dashboard
- User management
- Incident management
- Emergency broadcast
- System statistics

---

## 📱 Mobile Navigation

### Mobile Menu
- Hamburger icon (top-left)
- Slide-out sidebar
- Same navigation structure
- Touch-optimized

### Mobile Navbar
- Logo (center)
- Menu icon (left)
- Notification bell (right)
- User menu (right)

---

## 🎨 Visual Indicators

### Active Route
- Highlighted in sidebar
- Blue background
- Blue text color

### Unread Notifications
- Red badge with count
- Pulsing animation

### Admin Section
- Separated with divider
- "Administration" label
- Different icon color

### Live Updates
- Pulsing dot indicator
- "Live" badge
- Real-time counter

---

## 🚀 Quick Actions

### Keyboard Shortcuts (Future Enhancement)
```
Ctrl/Cmd + K     → Quick search
Ctrl/Cmd + N     → New incident
Ctrl/Cmd + M     → Open map
Ctrl/Cmd + /     → Open AI advisor
Esc              → Close modals
```

---

## 🔍 Search & Filters

### Global Search (Future Enhancement)
- Search incidents
- Search reports
- Search users (admin)
- Search notifications

### Available Filters
- **Incidents**: Status, Severity, Type, Barangay, Date
- **Reports**: Status, Type, Barangay, Date
- **Notifications**: Status (Read/Unread), Type
- **Users (Admin)**: Role, Status, Date

---

## 📊 Navigation Analytics (Recommended)

Track user navigation patterns:
- Most visited pages
- Average time per page
- Navigation paths
- Drop-off points
- Feature usage

---

**Last Updated**: January 2024  
**Version**: 3.0.0
