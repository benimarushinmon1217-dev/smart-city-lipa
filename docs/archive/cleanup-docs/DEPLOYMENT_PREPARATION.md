# Deployment Preparation - Final Steps

**Date:** May 16, 2026  
**Status:** Ready for Deployment  
**Version:** 1.0.0

---

## Overview

This document outlines the final steps to deploy the Smart City Lipa platform to production. All preparation work has been completed, and the application is ready for deployment.

---

## Pre-Deployment Status

### ✅ Completed Preparations

- [x] **Code Quality** - Clean, organized, production-ready
- [x] **Documentation** - Comprehensive and complete
- [x] **Security** - Hardened and validated
- [x] **Configuration** - Environment templates ready
- [x] **Database** - Migrations and seeds prepared
- [x] **Testing** - Manual testing completed
- [x] **Monitoring** - Logging configured
- [x] **Backup** - Strategy documented

---

## Deployment Options

### Option 1: Traditional VPS/Server (Recommended)

**Providers:**
- DigitalOcean Droplet
- AWS EC2
- Google Cloud Compute Engine
- Linode
- Vultr

**Requirements:**
- Ubuntu 20.04+ or similar Linux distribution
- 2GB RAM minimum (4GB recommended)
- 2 CPU cores minimum
- 20GB storage minimum
- Node.js 18+
- MySQL 8+
- Nginx

**Estimated Cost:** $10-20/month

**Deployment Time:** 30-60 minutes

**See:** `docs/deployment/DEPLOYMENT_CHECKLIST.md` for step-by-step guide

### Option 2: Platform as a Service (PaaS)

#### Heroku
**Pros:**
- Easy deployment
- Automatic scaling
- Built-in monitoring

**Cons:**
- More expensive
- Less control

**Steps:**
1. Create Heroku account
2. Install Heroku CLI
3. Create app: `heroku create smart-city-lipa`
4. Add MySQL addon: `heroku addons:create jawsdb:kitefin`
5. Set environment variables
6. Deploy: `git push heroku main`

#### Railway
**Pros:**
- Modern interface
- Easy setup
- Good pricing

**Steps:**
1. Connect GitHub repository
2. Configure environment variables
3. Add MySQL database
4. Deploy automatically

#### Render
**Pros:**
- Free tier available
- Easy deployment
- Good documentation

**Steps:**
1. Connect GitHub repository
2. Configure build settings
3. Add PostgreSQL/MySQL
4. Deploy

### Option 3: Containerized Deployment (Advanced)

**Using Docker:**
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

**Providers:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## Quick Deployment Guide (VPS)

### Step 1: Server Setup (10 minutes)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 2: Clone and Configure (5 minutes)

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/YOUR-USERNAME/smart-city-lipa.git
cd smart-city-lipa

# Set permissions
sudo chown -R $USER:$USER /var/www/smart-city-lipa

# Install dependencies
cd backend && npm install --production
cd ../frontend && npm install
```

### Step 3: Environment Configuration (5 minutes)

```bash
# Backend environment
cd /var/www/smart-city-lipa/backend
cp .env.example .env
nano .env
```

**Edit .env with production values:**
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_city_lipa
DB_USER=smart_city_user
DB_PASSWORD=STRONG_PASSWORD_HERE

# JWT
JWT_SECRET=GENERATE_STRONG_SECRET_HERE
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Groq AI
GROQ_API_KEY=your_groq_api_key_here
```

```bash
# Frontend environment
cd /var/www/smart-city-lipa/frontend
cp .env.example .env
nano .env
```

**Edit .env:**
```env
VITE_API_URL=https://yourdomain.com/api/v1
VITE_SOCKET_URL=https://yourdomain.com
```

### Step 4: Database Setup (5 minutes)

```bash
# Create database and user
sudo mysql -u root -p

CREATE DATABASE smart_city_lipa;
CREATE USER 'smart_city_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON smart_city_lipa.* TO 'smart_city_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
cd /var/www/smart-city-lipa/backend
npm run db:sync

# Seed data (optional)
npm run seed
```

### Step 5: Build Frontend (3 minutes)

```bash
cd /var/www/smart-city-lipa/frontend
npm run build
```

