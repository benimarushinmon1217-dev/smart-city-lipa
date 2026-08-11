# 🎨 Frontend Setup Guide - React + Vite

## Smart City Lipa - Modern Frontend Architecture

---

## 📋 Technology Stack

### Core
- **Framework:** React 18+
- **Build Tool:** Vite 5+
- **Language:** JavaScript (with option for TypeScript)
- **Package Manager:** npm

### State Management & Data
- **State:** Zustand (lightweight, simple)
- **HTTP Client:** Axios
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation

### UI & Styling
- **CSS Framework:** Tailwind CSS
- **Components:** Headless UI + Custom components
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Routing & Real-Time
- **Routing:** React Router v6
- **Real-Time:** Socket.io-client
- **Map:** Leaflet + React-Leaflet

### Development Tools
- **Linting:** ESLint
- **Formatting:** Prettier
- **Dev Server:** Vite dev server with HMR

---

## 🚀 Quick Start

### Step 1: Create Vite Project

```bash
# From project root
npm create vite@latest frontend -- --template react

cd frontend
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install react-router-dom zustand axios @tanstack/react-query

# UI & Styling
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react lucide-react react-hot-toast

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Map
npm install leaflet react-leaflet

# Real-time
npm install socket.io-client

# Utilities
npm install clsx tailwind-merge date-fns

# Development
npm install -D @types/leaflet
```

### Step 3: Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### Step 4: Project Structure

```bash
mkdir -p src/{components,pages,layouts,hooks,services,stores,utils,config,assets}
mkdir -p src/components/{common,map,incidents,reports,admin,notifications}
mkdir -p src/pages/{auth,dashboard,incidents,reports,admin,map}
```

---

## 📁 Complete Folder Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   └── styles/
│   │       └── index.css
│   │
│   ├── components/          # React components
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Alert.jsx
│   │   │
│   │   ├── map/             # Map components
│   │   │   ├── MapContainer.jsx
│   │   │   ├── BarangayLayer.jsx
│   │   │   ├── IncidentMarkers.jsx
│   │   │   ├── HazardOverlay.jsx
│   │   │   └── RouteDisplay.jsx
│   │   │
│   │   ├── incidents/       # Incident components
│   │   │   ├── IncidentCard.jsx
│   │   │   ├── IncidentForm.jsx
│   │   │   ├── IncidentList.jsx
│   │   │   └── IncidentDetails.jsx
│   │   │
│   │   ├── reports/         # Report components
│   │   │   ├── ReportCard.jsx
│   │   │   ├── ReportForm.jsx
│   │   │   └── ReportList.jsx
│   │   │
│   │   ├── admin/           # Admin components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserTable.jsx
│   │   │   ├── IncidentTable.jsx
│   │   │   ├── ReportTable.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   ├── notifications/   # Notification components
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── NotificationList.jsx
│   │   │   └── NotificationItem.jsx
│   │   │
│   │   └── chatbot/         # AI Chatbot
│   │       ├── ChatWidget.jsx
│   │       ├── ChatMessage.jsx
│   │       └── ChatInput.jsx
│   │
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── map/
│   │   │   └── MapView.jsx
│   │   │
│   │   ├── incidents/
│   │   │   ├── IncidentList.jsx
│   │   │   ├── IncidentDetails.jsx
│   │   │   └── CreateIncident.jsx
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportList.jsx
│   │   │   ├── ReportDetails.jsx
│   │   │   └── CreateReport.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── IncidentManagement.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useNotifications.js
│   │   ├── useIncidents.js
│   │   ├── useReports.js
│   │   └── useMap.js
│   │
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   ├── incidentService.js
│   │   ├── reportService.js
│   │   ├── adminService.js
│   │   ├── aiService.js
│   │   ├── barangayService.js
│   │   └── socketService.js
│   │
│   ├── stores/              # Zustand stores
│   │   ├── authStore.js
│   │   ├── notificationStore.js
│   │   ├── mapStore.js
│   │   └── uiStore.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── cn.js            # Class name utility
│   │   ├── formatters.js    # Date, number formatters
│   │   ├── validators.js    # Validation helpers
│   │   └── constants.js     # App constants
│   │
│   ├── config/              # Configuration
│   │   ├── api.config.js
│   │   ├── socket.config.js
│   │   └── map.config.js
│   │
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

