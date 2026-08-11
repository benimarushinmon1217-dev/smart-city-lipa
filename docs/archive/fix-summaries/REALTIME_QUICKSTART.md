# ⚡ Real-Time System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install `socket.io` along with other dependencies.

---

## Step 2: Start the Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully
✅ Database models synced
🚀 Server running in development mode on port 5000
📍 API available at http://localhost:5000/api/v1
🏥 Health check at http://localhost:5000/health
🔌 Socket.io ready for real-time connections
✅ Socket.io server initialized
```

---

## Step 3: Test Socket Connection

Create a file `test-realtime.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Real-Time Test</title>
  <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
  <style>
    body { font-family: Arial; padding: 20px; }
    .event { padding: 10px; margin: 5px 0; border-left: 4px solid #4CAF50; background: #f0f0f0; }
    .alert { border-left-color: #f44336; }
    .warning { border-left-color: #ff9800; }
  </style>
</head>
<body>
  <h1>🔌 Smart City Lipa - Real-Time Test</h1>
  <div id="status">Connecting...</div>
  <hr>
  <h2>Events:</h2>
  <div id="events"></div>

  <script>
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      document.getElementById('status').innerHTML = '✅ Connected! Socket ID: ' + socket.id;
      console.log('Connected:', socket.id);

      // Subscribe to barangay 1
      socket.emit('subscribe:barangay', 1);
    });

    socket.on('subscribed:barangay', (data) => {
      addEvent('Subscribed to Barangay ' + data.barangayId, 'info');
    });

    // Wind changes
    socket.on('wind:changed', (data) => {
      addEvent(`Wind changed to ${data.direction} at ${data.speed} km/h`, 'info');
    });

    // Flood alerts
    socket.on('flood:alert', (data) => {
      addEvent(`🚨 FLOOD ALERT: ${data.message}`, 'alert');
    });

    // Route danger
    socket.on('route:danger:detected', (data) => {
      addEvent(`⚠️ Route Danger: ${data.dangerType}`, 'warning');
    });

    // Incidents
    socket.on('incident:reported', (data) => {
      addEvent(`📢 New Incident: ${data.incident.title}`, 'info');
    });

    // Emergency alerts
    socket.on('emergency:alert', (data) => {
      addEvent(`🚨 EMERGENCY: ${data.message}`, 'alert');
    });

    // Evacuation orders
    socket.on('evacuation:order', (data) => {
      addEvent(`🚨 EVACUATION ORDER: ${data.reason}`, 'alert');
    });

    // Notifications
    socket.on('notification:new', (data) => {
      addEvent(`🔔 ${data.notification.title}`, 'info');
    });

    socket.on('disconnect', () => {
      document.getElementById('status').innerHTML = '❌ Disconnected';
    });

    function addEvent(message, type) {
      const div = document.createElement('div');
      div.className = 'event ' + type;
      div.textContent = new Date().toLocaleTimeString() + ' - ' + message;
      document.getElementById('events').insertBefore(div, document.getElementById('events').firstChild);
    }
  </script>
</body>
</html>
```

Open this file in your browser and watch real-time events!

---

## Step 4: Trigger Events from Backend

### Option A: Using Node.js REPL

```bash
node
```

```javascript
const { handleWindChanged, handleFloodUpdated } = require('./sockets/eventHandlers');

// Trigger wind change
handleWindChanged({
  direction: 'Northeast',
  speed: 25,
  affectedBarangays: [1, 2, 3]
});

// Trigger flood alert
handleFloodUpdated({
  barangayId: 1,
  barangayName: 'Poblacion',
  oldLevel: 'Low',
  newLevel: 'High',
  riskScore: 0.85
});
```

### Option B: Create Test Script

Create `backend/test-events.js`:

```javascript
const { handleWindChanged, handleFloodUpdated, handleEmergencyAnnouncement } = require('./sockets/eventHandlers');

console.log('Triggering test events...');

// Wind change
setTimeout(() => {
  console.log('1. Wind changed');
  handleWindChanged({
    direction: 'Northeast',
    speed: 25,
    affectedBarangays: [1, 2, 3]
  });
}, 1000);

// Flood alert
setTimeout(() => {
  console.log('2. Flood alert');
  handleFloodUpdated({
    barangayId: 1,
    barangayName: 'Poblacion',
    oldLevel: 'Low',
    newLevel: 'High',
    riskScore: 0.85
  });
}, 3000);

// Emergency announcement
setTimeout(() => {
  console.log('3. Emergency announcement');
  handleEmergencyAnnouncement({
    announcement: {
      title: 'Typhoon Warning',
      content: 'Typhoon approaching in 6 hours',
      priority: 'urgent',
      type: 'emergency'
    },
    targetAudience: 'all'
  });
}, 5000);

console.log('Events scheduled. Keep server running...');
```

Run it:
```bash
node backend/test-events.js
```

---

## Step 5: Test Notification API

### Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Login (save the token)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Test Notifications

```bash
# Get notifications
curl http://localhost:5000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get unread count
curl http://localhost:5000/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Common Use Cases

### 1. **Emit to Specific User**

```javascript
const { emitToUser } = require('./config/socket');

emitToUser(userId, 'notification:new', {
  title: 'Flood Alert',
  message: 'High flood risk in your area',
  severity: 'urgent'
});
```

### 2. **Emit to Barangay**

```javascript
const { emitToBarangay } = require('./config/socket');

emitToBarangay(barangayId, 'flood:alert', {
  barangayName: 'Poblacion',
  level: 'High',
  message: 'Evacuate immediately'
});
```

### 3. **Broadcast to All**

```javascript
const { broadcast } = require('./config/socket');

broadcast('emergency:alert', {
  type: 'typhoon',
  message: 'Typhoon approaching',
  severity: 'critical'
});
```

### 4. **Use Event Handlers**

```javascript
const { handleIncidentReported } = require('./sockets/eventHandlers');

handleIncidentReported({
  incident: {
    id: 1,
    title: 'Road Flooding',
    severity: 'high'
  },
  barangayId: 1,
  reporterId: 123
});
```

---

## 🔧 Integration Examples

### In Your Controllers

```javascript
// incidentController.js
const { handleIncidentReported } = require('../sockets/eventHandlers');

exports.createIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.create(req.body);

  // Emit real-time event
  handleIncidentReported({
    incident: incident.toJSON(),
    barangayId: incident.barangay_id,
    reporterId: req.user.id
  });

  ApiResponse.success(res, incident, 'Incident created', 201);
});
```

### In Your Services

```javascript
// windService.js
const { handleWindChanged } = require('../sockets/eventHandlers');

exports.updateWindDirection = async (direction, speed) => {
  // Update database...
  
  // Emit real-time event
  handleWindChanged({
    direction,
    speed,
    affectedBarangays: getAffectedBarangays(direction)
  });
};
```

---

## 📱 Frontend Integration

### React Example

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected!');
      newSocket.emit('subscribe:barangay', 1);
    });

    newSocket.on('flood:alert', (data) => {
      setEvents(prev => [...prev, data]);
      showNotification(data.message);
    });

    newSocket.on('wind:changed', (data) => {
      updateWindDisplay(data.direction, data.speed);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <div>
      <h1>Smart City Lipa</h1>
      {events.map((event, i) => (
        <div key={i}>{event.message}</div>
      ))}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Socket Not Connecting

**Check:**
1. Server is running: `npm run dev`
2. Port 5000 is not blocked
3. CORS is configured correctly
4. Browser console for errors

### Events Not Received

**Check:**
1. Client is subscribed to correct room
2. Event name matches exactly
3. Server is emitting to correct room
4. Check server logs

### Authentication Failed

**Check:**
1. JWT token is valid
2. Token is sent in `auth.token` or `Authorization` header
3. User exists and is active
4. Token hasn't expired

---

## 📚 Documentation

- **[REALTIME_IMPLEMENTATION_GUIDE.md](REALTIME_IMPLEMENTATION_GUIDE.md)** - Complete guide
- **[UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md)** - What was built
- **[REALTIME_QUICKSTART.md](REALTIME_QUICKSTART.md)** - This file

---

## ✅ Checklist

- [ ] Server starts successfully
- [ ] Socket.io initialized message appears
- [ ] Test HTML page connects
- [ ] Can subscribe to barangay
- [ ] Events are received
- [ ] Notifications API works
- [ ] Authentication works

---

## 🎉 You're Ready!

Your real-time system is now operational. Start building amazing features!

**Next Steps:**
1. Integrate with your existing features
2. Build the frontend Socket.io client
3. Add more event types as needed
4. Proceed to Phase 2: Admin Dashboard

---

**Happy coding! 🚀**