### Step 6: Configure Nginx (5 minutes)

```bash
sudo nano /etc/nginx/sites-available/smart-city-lipa
```

**Add configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/smart-city-lipa/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smart-city-lipa /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7: Start Application (2 minutes)

```bash
# Start backend with PM2
cd /var/www/smart-city-lipa/backend
pm2 start app.js --name smart-city-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 8: SSL Certificate (5 minutes)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 9: Verify Deployment (5 minutes)

**Check services:**
```bash
# Check Nginx
sudo systemctl status nginx

# Check MySQL
sudo systemctl status mysql

# Check PM2
pm2 status

# Check application logs
pm2 logs smart-city-backend
```

**Test application:**
1. Visit https://yourdomain.com
2. Test user registration
3. Test user login
4. Test incident submission
5. Test admin login
6. Test emergency broadcast
7. Test real-time notifications

---

## Post-Deployment Checklist

### Immediate Verification

- [ ] Website loads correctly
- [ ] API endpoints responding
- [ ] Socket.io connections working
- [ ] Database queries working
- [ ] File uploads working
- [ ] Authentication working
- [ ] Admin panel accessible
- [ ] Real-time features working
- [ ] SSL certificate valid
- [ ] All pages accessible

### Performance Verification

- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Real-time latency < 100ms
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images loading correctly

### Security Verification

- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] Input validation working
- [ ] No sensitive data exposed
- [ ] Security headers present

---

## Monitoring Setup

### 1. Application Monitoring

**PM2 Monitoring:**
```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# View process info
pm2 info smart-city-backend
```

### 2. Server Monitoring

**Install monitoring tools:**
```bash
# Install htop
sudo apt install -y htop

# Install netdata (optional)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

### 3. Log Monitoring

**Set up log rotation:**
```bash
sudo nano /etc/logrotate.d/smart-city-lipa
```

```
/var/www/smart-city-lipa/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 4. Uptime Monitoring

**Recommended services:**
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

---

## Backup Strategy

### Database Backup

**Automated daily backup:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-smart-city-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/smart-city-lipa"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u smart_city_user -p'PASSWORD' smart_city_lipa | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-smart-city-db.sh

# Add to crontab
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-smart-city-db.sh
```

### File Backup

**Backup uploads directory:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-smart-city-files.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/smart-city-lipa"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/smart-city-lipa/backend/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +7 -delete
```

---

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor server resources
- [ ] Verify backup completion
- [ ] Check uptime status

### Weekly
- [ ] Review performance metrics
- [ ] Check security logs
- [ ] Update dependencies (if needed)
- [ ] Test backup restoration

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database optimization
- [ ] Review and update documentation

---

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs smart-city-backend --lines 100

# Check Node.js version
node --version

# Check environment variables
pm2 env 0
```

### Database connection error

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u smart_city_user -p smart_city_lipa

# Check credentials in .env
cat /var/www/smart-city-lipa/backend/.env | grep DB_
```

### Nginx errors

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Rollback Procedure

If deployment fails:

```bash
# Stop application
pm2 stop smart-city-backend

# Restore database
mysql -u smart_city_user -p smart_city_lipa < /var/backups/smart-city-lipa/db_backup_YYYYMMDD_HHMMSS.sql.gz

# Revert code
cd /var/www/smart-city-lipa
git checkout previous-stable-tag

# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Restart application
pm2 restart smart-city-backend
```

---

## Support & Resources

### Documentation
- [Deployment Checklist](docs/deployment/DEPLOYMENT_CHECKLIST.md)
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)
- [Troubleshooting Guide](docs/guides/TROUBLESHOOTING_GUIDE.md)

### External Resources
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## Deployment Status

**Current Status:** Ready for Deployment 🚀

**Checklist:**
- [x] Code ready
- [x] Documentation complete
- [x] Configuration templates ready
- [x] Deployment guides prepared
- [x] Backup strategy documented
- [x] Monitoring plan ready
- [ ] Server provisioned
- [ ] Domain configured
- [ ] Application deployed
- [ ] SSL configured
- [ ] Monitoring active

---

**Last Updated:** May 16, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
