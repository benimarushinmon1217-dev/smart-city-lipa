# Smart City Lipa - Deployment Checklist

This checklist ensures all necessary steps are completed before deploying the Smart City Lipa platform to production.

---

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] **Environment Variables**
  - [ ] `.env` file created for backend
  - [ ] `.env` file created for frontend
  - [ ] All required variables set (see `.env.example`)
  - [ ] Database credentials configured
  - [ ] JWT secret generated (strong, random)
  - [ ] API URLs configured correctly
  - [ ] Socket.io URLs configured
  - [ ] File upload paths configured

- [ ] **Security Settings**
  - [ ] CORS origins configured for production
  - [ ] Rate limiting enabled
  - [ ] Helmet.js configured
  - [ ] Input validation enabled
  - [ ] SQL injection protection verified
  - [ ] XSS protection enabled

### 2. Database Setup

- [ ] **Database Configuration**
  - [ ] MySQL server installed and running
  - [ ] Database created
  - [ ] Database user created with appropriate permissions
  - [ ] Connection pooling configured
  - [ ] Backup strategy implemented

- [ ] **Schema & Data**
  - [ ] Database migrations run
  - [ ] Seed data loaded (barangays, emergency contacts)
  - [ ] Admin user created
  - [ ] Test data removed
  - [ ] Database indexes created

### 3. Backend Preparation

- [ ] **Code Quality**
  - [ ] All tests passing
  - [ ] No console.log statements in production code
  - [ ] Error handling implemented
  - [ ] Logging configured (Winston)
  - [ ] API documentation updated

- [ ] **Dependencies**
  - [ ] `npm install` completed
  - [ ] No security vulnerabilities (`npm audit`)
  - [ ] Dependencies up to date
  - [ ] Production dependencies only

- [ ] **Configuration**
  - [ ] Port configured
  - [ ] File upload limits set
  - [ ] Session timeout configured
  - [ ] JWT expiration set appropriately

### 4. Frontend Preparation

- [ ] **Build Process**
  - [ ] Production build created (`npm run build`)
  - [ ] Build optimized (code splitting, minification)
  - [ ] Source maps configured appropriately
  - [ ] Assets optimized (images, fonts)

- [ ] **Configuration**
  - [ ] API endpoints point to production
  - [ ] Socket.io URL configured
  - [ ] Environment variables set
  - [ ] Analytics configured (if applicable)

- [ ] **Performance**
  - [ ] Lazy loading implemented
  - [ ] Code splitting verified
  - [ ] Bundle size optimized
  - [ ] Caching strategy implemented

### 5. Real-Time Infrastructure

- [ ] **Socket.io Configuration**
  - [ ] CORS configured for production
  - [ ] Connection limits set
  - [ ] Reconnection strategy configured
  - [ ] Room management tested
  - [ ] Broadcasting tested

- [ ] **Notification System**
  - [ ] Notification delivery tested
  - [ ] Emergency alerts tested
  - [ ] Sound files included
  - [ ] Notification persistence verified

### 6. File Storage

- [ ] **Upload Configuration**
  - [ ] Upload directory created
  - [ ] Permissions set correctly
  - [ ] File size limits configured
  - [ ] Allowed file types restricted
  - [ ] Storage quota monitored

- [ ] **Static Files**
  - [ ] Public directory configured
  - [ ] Static file serving enabled
  - [ ] CDN configured (if applicable)

### 7. Security Hardening

- [ ] **Authentication**
  - [ ] JWT secret is strong and unique
  - [ ] Password hashing verified (bcrypt)
  - [ ] Session management secure
  - [ ] Token expiration appropriate

- [ ] **Authorization**
  - [ ] Role-based access control tested
  - [ ] Protected routes verified
  - [ ] Admin access restricted
  - [ ] API endpoint permissions verified

- [ ] **Input Validation**
  - [ ] All inputs validated
  - [ ] SQL injection prevention tested
  - [ ] XSS prevention tested
  - [ ] CSRF protection enabled

### 8. Monitoring & Logging

- [ ] **Logging**
  - [ ] Winston logger configured
  - [ ] Log levels set appropriately
  - [ ] Log rotation configured
  - [ ] Error logs monitored

- [ ] **Monitoring**
  - [ ] Server monitoring setup
  - [ ] Database monitoring setup
  - [ ] Application performance monitoring
  - [ ] Uptime monitoring configured

### 9. Backup & Recovery

- [ ] **Backup Strategy**
  - [ ] Database backup automated
  - [ ] File backup configured
  - [ ] Backup retention policy set
  - [ ] Backup restoration tested

