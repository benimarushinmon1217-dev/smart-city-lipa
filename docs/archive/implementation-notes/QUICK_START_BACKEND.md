# 🚀 Quick Start Guide - Backend

## Get Your Backend Running in 5 Minutes!

---

## Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- npm or yarn

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Setup Database

```sql
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key  # Optional for AI features
```

---

## Step 4: Create Database Tables

```bash
npm run db:sync
```

---

## Step 5: Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully
✅ Database models synced
🚀 Server running in development mode on port 5000
📍 API available at http://localhost:5000/api/v1
🏥 Health check at http://localhost:5000/health
🔌 Socket.io ready for real-time connections
```

---

## Step 6: Test It!

### Register a User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

Save the `accessToken` from the response!

---

## Step 7: Make User Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'juan@example.com';
```

---

## Step 8: Test Admin Dashboard

```bash
curl http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎉 You're Ready!

Your backend is now running with:
- ✅ Authentication system
- ✅ Real-time Socket.io
- ✅ Admin dashboard
- ✅ AI services
- ✅ All 80+ API endpoints

---

## 📚 Next Steps

1. **Explore API Endpoints**
   - Check `BACKEND_COMPLETE.md` for full API reference
   - Test endpoints with Postman or curl

2. **Test Real-Time Features**
   - Open `test-realtime.html` in browser
   - See `REALTIME_IMPLEMENTATION_GUIDE.md`

3. **Read Documentation**
   - `README.md` - Complete documentation
   - `PROJECT_STATUS.md` - Project overview
   - `AI_SERVICE_GUIDE.md` - AI features
   - `ADMIN_DASHBOARD_GUIDE.md` - Admin features

4. **Build Frontend**
   - Initialize React + Vite project
   - Connect to backend APIs
   - Implement Socket.io client

---

## 🔧 Useful Commands

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start

# Sync database (create/update tables)
npm run db:sync

# Force sync (drop and recreate tables - WARNING: deletes data!)
npm run db:sync:force
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DB_PASSWORD in .env
- Ensure database exists

### Port Already in Use
- Change PORT in .env
- Or kill process using port 5000

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token format in Authorization header

---

## 📞 Need Help?

Check these files:
- `SETUP_GUIDE.md` - Detailed setup
- `BACKEND_COMPLETE.md` - Complete reference
- `PROJECT_STATUS.md` - Project status

---

**Built with ❤️ for Lipa City**

**Happy Coding! 🚀**
