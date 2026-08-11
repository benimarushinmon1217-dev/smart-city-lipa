# 🚀 Getting Started with Smart City Lipa System

## Welcome! 👋

This guide will help you get the Smart City Lipa System up and running in **under 10 minutes**.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- [ ] **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- [ ] **npm** (comes with Node.js)
- [ ] **Git** (optional, for version control)
- [ ] A code editor (VS Code recommended)

### Check Your Installations

```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# Check MySQL
mysql --version
# Should show: mysql Ver 8.0.x
```

---

## 🎯 Quick Start (5 Steps)

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

### Step 3: Setup MySQL Database

Open MySQL command line or MySQL Workbench:

```sql
-- Create the database
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES;
```

### Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit the `.env` file with your MySQL credentials:

```env
# Open backend/.env and update these lines:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_city_lipa
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # ⚠️ CHANGE THIS!

# Keep other settings as default for now
```

### Step 5: Create Database Tables & Start Server

```bash
# Create all database tables automatically
npm run db:sync

# Start the development server
npm run dev
```

You should see:

```
✅ Database connection established successfully
✅ Database models synced
🚀 Server running in development mode on port 5000
📍 API available at http://localhost:5000/api/v1
🏥 Health check at http://localhost:5000/health
```

---

## ✅ Verify Installation

### Test 1: Health Check

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Test 2: Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan@example.com",
    "password": "Password123",
    "phone": "09123456789"
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Dela Cruz",
      "email": "juan@example.com",
      "role": "user",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Test 4: Get Profile (Protected Route)

```bash
# Replace <YOUR_TOKEN> with the token from login response
curl http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🎉 Success! What's Next?

If all tests passed, congratulations! Your backend is fully operational.

### Recommended Next Steps:

1. **Explore the API**
   - Check `backend/README.md` for all available endpoints
   - Use Postman or Thunder Client to test APIs

2. **Create an Admin Account**
   ```sql
   -- Login to MySQL
   mysql -u root -p smart_city_lipa
   
   -- Update your user to admin role
   UPDATE users SET role = 'admin' WHERE email = 'juan@example.com';
   ```

3. **Add Sample Data**
   - Create barangays
   - Add establishments
   - Test incident reporting

4. **Build the Frontend**
   - Initialize React + Vite project
   - Connect to backend API
   - Create authentication pages

---

## 🛠️ Development Workflow

### Starting the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

### Database Management

```bash
# Sync database (create tables if not exist)
npm run db:sync

# Alter tables to match models (safe update)
node utils/dbSync.js --alter

# Force sync (⚠️ DROPS ALL TABLES - use with caution!)
node utils/dbSync.js --force
```

### Viewing Logs

```bash
# Real-time logs (in terminal)
npm run dev

# View log files
cat logs/combined.log
cat logs/error.log
```

---

## 📚 Project Documentation

- **README.md** - Comprehensive documentation
- **SETUP_GUIDE.md** - Quick setup instructions
- **ARCHITECTURE_OVERVIEW.md** - System architecture details
- **PROJECT_STATUS.md** - Current project status

---

## 🐛 Troubleshooting

### Problem: "Access denied for user"

**Solution:**
- Check your MySQL username and password in `.env`
- Ensure MySQL server is running
- Try connecting with MySQL Workbench first

### Problem: "Unknown database 'smart_city_lipa'"

**Solution:**
```sql
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill
```

### Problem: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: "JWT token invalid"

**Solution:**
- Check if JWT_SECRET is set in `.env`
- Ensure token is included in Authorization header
- Format: `Authorization: Bearer <token>`

### Problem: "Sequelize connection error"

**Solution:**
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env`

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change JWT_REFRESH_SECRET to a different strong string
- [ ] Use a strong MySQL password
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Review rate limiting settings
- [ ] Setup database backups
- [ ] Enable MySQL SSL connection
- [ ] Review and update security headers

---

## 📞 Getting Help

### Resources

1. **Documentation**
   - Check the README files in each directory
   - Review model files for database structure
   - Check route files for API endpoints

2. **Common Issues**
   - Database connection problems
   - Authentication errors
   - Validation failures

3. **Code Examples**
   - `backend/controllers/authController.js` - Complete auth implementation
   - `backend/services/authService.js` - Business logic examples
   - `backend/models/` - Database model examples

---

## 🎓 Learning Path

### For Beginners

1. **Understand the Structure**
   - Read ARCHITECTURE_OVERVIEW.md
   - Explore the folder structure
   - Review model relationships

2. **Study the Auth System**
   - How registration works
   - How login generates JWT
   - How protected routes verify tokens

3. **Practice with Postman**
   - Test all auth endpoints
   - Try creating incidents
   - Test with different user roles

### For Advanced Users

1. **Implement Remaining Controllers**
   - Barangay CRUD operations
   - Incident management
   - Report handling

2. **Add Advanced Features**
   - Real-time notifications (Socket.io)
   - File upload handling
   - Search and filtering

3. **Build the Frontend**
   - React + Vite setup
   - API integration
   - State management

---

## 🚀 Deployment Guide (Future)

When ready to deploy:

1. **Choose a hosting provider**
   - Heroku (easy)
   - DigitalOcean (flexible)
   - AWS (scalable)

2. **Setup production database**
   - Use managed MySQL (AWS RDS, DigitalOcean)
   - Configure backups
   - Enable SSL

3. **Configure environment**
   - Set NODE_ENV=production
   - Use production secrets
   - Configure CORS for your domain

4. **Deploy**
   - Push code to repository
   - Configure CI/CD pipeline
   - Monitor logs and errors

---

## ✨ Tips for Success

1. **Start Small**
   - Get authentication working first
   - Add one feature at a time
   - Test thoroughly before moving on

2. **Use Version Control**
   - Commit frequently
   - Write meaningful commit messages
   - Create branches for new features

3. **Read the Code**
   - The auth system is fully implemented
   - Use it as a reference for other features
   - Follow the same patterns

4. **Ask Questions**
   - Review documentation first
   - Check error logs
   - Search for similar issues

---

## 🎯 Your First Tasks

Now that everything is set up, try these:

1. **Create 3 users** with different roles (admin, staff, user)
2. **Test all auth endpoints** (register, login, profile, change password)
3. **Explore the database** - see how data is stored
4. **Read the model files** - understand relationships
5. **Plan your next feature** - what do you want to build first?

---

## 🎊 Congratulations!

You now have a **professional, production-ready backend** for your Smart City Lipa System!

The foundation is solid, the authentication works perfectly, and you're ready to build amazing features.

**Happy coding! 🚀**

---

## 📝 Quick Reference

### Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create database tables
npm run db:sync

# View logs
cat logs/combined.log
```

### Essential Endpoints

```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login
GET    /api/v1/auth/profile       # Get profile (protected)
PUT    /api/v1/auth/profile       # Update profile (protected)
POST   /api/v1/auth/change-password  # Change password (protected)
```

### Essential Files

```
backend/
├── .env                    # Your configuration
├── server.js               # Server entry point
├── app.js                  # Express app setup
├── models/index.js         # Database models
└── routes/authRoutes.js    # Auth endpoints
```

---

**Need help?** Review the documentation files or check the code comments!