---

## 🔧 Configuration Files

### 1. `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
})
```

### 2. `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
```

### 3. `.env.example`

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# Map Configuration
VITE_MAP_CENTER_LAT=13.9414
VITE_MAP_CENTER_LNG=121.1628
VITE_MAP_ZOOM=13

# Feature Flags
VITE_ENABLE_AI_CHATBOT=true
VITE_ENABLE_REAL_TIME=true

# App Configuration
VITE_APP_NAME=Smart City Lipa
VITE_APP_VERSION=1.0.0
```

### 4. `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Leaflet CSS */
@import 'leaflet/dist/leaflet.css';

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }
  
  .btn-danger {
    @apply bg-danger-600 text-white hover:bg-danger-700;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* Map container */
.leaflet-container {
  height: 100%;
  width: 100%;
  z-index: 0;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## 🎯 Key Features to Implement

### Phase 1: Core Setup ✅
- [x] Project initialization
- [x] Folder structure
- [x] Configuration files
- [x] Tailwind CSS setup

### Phase 2: Authentication (Priority 1)
- [ ] Login page
- [ ] Register page
- [ ] Auth store (Zustand)
- [ ] Auth service (API calls)
- [ ] Protected routes
- [ ] Token management

### Phase 3: Main Layout (Priority 1)
- [ ] Navbar with user menu
- [ ] Sidebar navigation
- [ ] Notification bell
- [ ] Responsive design

### Phase 4: Dashboard (Priority 2)
- [ ] User dashboard
- [ ] Statistics cards
- [ ] Recent incidents
- [ ] Quick actions

### Phase 5: Map Interface (Priority 2)
- [ ] Leaflet map setup
- [ ] Barangay boundaries
- [ ] Incident markers
- [ ] Hazard overlays
- [ ] Interactive popups

### Phase 6: Incident Management (Priority 2)
- [ ] Incident list
- [ ] Incident details
- [ ] Create incident form
- [ ] Image upload
- [ ] Real-time updates

### Phase 7: Report System (Priority 3)
- [ ] Report list
- [ ] Report form
- [ ] Report details
- [ ] Status tracking

### Phase 8: Real-Time Features (Priority 2)
- [ ] Socket.io integration
- [ ] Real-time notifications
- [ ] Live incident feed
- [ ] Alert system

### Phase 9: AI Chatbot (Priority 3)
- [ ] Chat widget
- [ ] Message interface
- [ ] AI integration
- [ ] Context awareness

### Phase 10: Admin Dashboard (Priority 3)
- [ ] Admin layout
- [ ] User management
- [ ] Incident moderation
- [ ] Analytics charts
- [ ] Emergency controls

---

## 🚀 Development Workflow

### 1. Start Development Server

```bash
cd frontend
npm run dev
```

### 2. Build for Production

```bash
npm run build
```

### 3. Preview Production Build

```bash
npm run preview
```

---

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 🎨 Design System

### Colors
- **Primary:** Blue (#3b82f6) - Main actions, links
- **Danger:** Red (#ef4444) - Errors, critical alerts
- **Warning:** Amber (#f59e0b) - Warnings, medium priority
- **Success:** Green (#22c55e) - Success messages, safe status
- **Gray:** Neutral colors for text and backgrounds

### Typography
- **Font:** Inter (system fallback)
- **Headings:** Bold, larger sizes
- **Body:** Regular weight, readable size

### Spacing
- Use Tailwind's spacing scale (4px base)
- Consistent padding and margins

---

## 🔐 Security Best Practices

1. **Token Storage:** Use httpOnly cookies or secure localStorage
2. **API Keys:** Never commit API keys (use .env)
3. **Input Validation:** Validate all user inputs
4. **XSS Prevention:** Sanitize user-generated content
5. **HTTPS:** Use HTTPS in production

---

## 📱 Responsive Design

- **Mobile First:** Design for mobile, enhance for desktop
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

---

## 🧪 Testing (Future)

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## 📚 Next Steps

1. **Run the setup commands above**
2. **Review the generated files**
3. **Start implementing components**
4. **Test with backend API**

---

**Ready to build! Let's create the core files next.** 🚀