- [ ] **Disaster Recovery**
  - [ ] Recovery procedures documented
  - [ ] Backup restoration tested
  - [ ] Failover strategy defined

### 10. Testing

- [ ] **Functional Testing**
  - [ ] All features tested
  - [ ] User workflows verified
  - [ ] Admin workflows verified
  - [ ] Edge cases tested

- [ ] **Performance Testing**
  - [ ] Load testing completed
  - [ ] Stress testing completed
  - [ ] Database query performance verified
  - [ ] API response times acceptable

- [ ] **Security Testing**
  - [ ] Penetration testing completed
  - [ ] Vulnerability scan completed
  - [ ] Authentication tested
  - [ ] Authorization tested

---

## Deployment Steps

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 2: Clone Repository

```bash
# Clone repository
git clone <repository-url>
cd smart-city-lipa

# Install dependencies
cd backend && npm install --production
cd ../frontend && npm install
```

### Step 3: Configure Environment

```bash
# Backend environment
cd backend
cp .env.example .env
nano .env  # Edit with production values

# Frontend environment
cd ../frontend
cp .env.example .env
nano .env  # Edit with production values
```

### Step 4: Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE smart_city_lipa;
CREATE USER 'smart_city_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON smart_city_lipa.* TO 'smart_city_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
cd backend
npm run migrate

# Seed data
npm run seed
```

### Step 5: Build Frontend

```bash
cd frontend
npm run build
```

### Step 6: Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/smart-city-lipa/frontend/dist;
        try_files $uri $uri/ /index.html;
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

### Step 7: Start Application

```bash
# Start backend with PM2
cd backend
pm2 start app.js --name smart-city-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 8: SSL Configuration

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Checklist

### 1. Verification

- [ ] **Application Access**
  - [ ] Website loads correctly
  - [ ] API endpoints responding
  - [ ] Socket.io connections working
  - [ ] Static files loading

- [ ] **Functionality**
  - [ ] User registration works
  - [ ] User login works
  - [ ] Admin login works
  - [ ] Incident submission works
  - [ ] Report submission works
  - [ ] Emergency broadcast works
  - [ ] Notifications working
  - [ ] Real-time updates working

### 2. Performance

- [ ] **Response Times**
  - [ ] Page load times acceptable
  - [ ] API response times acceptable
  - [ ] Database queries optimized
  - [ ] Real-time updates instant

- [ ] **Resource Usage**
  - [ ] CPU usage normal
  - [ ] Memory usage normal
  - [ ] Disk usage monitored
  - [ ] Network usage normal

### 3. Monitoring

- [ ] **Setup Monitoring**
  - [ ] Server monitoring active
  - [ ] Application monitoring active
  - [ ] Database monitoring active
  - [ ] Alert notifications configured

- [ ] **Log Monitoring**
  - [ ] Error logs monitored
  - [ ] Access logs monitored
  - [ ] Application logs monitored

### 4. Documentation

- [ ] **Update Documentation**
  - [ ] Deployment documentation updated
  - [ ] API documentation updated
  - [ ] User guides updated
  - [ ] Admin guides updated

### 5. Backup Verification

- [ ] **Test Backups**
  - [ ] Database backup tested
  - [ ] File backup tested
  - [ ] Restoration procedure tested

---

## Rollback Plan

### If Deployment Fails

1. **Stop Application**
   ```bash
   pm2 stop smart-city-backend
   ```

2. **Restore Database**
   ```bash
   mysql -u root -p smart_city_lipa < backup.sql
   ```

3. **Revert Code**
   ```bash
   git checkout previous-stable-tag
   npm install
   ```

4. **Restart Application**
   ```bash
   pm2 restart smart-city-backend
   ```

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check system resources
- Verify backup completion

### Weekly
- Review performance metrics
- Check security logs
- Update dependencies (if needed)

### Monthly
- Security audit
- Performance optimization
- Database optimization
- Backup restoration test

---

## Emergency Contacts

- **System Administrator:** [Contact Info]
- **Database Administrator:** [Contact Info]
- **Development Team:** [Contact Info]
- **Hosting Provider:** [Contact Info]

---

## Additional Resources

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Troubleshooting Guide](../guides/TROUBLESHOOTING_GUIDE.md)
- [Architecture Overview](../architecture/ARCHITECTURE_OVERVIEW.md)
- [Admin Phase Improvement Report](../ADMIN_PHASE_IMPROVEMENT_REPORT.md)

---

**Last Updated:** May 16, 2026  
**Version:** 1.0.0
