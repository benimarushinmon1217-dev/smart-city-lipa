# Smart City Lipa - Backend API

Enterprise-grade backend API for Smart City Lipa System built with Node.js, Express, MySQL, and Sequelize ORM.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **User Management**: Complete user CRUD operations with profile management
- **Incident Reporting**: Track and manage disaster incidents and emergencies
- **Barangay Management**: Geographic data and risk assessment for barangays
- **Establishment Mapping**: Manage evacuation centers, hospitals, schools, etc.
- **Real-time Notifications**: Push notifications for users
- **Traffic Monitoring**: Real-time traffic data management
- **AI Integration**: Chatbot and risk analysis using Groq API
- **File Uploads**: Image and document upload support
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Comprehensive Logging**: Winston-based logging system
- **Error Handling**: Centralized error handling middleware

## 📋 Prerequisites

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

## 🛠️ Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_city_lipa
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

### 4. Create MySQL database

```sql
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Sync database (create tables)

```bash
npm run db:sync
```

Or with force (drops existing tables):

```bash
node utils/dbSync.js --force
```

### 6. Start the server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Sequelize configuration
│   ├── jwt.js        # JWT configuration
│   ├── cors.js       # CORS settings
│   └── multer.js     # File upload configuration
├── controllers/      # Request handlers
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication middleware
│   ├── validate.js   # Validation middleware
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/           # Sequelize models
│   ├── User.js
│   ├── Barangay.js
│   ├── Incident.js
│   ├── Report.js
│   └── index.js      # Model associations
├── routes/           # API routes
├── services/         # Business logic
├── validators/       # Input validation rules
├── utils/            # Utility functions
│   ├── logger.js     # Winston logger
│   ├── response.js   # API response formatter
│   └── asyncHandler.js
├── uploads/          # Uploaded files
├── logs/             # Application logs
├── app.js            # Express app setup
├── server.js         # Server entry point
└── package.json
```

## 🔐 Authentication

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan@example.com",
  "password": "Password123",
  "phone": "09123456789",
  "barangay": "Poblacion"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

### Protected Routes

Include JWT token in Authorization header:

```http
GET /api/v1/auth/profile
Authorization: Bearer <your_jwt_token>
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile (Protected)
- `PUT /api/v1/auth/profile` - Update profile (Protected)
- `POST /api/v1/auth/change-password` - Change password (Protected)

### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Barangays
- `GET /api/v1/barangays` - Get all barangays
- `GET /api/v1/barangays/:id` - Get barangay by ID
- `POST /api/v1/barangays` - Create barangay (Admin)
- `PUT /api/v1/barangays/:id` - Update barangay (Admin)

### Incidents
- `GET /api/v1/incidents` - Get all incidents
- `GET /api/v1/incidents/:id` - Get incident by ID
- `POST /api/v1/incidents` - Report incident (Protected)
- `PUT /api/v1/incidents/:id` - Update incident (Staff/Admin)
- `DELETE /api/v1/incidents/:id` - Delete incident (Admin)

### Reports
- `GET /api/v1/reports` - Get all reports
- `POST /api/v1/reports` - Submit report (Protected)
- `PUT /api/v1/reports/:id` - Update report status (Staff/Admin)

### Establishments
- `GET /api/v1/establishments` - Get all establishments
- `GET /api/v1/establishments/type/:type` - Get by type
- `POST /api/v1/establishments` - Create establishment (Admin)

## 🔒 User Roles

- **admin**: Full system access
- **staff**: Manage incidents, reports, and respond to emergencies
- **user**: Submit reports and incidents, view information

## 🗄️ Database Models

### User
- Authentication and profile data
- Role-based access control
- Password hashing with bcrypt

### Barangay
- Geographic boundaries (GeoJSON)
- Risk assessment data (flood, ashfall)
- Demographics

### Incident
- Disaster incidents and emergencies
- Status tracking (reported → verified → responding → resolved)
- Impact assessment

### Report
- User-submitted reports
- Location-based tracking
- Status management

### Establishment
- Evacuation centers
- Healthcare facilities
- Government offices
- Schools and churches

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🚦 Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File uploads: 20 requests per hour

## 🔧 Database Sync Options

```bash
# Sync without changes
npm run db:sync

# Alter tables to match models
node utils/dbSync.js --alter

# Drop and recreate all tables (⚠️ DESTRUCTIVE)
node utils/dbSync.js --force
```

## 🐛 Troubleshooting

### Database connection failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Port already in use
- Change PORT in `.env`
- Kill process using the port

### JWT errors
- Verify JWT_SECRET is set
- Check token expiration

## 📄 License

MIT

## 👥 Contributors

Smart City Lipa Development Team

## 📞 Support

For issues and questions, please contact the development team.
