# 📂 Complete File Tree

## 🌳 Project Structure Overview

```
smart-city-lipa/
│
├── 📄 README.md                          # Main project documentation
├── 📄 GETTING_STARTED.md                 # Quick start guide
├── 📄 ARCHITECTURE_OVERVIEW.md           # System architecture
├── 📄 PROJECT_STATUS.md                  # Current progress
├── 📄 QUICK_REFERENCE.md                 # Command cheat sheet
├── 📄 FILE_TREE.md                       # This file
│
├── 📁 backend/                           # ✅ Backend API (Node.js + Express)
│   │
│   ├── 📁 config/                        # Configuration files
│   │   ├── 📄 database.js                # ✅ Sequelize + MySQL connection
│   │   ├── 📄 jwt.js                     # ✅ JWT token configuration
│   │   ├── 📄 cors.js                    # ✅ CORS settings
│   │   └── 📄 multer.js                  # ✅ File upload configuration
│   │
│   ├── 📁 controllers/                   # Request handlers (HTTP layer)
│   │   └── 📄 authController.js          # ✅ Authentication endpoints
│   │       # ⏳ Other controllers to be added
│   │
│   ├── 📁 middleware/                    # Express middleware
│   │   ├── 📄 auth.js                    # ✅ JWT verification, RBAC
│   │   ├── 📄 validate.js                # ✅ Input validation
│   │   ├── 📄 errorHandler.js            # ✅ Global error handling
│   │   ├── 📄 rateLimiter.js             # ✅ Rate limiting
│   │   └── 📄 notFound.js                # ✅ 404 handler
│   │
│   ├── 📁 models/                        # Database models (Sequelize)
│   │   ├── 📄 User.js                    # ✅ User authentication & profile
│   │   ├── 📄 Barangay.js                # ✅ Geographic data & risk
│   │   ├── 📄 Incident.js                # ✅ Disaster incidents
│   │   ├── 📄 Report.js                  # ✅ User reports
│   │   ├── 📄 Establishment.js           # ✅ Facilities mapping
│   │   ├── 📄 Notification.js            # ✅ User notifications
│   │   ├── 📄 Announcement.js            # ✅ System announcements
│   │   ├── 📄 TrafficData.js             # ✅ Traffic monitoring
│   │   ├── 📄 EmergencyContact.js        # ✅ Emergency hotlines
│   │   └── 📄 index.js                   # ✅ Model relationships
│   │
│   ├── 📁 routes/                        # API route definitions
│   │   ├── 📄 authRoutes.js              # ✅ /api/v1/auth/*
│   │   ├── 📄 userRoutes.js              # ✅ /api/v1/users/*
│   │   ├── 📄 barangayRoutes.js          # ✅ /api/v1/barangays/*
│   │   ├── 📄 incidentRoutes.js          # ✅ /api/v1/incidents/*
│   │   ├── 📄 reportRoutes.js            # ✅ /api/v1/reports/*
│   │   ├── 📄 establishmentRoutes.js     # ✅ /api/v1/establishments/*
│   │   ├── 📄 notificationRoutes.js      # ✅ /api/v1/notifications/*
│   │   ├── 📄 announcementRoutes.js      # ✅ /api/v1/announcements/*
│   │   ├── 📄 trafficRoutes.js           # ✅ /api/v1/traffic/*
│   │   ├── 📄 emergencyContactRoutes.js  # ✅ /api/v1/emergency-contacts/*
│   │   └── 📄 aiRoutes.js                # ✅ /api/v1/ai/*
│   │
│   ├── 📁 services/                      # Business logic layer
│   │   └── 📄 authService.js             # ✅ Authentication logic
│   │       # ⏳ Other services to be added
│   │
│   ├── 📁 validators/                    # Input validation rules
│   │   └── 📄 authValidator.js           # ✅ Auth input validation
│   │       # ⏳ Other validators to be added
│   │
│   ├── 📁 utils/                         # Utility functions
│   │   ├── 📄 logger.js                  # ✅ Winston logging
│   │   ├── 📄 response.js                # ✅ Standardized API responses
│   │   ├── 📄 asyncHandler.js            # ✅ Async error wrapper
│   │   └── 📄 dbSync.js                  # ✅ Database sync utility
│   │
│   ├── 📁 uploads/                       # Uploaded files storage
│   │   ├── 📁 reports/                   # Report images
│   │   ├── 📁 incidents/                 # Incident images
│   │   ├── 📁 avatars/                   # User avatars
│   │   └── 📄 .gitkeep                   # Keep directory in git
│   │
│   ├── 📁 logs/                          # Application logs
│   │   ├── 📄 combined.log               # All logs
│   │   ├── 📄 error.log                  # Error logs only
│   │   └── 📄 .gitkeep                   # Keep directory in git
│   │
│   ├── 📄 app.js                         # ✅ Express app configuration
│   ├── 📄 server.js                      # ✅ Server entry point
│   ├── 📄 package.json                   # ✅ Dependencies & scripts
│   ├── 📄 .env                           # ✅ Environment variables (DO NOT COMMIT)
│   ├── 📄 .env.example                   # ✅ Example configuration
│   ├── 📄 .gitignore                     # ✅ Git ignore rules
│   ├── 📄 README.md                      # ✅ Backend documentation
│   └── 📄 SETUP_GUIDE.md                 # ✅ Quick setup guide
│
├── 📁 frontend/                          # ⏳ React Frontend (Not Started)
│   └── (To be created)
│
├── 📁 data/                              # GeoJSON data files
│   ├── 📄 lipa_barangays_risk_fixed.geojson  # Barangay boundaries & risk data
│   └── 📄 poblacion_barangays.geojson        # Poblacion area data
│
├── 📁 images/                            # Barangay images (71 files)
│   ├── 📄 adya.jpg
│   ├── 📄 anilao.jpg
│   ├── 📄 default.jpg
│   └── ... (68 more images)
│
├── 📁 css/                               # Old frontend styles
│   └── 📄 style.css
│
├── 📁 js/                                # Old frontend JavaScript
│   ├── 📄 map.js
│   ├── 📄 layers.js
│   └── 📄 utils.js
│
├── 📄 index.html                         # Old frontend HTML
├── 📄 app.py                             # Old Python Flask backend
└── 📄 .env                               # Old environment file
```

