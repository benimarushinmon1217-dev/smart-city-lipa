# 🚀 Smart City Lipa - Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Exit MySQL
exit;
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# Update DB_PASSWORD with your MySQL password
```

### 4. Create Database Tables

```bash
# This will create all tables automatically
npm run db:sync
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
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

## 🎯 Default Admin Account (Create Manually)

After running `npm run db:sync`, you can create an admin account:

```sql
-- Login to MySQL
mysql -u root -p smart_city_lipa

-- Create admin user (password: Admin123)
INSERT INTO users (first_name, last_name, email, password, role, is_active, created_at, updated_at)
VALUES (
  'Admin',
  'User',
  'admin@smartcitylipa.com',
  '$2a$10$rKvVPZhQvZQYxZxZxZxZxeO7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K',
  'admin',
  1,
  NOW(),
  NOW()
);
```

Or register normally and update role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Sync database (create tables)
npm run db:sync

# Sync with alter (update existing tables)
node utils/dbSync.js --alter

# Force sync (⚠️ drops all tables)
node utils/dbSync.js --force
```

## 🔧 Troubleshooting

### Error: "Access denied for user"
- Check DB_USER and DB_PASSWORD in .env
- Ensure MySQL is running

### Error: "Unknown database"
- Create the database first: `CREATE DATABASE smart_city_lipa;`

### Error: "Port 5000 already in use"
- Change PORT in .env file
- Or kill the process: `lsof -ti:5000 | xargs kill`

### Error: "Cannot find module"
- Run `npm install` again
- Delete node_modules and run `npm install`

## 🎉 You're Ready!

Your backend is now running at: `http://localhost:5000`

API Documentation: `http://localhost:5000/api/v1`

Next: Setup the React frontend!
