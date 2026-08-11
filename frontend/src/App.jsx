/**
 * App Component
 * Main application component with routing
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Stores
import useAuthStore from './stores/authStore';

// Services
import socketService from './services/socketService';

// Hooks
import { useSocketEvents } from './hooks/useSocketEvents';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Main
import Dashboard from './pages/dashboard/Dashboard';
import MapView from './pages/map/MapView';

// Pages - Incidents
import IncidentList from './pages/incidents/IncidentList';
import IncidentDetails from './pages/incidents/IncidentDetails';
import EditIncident from './pages/incidents/EditIncident';
import CreateIncident from './pages/incidents/CreateIncident';

// Pages - Reports
import ReportList from './pages/reports/ReportList';
import ReportDetails from './pages/reports/ReportDetails';
import CreateReport from './pages/reports/CreateReport';
import EditReport from './pages/reports/EditReport';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import IncidentManagement from './pages/admin/IncidentManagement';
import ReportManagement from './pages/admin/ReportManagement';
import Analytics from './pages/admin/Analytics';
import ShelterManagement from './pages/admin/ShelterManagement';
import Broadcast from './pages/admin/Broadcast';

// Pages - User
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Notifications from './pages/notifications/Notifications';

// Pages - Emergency
import EmergencyHotlines from './pages/emergency/EmergencyHotlines';
import TestEmergencyAlert from './pages/TestEmergencyAlert';

// Components
import { PageSpinner } from './components/common';
import ProtectedRoute from './components/ProtectedRoute';
import AIAdvisorWidget from './components/ai/AIAdvisorWidget';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalEmergencyAlert from './components/GlobalEmergencyAlert';
import NotFound from './pages/NotFound';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Wrapper component to use hooks inside QueryClientProvider
function AppContent() {
  const { isAuthenticated } = useAuthStore();

  // Centralized socket event handling - prevents duplicate listeners
  useSocketEvents();

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Map */}
          <Route path="/map" element={<MapView />} />

          {/* Incidents */}
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/new" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetails />} />
          <Route path="/incidents/:id/edit" element={<EditIncident />} />

          {/* Reports */}
          <Route path="/reports" element={<ReportList />} />
          <Route path="/reports/new" element={<CreateReport />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route path="/reports/:id/edit" element={<EditReport />} />

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Emergency Routes */}
          <Route path="/emergency/hotlines" element={<EmergencyHotlines />} />
          <Route path="/test-alert" element={<TestEmergencyAlert />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <ProtectedRoute requireAdmin>
                <IncidentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requireAdmin>
                <ReportManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requireAdmin>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shelters"
            element={
              <ProtectedRoute requireAdmin>
                <ShelterManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/broadcast"
            element={
              <ProtectedRoute requireAdmin>
                <Broadcast />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/* AI Advisor Widget - Available when authenticated */}
      {isAuthenticated && <AIAdvisorWidget />}

      {/* Global Emergency Alert - Available when authenticated */}
      {isAuthenticated && <GlobalEmergencyAlert />}
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
