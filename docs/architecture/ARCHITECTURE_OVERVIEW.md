# 🏗️ Smart City Lipa - Architecture Overview

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SMART CITY LIPA SYSTEM                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│   REACT FRONTEND │◄───────►│  EXPRESS BACKEND │◄───────►│  MySQL DATABASE  │
│   (Vite + React) │  REST   │  (Node.js + MVC) │  ORM    │   (Sequelize)    │
│                  │   API   │                  │         │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
         │                            │                            │
         │                            │                            │
         ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Leaflet Maps    │         │   Groq AI API    │         │   GeoJSON Data   │
│  Routing (OSRM)  │         │   (Chatbot)      │         │   Risk Analysis  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

---

## 🎯 MVC Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   CORS   │→ │   Auth   │→ │ Validate │→ │   Rate   │       │
│  │          │  │   JWT    │  │  Input   │  │  Limit   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                            ROUTES                               │
│  /api/v1/auth  /api/v1/users  /api/v1/incidents  etc.         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CONTROLLERS                             │
│  Handle HTTP requests, call services, return responses          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │   Incident   │  │   Barangay   │         │
│  │  Controller  │  │  Controller  │  │  Controller  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVICES                               │
│  Business logic, data processing, external API calls            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │   Incident   │  │      AI      │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                           MODELS                                │
│  Database schema, relationships, validations                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     User     │  │   Incident   │  │   Barangay   │         │
│  │    Model     │  │    Model     │  │    Model     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MySQL DATABASE                             │
│  Tables: users, barangays, incidents, reports, etc.            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Backend Folder Structure