---

## 📊 File Status Legend

- ✅ **Complete** - Fully implemented and tested
- ⏳ **In Progress** - Partially implemented
- 📅 **Planned** - Not started yet
- 🔄 **To Be Migrated** - Old code to be replaced

---

## 🎯 Key Files to Know

### 🚀 Getting Started
```
GETTING_STARTED.md          # Start here!
QUICK_REFERENCE.md          # Command cheat sheet
backend/SETUP_GUIDE.md      # Backend setup
```

### 🏗️ Architecture
```
ARCHITECTURE_OVERVIEW.md    # System design
PROJECT_STATUS.md           # Current progress
backend/README.md           # API documentation
```

### ⚙️ Configuration
```
backend/.env                # Your settings (DO NOT COMMIT!)
backend/.env.example        # Template for .env
backend/config/database.js  # Database connection
backend/config/jwt.js       # JWT settings
```

### 🔐 Authentication
```
backend/routes/authRoutes.js        # Auth endpoints
backend/controllers/authController.js  # Auth handlers
backend/services/authService.js     # Auth business logic
backend/validators/authValidator.js # Auth validation
backend/middleware/auth.js          # JWT verification
```

### 🗄️ Database
```
backend/models/index.js     # Model relationships
backend/models/User.js      # User model
backend/models/Barangay.js  # Barangay model
backend/models/Incident.js  # Incident model
backend/utils/dbSync.js     # Database sync utility
```

### 🛠️ Core Files
```
backend/server.js           # Server entry point
backend/app.js              # Express app setup
backend/package.json        # Dependencies
```

---

## 📁 Directory Purposes

### `/backend/config/`
**Purpose:** Configuration files for database, JWT, CORS, file uploads  
**When to edit:** Setting up environment, changing security settings

### `/backend/controllers/`
**Purpose:** Handle HTTP requests, call services, return responses  
**When to edit:** Adding new API endpoints, modifying request handling

### `/backend/middleware/`
**Purpose:** Process requests before they reach controllers  
**When to edit:** Adding authentication, validation, or custom middleware

### `/backend/models/`
**Purpose:** Define database schema and relationships  
**When to edit:** Adding new tables, modifying database structure

### `/backend/routes/`
**Purpose:** Define API endpoints and map to controllers  
**When to edit:** Adding new routes, changing URL structure

### `/backend/services/`
**Purpose:** Business logic, data processing, external API calls  
**When to edit:** Implementing features, adding business rules

### `/backend/validators/`
**Purpose:** Input validation rules for API endpoints  
**When to edit:** Adding validation for new endpoints

