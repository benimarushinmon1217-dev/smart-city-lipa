# 🚀 Smart City Lipa - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MySQL**: v8.0 or higher
- **Git**: Latest version

### Optional (for Production)
- **PM2**: Process manager for Node.js
- **Nginx**: Reverse proxy server
- **Docker**: Containerization (optional)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-city-lipa
```

### 2. Install Dependencies
```bash
npm run install:all
```

This command installs dependencies for:
- Root project
- Backend
- Frontend

### 3. Configure Environment Variables

#### Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_city_lipa
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Groq API (for AI features)
GROQ_API_KEY=your_groq_api_key_here
```

#### Frontend Configuration
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Setup Database
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE smart_city_lipa;
exit;

# Run database synchronization
cd backend
npm run db:sync
```

### 5. Start the Application
```bash
# From root directory
npm run dev
```

This starts both backend and frontend concurrently:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Backend server port | `5000` | No |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | Yes |
| `DB_NAME` | Database name | `smart_city_lipa` | Yes |
| `DB_USER` | Database user | `root` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` | No |
| `GROQ_API_KEY` | Groq AI API key | - | Yes (for AI) |
| `GROQ_MODEL` | Groq model name | `llama-3.1-70b-versatile` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api/v1` | Yes |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:5000` | Yes |
| `VITE_MAP_CENTER_LAT` | Map center latitude | `13.9414` | No |
| `VITE_MAP_CENTER_LNG` | Map center longitude | `121.1628` | No |
| `VITE_MAP_ZOOM` | Default map zoom | `13` | No |

---

## Database Setup

### Manual Database Creation
```sql
CREATE DATABASE smart_city_lipa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Automatic Schema Sync
The application uses Sequelize ORM with automatic synchronization:
```bash
cd backend
npm run db:sync
```

This creates all necessary tables:
- users
- incidents
- reports
- notifications
- announcements
- barangays
- establishments
- emergency_contacts
- traffic_data

### Seed Demo Data (Optional)
```bash
cd backend
npm run seed
```

---

## Running the Application

### Development Mode

#### Start Everything
```bash
npm run dev
```

#### Start Backend Only
```bash
npm run start:backend
```

#### Start Frontend Only
```bash
npm run start:frontend
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend (Production)
```bash
cd backend
NODE_ENV=production npm start
```

#### Serve Frontend (Production)
Use a static file server like Nginx or serve:
```bash
cd frontend
npx serve -s dist -p 3000
```

---

## Production Deployment

### Option 1: Traditional Server Deployment

#### 1. Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2
sudo npm install -g pm2
```

#### 2. Clone and Setup
```bash
git clone <repository-url>
cd smart-city-lipa
npm run install:all
```

#### 3. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
nano .env  # Edit with production values

# Frontend
cd ../frontend
cp .env.example .env
nano .env  # Edit with production API URL
```

#### 4. Build Frontend
```bash
cd frontend
npm run build
```

#### 5. Start with PM2
```bash
# Start backend
cd backend
pm2 start server.js --name smart-city-backend

# Serve frontend with PM2
cd ../frontend
pm2 serve dist 3000 --name smart-city-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 6. Configure Nginx
```nginx
# /etc/nginx/sites-available/smart-city-lipa
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/smart-city-lipa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile (Backend)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### 2. Create Dockerfile (Frontend)
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: smart_city_lipa
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=smart_city_lipa
      - DB_USER=root
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - GROQ_API_KEY=${GROQ_API_KEY}
    ports:
      - "5000:5000"
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

#### 4. Deploy with Docker
```bash
docker-compose up -d
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -h localhost

# Verify credentials in .env
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

#### 3. Frontend Can't Connect to Backend
- Verify `VITE_API_URL` in `frontend/.env`
- Check CORS settings in `backend/config/cors.js`
- Ensure backend is running

#### 4. Socket.io Connection Failed
- Verify `VITE_SOCKET_URL` in `frontend/.env`
- Check Socket.io CORS in `backend/config/socket.js`
- Ensure WebSocket support in proxy/firewall

#### 5. AI Features Not Working
- Verify `GROQ_API_KEY` is set in `backend/.env`
- Check API key is valid
- Review backend logs for API errors

### Logs

#### View Backend Logs
```bash
# Development
cd backend
npm start

# Production (PM2)
pm2 logs smart-city-backend

# Log files
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

#### View Frontend Logs
```bash
# Development
cd frontend
npm run dev

# Production (PM2)
pm2 logs smart-city-frontend
```

### Health Checks

#### Backend Health
```bash
curl http://localhost:5000/api/v1/health
```

#### Database Health
```bash
mysql -u root -p -e "SELECT 1"
```

---

## Performance Optimization

### Backend
- Enable compression middleware
- Use Redis for session storage
- Implement database indexing
- Enable query caching

### Frontend
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Enable service workers

### Database
- Add indexes on frequently queried columns
- Optimize queries
- Enable query caching
- Regular maintenance

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

---

## Monitoring

### Recommended Tools
- **PM2**: Process monitoring
- **New Relic**: Application performance
- **Sentry**: Error tracking
- **Grafana**: Metrics visualization
- **Prometheus**: Metrics collection

---

## Support

For issues and questions:
- Check documentation
- Review logs
- Contact development team

---

**Last Updated**: January 2024
**Version**: 3.0.0