```
backend/
│
├── config/                    # Configuration files
│   ├── database.js           # Sequelize + MySQL connection
│   ├── jwt.js                # JWT token configuration
│   ├── cors.js               # CORS settings
│   └── multer.js             # File upload configuration
│
├── controllers/              # Request handlers (HTTP layer)
│   ├── authController.js     # ✅ Authentication endpoints
│   ├── incidentController.js # ⏳ Incident management
│   ├── barangayController.js # ⏳ Barangay operations
│   └── ...                   # Other controllers
│
├── middleware/               # Express middleware
│   ├── auth.js               # ✅ JWT verification, RBAC
│   ├── validate.js           # ✅ Input validation
│   ├── errorHandler.js       # ✅ Global error handling
│   ├── rateLimiter.js        # ✅ Rate limiting
│   └── notFound.js           # ✅ 404 handler
│
├── models/                   # Database models (Sequelize)
│   ├── User.js               # ✅ User authentication & profile
│   ├── Barangay.js           # ✅ Geographic data & risk
│   ├── Incident.js           # ✅ Disaster incidents
│   ├── Report.js             # ✅ User reports
│   ├── Establishment.js      # ✅ Facilities mapping
│   ├── Notification.js       # ✅ User notifications
│   ├── Announcement.js       # ✅ System announcements
│   ├── TrafficData.js        # ✅ Traffic monitoring
│   ├── EmergencyContact.js   # ✅ Emergency hotlines
│   └── index.js              # ✅ Model relationships
│
├── routes/                   # API route definitions
│   ├── authRoutes.js         # ✅ /api/v1/auth/*
│   ├── userRoutes.js         # ✅ /api/v1/users/*
│   ├── barangayRoutes.js     # ✅ /api/v1/barangays/*
│   ├── incidentRoutes.js     # ✅ /api/v1/incidents/*
│   ├── reportRoutes.js       # ✅ /api/v1/reports/*
│   ├── establishmentRoutes.js# ✅ /api/v1/establishments/*
│   ├── notificationRoutes.js # ✅ /api/v1/notifications/*
│   ├── announcementRoutes.js # ✅ /api/v1/announcements/*
│   ├── trafficRoutes.js      # ✅ /api/v1/traffic/*
│   ├── emergencyContactRoutes.js # ✅ /api/v1/emergency-contacts/*
│   └── aiRoutes.js           # ✅ /api/v1/ai/*
│
├── services/                 # Business logic layer
│   ├── authService.js        # ✅ Authentication logic
│   ├── incidentService.js    # ⏳ Incident operations
│   ├── aiService.js          # ⏳ AI & chatbot logic
│   └── ...                   # Other services
│
├── validators/               # Input validation rules
│   ├── authValidator.js      # ✅ Auth input validation
│   ├── incidentValidator.js  # ⏳ Incident validation
│   └── ...                   # Other validators
│
├── utils/                    # Utility functions
│   ├── logger.js             # ✅ Winston logging
│   ├── response.js           # ✅ Standardized API responses
│   ├── asyncHandler.js       # ✅ Async error wrapper
│   └── dbSync.js             # ✅ Database sync utility
│
├── uploads/                  # Uploaded files storage
│   ├── reports/              # Report images
│   ├── incidents/            # Incident images
│   └── avatars/              # User avatars
│
├── logs/                     # Application logs
│   ├── combined.log          # All logs
│   └── error.log             # Error logs only
│
├── app.js                    # ✅ Express app configuration
├── server.js                 # ✅ Server entry point
├── package.json              # ✅ Dependencies & scripts
├── .env                      # ✅ Environment variables
├── .env.example              # ✅ Example configuration
├── .gitignore                # ✅ Git ignore rules
├── README.md                 # ✅ Documentation
└── SETUP_GUIDE.md            # ✅ Quick setup guide
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  1. Validate input                  │
│  2. Check if email exists           │
│  3. Hash password (bcrypt)          │
│  4. Create user in database         │
│  5. Generate JWT token              │
│  6. Return user + token             │
└─────────────────────────────────────┘

┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  1. Validate input                  │
│  2. Find user by email              │
│  3. Compare password (bcrypt)       │
│  4. Update last_login               │
│  5. Generate JWT token              │
│  6. Return user + token             │
└─────────────────────────────────────┘

┌──────────────┐
│ Protected    │
│   Route      │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  1. Extract token from header       │
│  2. Verify JWT signature            │
│  3. Decode user ID                  │
│  4. Fetch user from database        │
│  5. Check if user is active         │
│  6. Attach user to request          │
│  7. Check role (if RBAC)            │
│  8. Continue to controller          │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
-- Users Table
users
├── id (PK)
├── first_name
├── last_name
├── email (UNIQUE)
├── password (HASHED)
├── phone
├── role (admin/staff/user)
├── avatar
├── address
├── barangay
├── is_active
├── last_login
└── timestamps

-- Barangays Table
barangays
├── id (PK)
├── name (UNIQUE)
├── code
├── latitude
├── longitude
├── geojson (TEXT)
├── flood_risk_level
├── flood_risk_score
├── ashfall_risk_level
├── ashfall_risk_score
├── mean_elevation
├── distance_to_water
├── distance_to_taal
├── area_sqkm
├── population
├── households
└── timestamps

-- Incidents Table
incidents
├── id (PK)
├── incident_type (ENUM)
├── title
├── description
├── severity (ENUM)
├── status (ENUM)
├── barangay_id (FK → barangays)
├── latitude
├── longitude
├── address
├── reported_by (FK → users)
├── reporter_name
├── reporter_contact
├── images (JSON)
├── responders (JSON)
├── response_time
├── resolution_time
├── affected_families
├── casualties
├── estimated_damage
├── is_verified
├── verified_by (FK → users)
└── timestamps

-- Reports Table
reports
├── id (PK)
├── user_id (FK → users)
├── barangay_id (FK → barangays)
├── report_type (ENUM)
├── title
├── description
├── location
├── latitude
├── longitude
├── images (JSON)
├── status (ENUM)
├── priority (ENUM)
├── assigned_to (FK → users)
├── resolution_notes
├── resolved_at
└── timestamps

-- Establishments Table
establishments
├── id (PK)
├── name
├── type (ENUM)
├── barangay_id (FK → barangays)
├── address
├── latitude
├── longitude
├── contact_number
├── email
├── capacity
├── current_occupancy
├── facilities (JSON)
├── operating_hours
├── is_operational
└── timestamps

-- Notifications Table
notifications
├── id (PK)
├── user_id (FK → users)
├── type (ENUM)
├── title
├── message
├── priority (ENUM)
├── is_read
├── read_at
├── related_id
├── related_type
└── timestamps

-- Announcements Table
announcements
├── id (PK)
├── title
├── content
├── type (ENUM)
├── priority (ENUM)
├── target_audience (ENUM)
├── target_barangays (JSON)
├── image
├── is_active
├── is_pinned
├── published_at
├── expires_at
├── created_by (FK → users)
└── timestamps

-- Traffic Data Table
traffic_data
├── id (PK)
├── barangay_id (FK → barangays)
├── location_name
├── latitude
├── longitude
├── traffic_level (ENUM)
├── average_speed
├── vehicle_count
├── road_condition (ENUM)
└── timestamps

-- Emergency Contacts Table
emergency_contacts
├── id (PK)
├── name
├── type (ENUM)
├── phone_numbers (JSON)
├── email
├── address
├── is_24_7
├── operating_hours
├── is_active
├── priority
└── timestamps
```