### `/backend/utils/`
**Purpose:** Reusable utility functions  
**When to edit:** Adding helper functions, utilities

### `/backend/uploads/`
**Purpose:** Store uploaded files (images, documents)  
**When to edit:** Never edit directly, managed by Multer

### `/backend/logs/`
**Purpose:** Application logs for debugging and monitoring  
**When to edit:** Never edit directly, managed by Winston

---

## 🔍 Finding Files

### Need to add a new API endpoint?
1. Create route in `/backend/routes/`
2. Create controller in `/backend/controllers/`
3. Create service in `/backend/services/`
4. Add validation in `/backend/validators/`

### Need to add a new database table?
1. Create model in `/backend/models/`
2. Add relationships in `/backend/models/index.js`
3. Run `npm run db:sync`

### Need to change authentication?
1. Check `/backend/middleware/auth.js`
2. Modify `/backend/services/authService.js`
3. Update `/backend/controllers/authController.js`

### Need to configure environment?
1. Edit `/backend/.env`
2. Check `/backend/config/` files

---

## 📝 File Naming Conventions

### Models
```
User.js              # PascalCase, singular
Barangay.js
Incident.js
```

### Routes
```
authRoutes.js        # camelCase + Routes suffix
userRoutes.js
incidentRoutes.js
```

### Controllers
```
authController.js    # camelCase + Controller suffix
userController.js
incidentController.js
```

### Services
```
authService.js       # camelCase + Service suffix
userService.js
incidentService.js
```

### Validators
```
authValidator.js     # camelCase + Validator suffix
userValidator.js
incidentValidator.js
```

### Middleware
```
auth.js              # camelCase, descriptive name
validate.js
errorHandler.js
```

---

## 🎨 Code Organization Pattern

```
Feature: User Authentication

1. Route Definition
   📄 backend/routes/authRoutes.js
   └─► Defines: POST /api/v1/auth/login

2. Validation
   📄 backend/validators/authValidator.js
   └─► Validates: email, password format

3. Controller
   📄 backend/controllers/authController.js
   └─► Handles: HTTP request/response

4. Service
   📄 backend/services/authService.js
   └─► Contains: Business logic

5. Model
   📄 backend/models/User.js
   └─► Defines: Database schema

6. Middleware
   📄 backend/middleware/auth.js
   └─► Protects: Routes with JWT
```

---

## 🔄 Migration Path (Old → New)

### Old Files (To Be Replaced)
```
❌ app.py                    → ✅ backend/server.js
❌ index.html                → ✅ frontend/src/App.jsx
❌ js/map.js                 → ✅ frontend/src/components/Map.jsx
❌ js/layers.js              → ✅ frontend/src/services/mapService.js
❌ js/utils.js               → ✅ frontend/src/utils/helpers.js
❌ css/style.css             → ✅ frontend/src/styles/
```

### Files to Keep
```
✅ data/*.geojson            # GeoJSON data files
✅ images/*.jpg              # Barangay images
```

---

## 📦 Dependencies Overview

### Backend Dependencies (package.json)
```
Production:
├── express              # Web framework
├── mysql2               # MySQL driver
├── sequelize            # ORM
├── bcryptjs             # Password hashing
├── jsonwebtoken         # JWT tokens
├── dotenv               # Environment variables
├── cors                 # CORS middleware
├── express-validator    # Input validation
├── multer               # File uploads
├── morgan               # HTTP logging
├── helmet               # Security headers
├── express-rate-limit   # Rate limiting
├── winston              # Logging
└── axios                # HTTP client

Development:
├── nodemon              # Auto-reload
└── sequelize-cli        # Database migrations
```

---

## 🎯 Quick Navigation

### I want to...

**Add a new API endpoint**
→ Start in `/backend/routes/`

**Change database structure**
→ Edit `/backend/models/`

**Modify authentication**
→ Check `/backend/middleware/auth.js`

**Add validation rules**
→ Create in `/backend/validators/`

**Implement business logic**
→ Add to `/backend/services/`

**Configure environment**
→ Edit `/backend/.env`

**View logs**
→ Check `/backend/logs/`

**Upload files**
→ Configure `/backend/config/multer.js`

**Change security settings**
→ Edit `/backend/config/`

---

## 📚 Related Documentation

- [README.md](README.md) - Main documentation
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
- [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md) - System design
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Progress tracker
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Command reference

---

**Use this file tree as your navigation guide! 🗺️**