---

## 🔗 Model Relationships

```
User (1) ──────────────► (N) Report
User (1) ──────────────► (N) Incident
User (1) ──────────────► (N) Notification

Barangay (1) ──────────► (N) Incident
Barangay (1) ──────────► (N) Report
Barangay (1) ──────────► (N) Establishment
Barangay (1) ──────────► (N) TrafficData

Report (N) ─────────────► (1) User
Report (N) ─────────────► (1) Barangay

Incident (N) ───────────► (1) User (reporter)
Incident (N) ───────────► (1) Barangay

Establishment (N) ──────► (1) Barangay

Notification (N) ───────► (1) User

TrafficData (N) ────────► (1) Barangay
```

---

## 🚀 API Request Flow Example

### Example: Create Incident Report

```
1. CLIENT REQUEST
   POST /api/v1/incidents
   Headers: { Authorization: "Bearer <token>" }
   Body: { title, description, incident_type, ... }

2. MIDDLEWARE CHAIN
   ├─► CORS check
   ├─► Rate limiter
   ├─► Body parser
   ├─► JWT verification (protect middleware)
   ├─► Role check (authorize middleware)
   └─► Input validation

3. ROUTE HANDLER
   routes/incidentRoutes.js
   └─► Matches POST / route

4. CONTROLLER
   controllers/incidentController.js
   └─► createIncident(req, res)

5. SERVICE
   services/incidentService.js
   └─► Business logic, data processing

6. MODEL
   models/Incident.js
   └─► Sequelize ORM operations

7. DATABASE
   MySQL
   └─► INSERT INTO incidents ...

8. RESPONSE
   ├─► Service returns data
   ├─► Controller formats response
   └─► Client receives JSON
```

---

## 🎯 Technology Stack

### Backend
- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+
- **ORM**: Sequelize 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit

### Frontend (To Be Built)
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router 6
- **State Management**: Context API / Zustand
- **HTTP Client**: Axios
- **Maps**: Leaflet
- **UI**: Custom responsive design

### External APIs
- **AI Chatbot**: Groq API
- **Routing**: OSRM (OpenStreetMap Routing Machine)
- **Maps**: OpenStreetMap tiles

---

## 🔒 Security Features

1. **JWT Authentication**: Stateless token-based auth
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-Based Access Control**: Admin, Staff, User roles
4. **Rate Limiting**: Prevent brute force attacks
5. **Input Validation**: Sanitize and validate all inputs
6. **CORS**: Controlled cross-origin requests
7. **Helmet**: Security headers
8. **SQL Injection Protection**: Sequelize parameterized queries
9. **XSS Protection**: Input sanitization
10. **Error Handling**: No sensitive data in error messages

---

## 📊 Performance Optimizations

1. **Database Indexing**: Key fields indexed
2. **Connection Pooling**: Sequelize connection pool
3. **Async/Await**: Non-blocking operations
4. **Pagination**: Large datasets paginated
5. **Caching**: (To be implemented)
6. **Compression**: (To be implemented)
7. **CDN**: Static assets (To be implemented)

---

## 🧪 Testing Strategy (To Be Implemented)

1. **Unit Tests**: Individual functions
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Full user flows
4. **Load Tests**: Performance under stress
5. **Security Tests**: Vulnerability scanning

---

## 📈 Scalability Considerations

1. **Horizontal Scaling**: Stateless JWT allows multiple instances
2. **Database Replication**: Master-slave setup
3. **Load Balancing**: Nginx/HAProxy
4. **Caching Layer**: Redis for sessions/cache
5. **Message Queue**: Bull/RabbitMQ for async tasks
6. **Microservices**: Future modular architecture

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **Sequelize**: https://sequelize.org/
- **JWT**: https://jwt.io/
- **React**: https://react.dev/
- **Leaflet**: https://leafletjs.com/

---

This architecture provides a **solid foundation** for a scalable, maintainable, and secure Smart City management system!
